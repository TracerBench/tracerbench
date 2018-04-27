import { HierarchyNode } from 'd3-hierarchy';
import { ICallFrame, ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Archive } from './archive_trace';
import { ParsedFile } from './metadata';
import { Categories, Locator } from './utils';
// tslint:disable:member-ordering

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
  name: string;
  callframes: CallFrameInfo[];
}

export interface Categorized {
  [key: string]: AggregationResult[];
}

function toRegex(locators: Locator[]) {
  return locators.map(({ functionName }) => {
    let parts = functionName.split('.'); // Path expression
    if (parts.length > 1) {
      parts.shift();
      return new RegExp(`^([A-z]+\\.${parts.join('\\.')})$`);
    }
    return new RegExp(`^${functionName}$`);
  });
}

export function verifyMethods(array: Locator[]) {
  let valuesSoFar: string[] = [];
  for (let i = 0; i < array.length; ++i) {
    let { functionName, moduleName } = array[i];
    let key = `${functionName}${moduleName}`;
    if (valuesSoFar.includes(key)) {
      throw new Error(`Duplicate heuristic detected ${moduleName}@${functionName}`);
    }
    valuesSoFar.push(key);
  }
}

export function categorizeAggregations(aggregations: Aggregations, categories: Categories) {
  let categorized: Categorized = {
    unknown: [aggregations.unknown],
  };

  Object.keys(categories).forEach(category => {
    if (!categorized[category]) {
      categorized[category] = [];
    }

    Object.keys(aggregations).forEach(methodName => {
      if (categories[category].find(locator => locator.functionName === methodName)) {
        categorized[category].push(aggregations[methodName]);
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
  private regexMethods: RegExp[];
  private locators: Locator[];
  private matcher: RegExp | undefined;
  private parsedFiles: ParsedFiles = {};
  private archive: Archive;

  constructor(locators: Locator[], archive: Archive) {
    this.archive = archive;
    this.regexMethods = toRegex(locators);
    this.locators = locators;
    locators.forEach(({ functionName }) => {
      this._aggregations[functionName] = {
        total: 0,
        self: 0,
        attributed: 0,
        name: functionName,
        callframes: [],
      };
    });

    this._aggregations.unknown = {
      total: 0,
      self: 0,
      attributed: 0,
      name: 'unknown',
      callframes: [],
    };
  }

  match(callFrame: ICallFrame) {
    let matched = this.matchHeuristic(callFrame);
    if (matched) {
      return matched;
    }

    let matcher: RegExp | undefined;
    let { functionName } = callFrame;

    for (let i = 0; i < this.regexMethods.length; i++) {
      let regex = this.regexMethods[i];
      let match = regex.test(functionName);

      if (match) {
        return this.locators[i];
      }
    }
  }

  canonicalizeName() {
    let matcherIndex = this.regexMethods.indexOf(this.matcher!);
    return this.locators[matcherIndex];
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
      let { total, attributed, callframes } = this._aggregations[method];
      this._aggregations[method].self = callframes.reduce((a, c) => a + c.self, 0);
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

  private matchHeuristic(callFrame: ICallFrame) {
    return this.locators.find(locator => {

      let sameFN = locator.functionName === callFrame.functionName;

      if (locator.moduleName === '*' && sameFN) {
        return true;
      }

      if (this.isBuiltIn(callFrame)) return false;

      let sameMN = locator.moduleName === this.findModuleName(locator, callFrame);

      return sameMN && sameFN;
    });
  }

  private contentFor(url: string) {
    let entry = this.archive.log.entries.find(e => e.request.url === url);

    if (!entry) {
      throw new Error(`Could not find "${url}" in the archive file.`);
    }

    return entry.response.content.text;
  }

  private findModuleName(locator: Locator, callFrame: ICallFrame) {
    let { url } = callFrame;
    let { parsedFiles } = this;
    let file = parsedFiles[url];
    if (file) {
      return file.moduleNameFor(callFrame);
    }

    file = this.parsedFiles[url] = new ParsedFile(this.contentFor(url));
    return file.moduleNameFor(callFrame);
  }
}

export function collapseCallFrames(aggregations: Aggregations) {
  Object.keys(aggregations).forEach(methodName => {
    let collapsed: CallFrameInfo[] = [];
    let keys: string[] = [];

    aggregations[methodName].callframes.forEach(callframeInfo => {
      let collapedStack: ICallFrame[] = [];
      let key = callframeInfo.stack.reduce((acc, cur) => {
        let { functionName, columnNumber, lineNumber } = cur;
        return acc += `${functionName}${columnNumber}${lineNumber}`;
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

export function aggregate(hierarchy: HierarchyNode<ICpuProfileNode>, locators: Locator[], archive: Archive) {
  let aggregations = new AggregrationCollector(locators, archive);
  let containments: string[] = [];
  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    let { self } = node.data;

    if (self !== 0) {
      let currentNode: HierarchyNode<ICpuProfileNode> | null = node;
      let stack: ICallFrame[] = [];
      let containerNode: HierarchyNode<ICpuProfileNode> | null = null;

      while (currentNode) {
        let canonicalLocator = aggregations.match(currentNode.data.callFrame);
        if (canonicalLocator) {
          let { functionName: canonicalizeName } = canonicalLocator;
          if (!containerNode) {
            aggregations.addToAttributed(canonicalizeName, self);
            aggregations.pushCallFrames(canonicalizeName, { self, stack });
            containerNode = currentNode;
          }
          aggregations.addToTotal(canonicalizeName, self);
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
