import { HierarchyNode } from 'd3-hierarchy';
import { prototype } from 'events';
import { ICallFrame, ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Categories, Locator } from './utils';

// tslint:disable:member-ordering

export interface CallFrameInfo {
  self: number;
  stack: ICallFrame[];
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

function isHit(locators: Locator[], name: string) {
  return locators.find(locator => locator.functionName === name);
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

function toRegex(methods: string[]) {
  return methods.map(method => {
    let parts = method.split('.'); // Path expression
    if (parts.length > 1) {
      parts.shift();
      return new RegExp(`^([A-z]+\\.${parts.join('\\.')})$`);
    }
    return new RegExp(`^${method}$`);
  });
}

class AggregrationCollector {
  private _aggregations: Aggregations = {};
  private regexMethods: RegExp[];
  private methods: string[];
  private matcher: RegExp | undefined;

  constructor(methods: string[]) {
    this.regexMethods = toRegex(methods);
    this.methods = methods;
    methods.forEach(method => {
      this._aggregations[method] = {
        total: 0,
        self: 0,
        attributed: 0,
        name: method,
        callframes: [],
      };
    });
  }

  matchCanonicalName(name: string) {
    if (this.methods.includes(name)) {
      return name;
    }

    let matcher: RegExp | undefined;

    for (let i = 0; i < this.regexMethods.length; i++) {
      let regex = this.regexMethods[i];
      let match = regex.test(name);

      if (match) {
        return this.methods[i];
      }
    }
  }

  canonicalizeName() {
    let matcherIndex = this.regexMethods.indexOf(this.matcher!);
    return this.methods[matcherIndex];
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
}

export function aggregate(hierarchy: HierarchyNode<ICpuProfileNode>, methods: string[]) {
  let aggregations = new AggregrationCollector([...methods, 'unknown']);
  let containments: string[] = [];
  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    let { self } = node.data;

    if (self !== 0) {
      let currentNode: HierarchyNode<ICpuProfileNode> | null = node;
      let stack: ICallFrame[] = [];
      let containerNode: HierarchyNode<ICpuProfileNode> | null = null;

      while (currentNode) {
        let { functionName } = currentNode.data.callFrame;
        let canonicalName = aggregations.matchCanonicalName(functionName);
        if (canonicalName) {
          if (!containerNode) {
            aggregations.addToAttributed(canonicalName, self);
            aggregations.pushCallFrames(canonicalName, { self, stack });
            containerNode = currentNode;
          }
          aggregations.addToTotal(canonicalName, self);
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
