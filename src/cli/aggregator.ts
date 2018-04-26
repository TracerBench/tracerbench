import { HierarchyNode } from 'd3-hierarchy';
import { prototype } from 'events';
import { ICallFrame, ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Categories } from './utils';

// tslint:disable:member-ordering

export interface CallFrameInfo {
  self: number;
  stack: ICallFrame[];
}

export interface Categorized {
  [key: string]: AggregationResult[];
}

export function verifyMethods(array: string[]) {
  let valuesSoFar = Object.create(null);
  for (let i = 0; i < array.length; ++i) {
    let value = array[i];
    if (value in valuesSoFar) {
      throw new Error(`Duplicate heuristic detected ${value}`);
    }
    valuesSoFar[value] = true;
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
      if (categories[category].includes(methodName)) {
        categorized[category].push(aggregations[methodName]);
      }
    });
  });

  return categorized;
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

class AggregrationCollector {
  private _aggregations: Aggregations = {};

  constructor(methods: string[]) {
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
        if (methods.includes(functionName)) {
          if (!containerNode) {
            aggregations.addToAttributed(functionName, self);
            aggregations.pushCallFrames(functionName, { self, stack });
            containerNode = currentNode;
          }
          aggregations.addToTotal(functionName, self);
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
