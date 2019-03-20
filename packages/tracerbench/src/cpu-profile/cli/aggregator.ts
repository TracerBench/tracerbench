// tslint:disable:member-ordering

import { HierarchyNode } from 'd3-hierarchy';

import { ICallFrame, ICpuProfileNode } from '../../trace';
import { Archive } from './archive_trace';
import { ParsedFile } from './metadata';
import { ModuleMatcher } from './module_matcher';
import { Categories, Locator } from './utils';

export interface CallFrameInfo {
  self: number;
  stack: ICallFrame[];
}

export interface Aggregations {
  [key: string]: AggregationResult;
}

export interface AggregationResult {
  total: number;
  self: number;
  attributed: number;
  functionName: string;
  moduleName: string;
  callframes: CallFrameInfo[];
}

export interface Categorized {
  [key: string]: AggregationResult[];
}

export function verifyMethods(array: Locator[]) {
  let valuesSoFar: string[] = [];
  for (let i = 0; i < array.length; ++i) {
    let { functionName, moduleName } = array[i];
    let key = `${functionName}${moduleName}`;
    if (valuesSoFar.includes(key)) {
      throw new Error(
        `Duplicate heuristic detected ${moduleName}@${functionName}`
      );
    }
    valuesSoFar.push(key);
  }
}

export function categorizeAggregations(
  aggregations: Aggregations,
  categories: Categories
) {
  let categorized: Categorized = {
    unknown: [aggregations.unknown]
  };

  Object.keys(categories).forEach(category => {
    if (!categorized[category]) {
      categorized[category] = [];
    }

    Object.values(aggregations).forEach(aggergation => {
      if (
        categories[category].find(
          locator =>
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

export interface ParsedFiles {
  [key: string]: ParsedFile;
}

class AggregrationCollector {
  private _aggregations: Aggregations = {};
  private locators: Locator[];
  private modMatcher: ModuleMatcher;
  matcher: RegExp | undefined;
  parsedFiles: ParsedFiles = {};
  archive: Archive;
  hierarchy: HierarchyNode<ICpuProfileNode>;

  constructor(
    locators: Locator[],
    archive: Archive,
    hierarchy: HierarchyNode<ICpuProfileNode>,
    modMatcher: ModuleMatcher
  ) {
    this.locators = locators;
    this.archive = archive;
    this.hierarchy = hierarchy;
    this.modMatcher = modMatcher;

    locators.forEach(({ functionName, moduleName }) => {
      this._aggregations[functionName + moduleName] = {
        total: 0,
        self: 0,
        attributed: 0,
        functionName,
        moduleName,
        callframes: []
      };
    });

    this._aggregations.unknown = {
      total: 0,
      self: 0,
      attributed: 0,
      functionName: 'unknown',
      moduleName: 'unknown',
      callframes: []
    };
  }

  pushCallFrames(name: string, callFrame: CallFrameInfo) {
    this._aggregations[name].callframes.push(callFrame);
  }

  addToAttributed(name: string, time: number) {
    this._aggregations[name].attributed += time;
  }

  addToTotal(name: string, time: number) {
    this._aggregations[name].total += time;
  }

  collect() {
    Object.keys(this._aggregations).forEach(method => {
      let { callframes } = this._aggregations[method];
      this._aggregations[method].self = callframes.reduce(
        (a, c) => a + c.self,
        0
      );
    });

    return this._aggregations;
  }

  private isBuiltIn(callFrame: ICallFrame) {
    let { url, lineNumber } = callFrame;
    if (url === undefined) return true;
    if (url === 'extensions::SafeBuiltins') return true;
    if (url === 'v8/LoadTimes') return true;
    if (url === 'native array.js') return true;
    if (url === 'native intl.js') return true;
    if (lineNumber === -1 || lineNumber === undefined) return true;

    return false;
  }

  match(callFrame: ICallFrame) {
    return this.locators.find(locator => {
      // try to avoid having to regex match is there are .* entries
      let sameFN = locator.functionName === callFrame.functionName;
      if (locator.moduleName === '.*' && sameFN) return true;

      if (this.isBuiltIn(callFrame)) return false;

      let callFrameModuleName = this.modMatcher.findModuleName(callFrame);
      if (callFrameModuleName === undefined) return false;

      // try to avoid having to regex match is there are .* entries
      let sameMN = locator.moduleName === callFrameModuleName;
      if (sameMN && locator.functionName === '.*') return true;

      if (sameFN && sameMN) return true;

      // if nothing else matches, do full regex check
      let sameFNRegex = locator.functionNameRegex.test(callFrame.functionName);
      let sameMNRegex = locator.moduleNameRegex.test(callFrameModuleName);
      return sameFNRegex && sameMNRegex;
    });
  }
}

export function collapseCallFrames(aggregations: Aggregations) {
  Object.keys(aggregations).forEach(methodName => {
    let collapsed: CallFrameInfo[] = [];
    let keys: string[] = [];

    aggregations[methodName].callframes.forEach(callframeInfo => {
      let key = callframeInfo.stack.reduce((acc, cur) => {
        let { functionName, columnNumber, lineNumber } = cur;
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
  locators: Locator[],
  archive: Archive,
  modMatcher: ModuleMatcher
) {
  let aggregations = new AggregrationCollector(
    locators,
    archive,
    hierarchy,
    modMatcher
  );
  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    let { self } = node.data;
    if (self !== 0) {
      let currentNode: HierarchyNode<ICpuProfileNode> | null = node;
      let stack: ICallFrame[] = [];
      let containerNode: HierarchyNode<ICpuProfileNode> | null = null;

      while (currentNode) {
        let canonicalLocator = aggregations.match(currentNode.data.callFrame);
        if (canonicalLocator) {
          let {
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
