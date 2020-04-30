import { Archive } from '@tracerbench/har';
import { HierarchyNode } from 'd3-hierarchy';

import { ICallFrame, ICpuProfileNode } from '../trace';
import { ICategories, ILocator } from './analyze';
import { ParsedFile } from './metadata';
import { ModuleMatcher } from './module-matcher';

type ICallFrameInfo = {
  self: number;
  stack: ICallFrame[];
};

export type IAggregations = {
  [key: string]: IAggregationResult;
};

type IAggregationResult = {
  total: number;
  self: number;
  attributed: number;
  functionName: string;
  moduleName: string;
  callframes: ICallFrameInfo[];
};

export interface ICategorized {
  [key: string]: IAggregationResult[];
}

export function verifyMethods(array: ILocator[]): void {
  const valuesSoFar: string[] = [];
  for (let i = 0; i < array.length; ++i) {
    const { functionName, moduleName } = array[i];
    const key = `${functionName}${moduleName}`;
    if (valuesSoFar.includes(key)) {
      throw new Error(
        `Duplicate heuristic detected ${moduleName}@${functionName}`
      );
    }
    valuesSoFar.push(key);
  }
}

export function categorizeAggregations(
  aggregations: IAggregations,
  categories: ICategories
): ICategorized {
  const categorized: ICategorized = {
    unknown: [aggregations.unknown]
  };

  Object.keys(categories).forEach((category) => {
    if (!categorized[category]) {
      categorized[category] = [];
    }

    Object.values(aggregations).forEach((aggergation) => {
      if (
        categories[category].find(
          (locator) =>
            locator.functionName === aggergation.functionName &&
            locator.moduleName === aggergation.moduleName
        )
      ) {
        categorized[category].push(aggergation);
      }
    });
  });

  return categorized;
}

export interface IParsedFiles {
  [key: string]: ParsedFile;
}

class AggregrationCollector {
  private aggregations: IAggregations = {};
  private locators: ILocator[];
  private modMatcher: ModuleMatcher;
  public matcher: RegExp | undefined;
  public parsedFiles: IParsedFiles = {};
  public archive: Archive;
  public hierarchy: HierarchyNode<ICpuProfileNode>;

  constructor(
    locators: ILocator[],
    archive: Archive,
    hierarchy: HierarchyNode<ICpuProfileNode>,
    modMatcher: ModuleMatcher
  ) {
    this.locators = locators;
    this.archive = archive;
    this.hierarchy = hierarchy;
    this.modMatcher = modMatcher;

    locators.forEach(({ functionName, moduleName }) => {
      this.aggregations[functionName + moduleName] = {
        total: 0,
        self: 0,
        attributed: 0,
        functionName,
        moduleName,
        callframes: []
      };
    });

    this.aggregations.unknown = {
      total: 0,
      self: 0,
      attributed: 0,
      functionName: 'unknown',
      moduleName: 'unknown',
      callframes: []
    };
  }

  public pushCallFrames(name: string, callFrame: ICallFrameInfo): void {
    this.aggregations[name].callframes.push(callFrame);
  }

  public addToAttributed(name: string, time: number): void {
    this.aggregations[name].attributed += time;
  }

  public addToTotal(name: string, time: number): void {
    this.aggregations[name].total += time;
  }

  public collect(): IAggregations {
    Object.keys(this.aggregations).forEach((method) => {
      const { callframes } = this.aggregations[method];
      this.aggregations[method].self = callframes.reduce(
        (a, c) => a + c.self,
        0
      );
    });

    return this.aggregations;
  }

  public match(callFrame: ICallFrame): ILocator | undefined {
    return this.locators.find((locator) => {
      // try to avoid having to regex match is there are .* entries
      const sameFN = locator.functionName === callFrame.functionName;
      if (locator.moduleName === '.*' && sameFN) {
        return true;
      }
      if (this.isBuiltIn(callFrame)) {
        return false;
      }
      const callFrameModuleName = this.modMatcher.findModuleName(callFrame);
      if (callFrameModuleName === undefined) {
        return false;
      }
      // try to avoid having to regex match is there are .* entries
      const sameMN = locator.moduleName === callFrameModuleName;
      if (sameMN && locator.functionName === '.*') {
        return true;
      }
      if (sameFN && sameMN) {
        return true;
      }
      // if nothing else matches, do full regex check
      const sameFNRegex = locator.functionNameRegex.test(
        callFrame.functionName
      );
      const sameMNRegex = locator.moduleNameRegex.test(callFrameModuleName);
      return sameFNRegex && sameMNRegex;
    });
  }

  private isBuiltIn(callFrame: ICallFrame): boolean {
    const { url, lineNumber } = callFrame;
    if (url === undefined) {
      return true;
    }
    if (url === 'extensions::SafeBuiltins') {
      return true;
    }
    if (url === 'v8/LoadTimes') {
      return true;
    }
    if (url === 'native array.js') {
      return true;
    }
    if (url === 'native intl.js') {
      return true;
    }
    if (lineNumber === -1 || lineNumber === undefined) {
      return true;
    }
    return false;
  }
}

export function collapseCallFrames(aggregations: IAggregations): IAggregations {
  Object.keys(aggregations).forEach((methodName) => {
    const collapsed: ICallFrameInfo[] = [];
    const keys: string[] = [];

    aggregations[methodName].callframes.forEach((callframeInfo) => {
      const key = callframeInfo.stack.reduce((acc, cur) => {
        const { functionName, columnNumber, lineNumber } = cur;
        return (acc += `${functionName}${columnNumber}${lineNumber}`);
      }, '');

      if (!keys.includes(key)) {
        keys.push(key);
        collapsed.push(callframeInfo);
      }
    });

    aggregations[methodName].callframes = collapsed;
  });

  return aggregations;
}

export function aggregate(
  hierarchy: HierarchyNode<ICpuProfileNode>,
  locators: ILocator[],
  archive: Archive,
  modMatcher: ModuleMatcher
): IAggregations {
  const aggregations = new AggregrationCollector(
    locators,
    archive,
    hierarchy,
    modMatcher
  );
  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    const { self } = node.data;
    if (self !== 0) {
      let currentNode: HierarchyNode<ICpuProfileNode> | null = node;
      const stack: ICallFrame[] = [];
      let containerNode: HierarchyNode<ICpuProfileNode> | null = null;

      while (currentNode) {
        const canonicalLocator = aggregations.match(currentNode.data.callFrame);
        if (canonicalLocator) {
          const {
            functionName: canonicalizeName,
            moduleName: canonicalizeModName
          } = canonicalLocator;
          if (!containerNode) {
            aggregations.addToAttributed(
              canonicalizeName + canonicalizeModName,
              self
            );
            aggregations.pushCallFrames(
              canonicalizeName + canonicalizeModName,
              { self, stack }
            );
            containerNode = currentNode;
          }
          aggregations.addToTotal(canonicalizeName + canonicalizeModName, self);
        }
        stack.push(currentNode.data.callFrame);
        currentNode = currentNode.parent;
      }

      if (!containerNode) {
        aggregations.addToAttributed('unknown', self);
        aggregations.addToTotal('unknown', self);
        aggregations.pushCallFrames('unknown', { self, stack });
      }
    }
  });

  return aggregations.collect();
}
