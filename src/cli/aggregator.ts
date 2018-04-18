import { HierarchyNode } from 'd3-hierarchy';
import { prototype } from 'events';
import { ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Categories } from './utils';

// tslint:disable:member-ordering

export interface Aggregations {
  [key: string]: AggregationResult;
}

export interface AggregationResult {
  total: number;
  name: string;
  callsites: CallSite[];
  containers: Containers;
  containees: Containers;
}

export interface Containers {
  [key: string]: Containment;
}

export interface Containment {
  time: number;
  message: string;
}

export interface CallSite {
  time: number;
  moduleName: string;
  url: string;
  loc: Loc;
}

export interface Loc {
  col: number;
  line: number;
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
  let categorized: Categorized = {};

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

export function collapseCallSites(aggregations: Aggregations) {
  Object.keys(aggregations).forEach(methodName => {
    let collapsed: CallSite[] = [];
    aggregations[methodName].callsites.forEach(callsite => {

      let match = collapsed.find(c => {
        return c.moduleName === callsite.moduleName &&
               c.url === callsite.url &&
               c.loc.line === callsite.loc.line &&
               c.loc.col === callsite.loc.col;
      });

      if (match) {
        match.time += callsite.time;
      } else {
        collapsed.push(callsite);
      }
    });
    aggregations[methodName].callsites = collapsed;
  });

  return aggregations;
}

function populateContainment(aggregations: Aggregations, parent: string, child: string, time: number) {
  if (!aggregations[parent].containees[child]) {
    aggregations[parent].containees[child] = {
      time,
      message: `Contains "${child}"`,
    };
  } else {
    aggregations[parent].containees[child].time += time;
  }

  if (!aggregations[child].containers[parent]) {
    aggregations[child].containers[parent] = {
      time,
      message: `Contained by "${parent}"`,
    };
  } else {
    aggregations[child].containers[parent].time += time;
  }

  return aggregations;
}

export function aggregate(hierarchy: HierarchyNode<ICpuProfileNode>, methods: string[]) {
  let aggregations: Aggregations = {};
  let containments: string[] = [];

  methods.forEach(method => {
    aggregations[method] = {
      total: 0,
      name: method,
      callsites: [],
      containers: {},
      containees: {},
    };
  });

  hierarchy.each((node: HierarchyNode<ICpuProfileNode>) => {
    let { total } = node.data;
    let { functionName } = node.data.callFrame;

    if (methods.includes(functionName)) {
      let isContained = false;

      let parent = node.parent;
      while (parent) {
        let parentFnName = parent.data.callFrame.functionName;
        if (
          parentFnName !== functionName &&
          methods.includes(parent.data.callFrame.functionName)
        ) {

          isContained = true;
          aggregations = populateContainment(aggregations, parentFnName, functionName, total);

        }
        parent = parent.parent;
      }

      if (!isContained) {
        aggregations[functionName].total += total;
        let { lineNumber: line, columnNumber: col, url } = node.data.callFrame;
        aggregations[functionName].callsites.push({
          time: total,
          moduleName: '',
          url,
          loc: { line, col },
        });
      }
    }
  });

  return aggregations;
}
