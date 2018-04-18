import { HierarchyNode } from 'd3-hierarchy';
import { prototype } from 'events';
import { ICpuProfileNode, ITraceEvent, Trace } from '../trace';
import CpuProfile from '../trace/cpuprofile';
import { Heuristic, Heuristics, Loc } from './heuristics';
import { Categories } from './utils';

// tslint:disable:member-ordering

export interface Breakdown {
  mes: string;
  time: number;
}

export interface Result {
  sums: Sums;
  all: number;
}

export interface Sums {
  [key: string]: SumMeta;
}

export interface SumMeta {
  total: number;
  heuristics: string[];
}

export interface CategorizedResults {
  [key: string]: CategoryResult;
}

export interface CategoryResult {
  sums: Sums;
  total: number;
}

export interface FullReport {
  categorized: CategorizedResults;
  all: CategoryResult | undefined;
}

export class Aggregator {
  methods: string[] = [];
  root: HierarchyNode<ICpuProfileNode>;
  trace: Trace;
  heuristics: Heuristics;

  constructor(trace: Trace, profile: CpuProfile, heuristics: Heuristics) {
    this.root = profile.hierarchy;
    this.trace = trace;
    this.heuristics = heuristics;
  }

  private sumsPerMethod(heuristic: Heuristic, category: string): number {
    let sum = 0;
    this.root.each(node => {
      if (heuristic.validate(node.data.callFrame)) {
        sum += node.data.self;
        if (node.children) {
          sum += this.aggregateChildren(node, category);
        }
      }
    });

    return sum;
  }

  private aggregateChildren(node: HierarchyNode<ICpuProfileNode>, category: string): number {
    let { methods } = this;
    let sum = 0;

    // tslint:disable-next-line:no-shadowed-variable
    const aggregate = (node: HierarchyNode<ICpuProfileNode>) => {
      node.children!.forEach(n => {
        if (!this.heuristics.isContained(n.data.callFrame)) {
          sum += n.data.self;
          if (n.children) {
            aggregate(n);
          }
        }
      });
    };

    aggregate(node);
    return sum;
  }

  sumsPerHeuristicCategory(heuristics: Heuristics): CategoryResult {
    let heuristicsMap = heuristics.get();

    verifyMethods(heuristics.methods);

    let sums: Sums = {};
    let breakdowns: { [key: string]: Breakdown[] } = {};
    heuristicsMap.forEach(heuristic => {
      if (!sums[heuristic.functionName]) {
        sums[heuristic.functionName] = { heuristics: [], total: 0 };
      }

      let time = toMS(this.sumsPerMethod(heuristic, 'adHoc'));
      sums[heuristic.functionName].total += time;
      let { line, col } = heuristic.loc;
      let shortNameFileName = heuristic.fileName.split('/').pop();

      if (breakdowns[heuristic.functionName] === undefined) {
        breakdowns[heuristic.functionName] = [];
      }

      breakdowns[heuristic.functionName].push({
        mes: `[${shortNameFileName}:${heuristic.moduleName}] L${line}:C${col} ${time}ms`,
        time,
      });
    });

    Object.keys(breakdowns).forEach(breakdown => {
      breakdowns[breakdown].sort((a, b) => b.time - a.time);
      sums[breakdown].heuristics = breakdowns[breakdown].map(b => b.mes);
    });

    let total = Object.keys(sums).reduce((accumulator, current) => {
      return (accumulator += sums[current].total);
    }, 0);

    return { sums, total };
  }

  sumsAllHeuristicCategories(heuristics: Heuristics): FullReport {
    let heuristicsMap = heuristics.get();
    let keys = heuristicsMap.keys();

    let all: FullReport = {
      categorized: {},
      all: undefined,
    };

    verifyMethods(heuristics.methods);

    let categories: string[] = [];
    let breakdowns: {
      [key: string]: { [key: string]: Breakdown[] };
    } = {};

    for (let key of keys) {
      let heuristic = heuristicsMap.get(key)!;
      let { category, functionName } = heuristic;

      if (!all.categorized[category]) {
        all.categorized[category] = {
          sums: {
            [functionName]: { heuristics: [], total: 0 },
          },
          total: 0,
        };
      }

      if (!all.categorized[category].sums[functionName]) {
        all.categorized[category].sums[functionName] = { heuristics: [], total: 0 };
      }

      let time = toMS(this.sumsPerMethod(heuristic, category));
      all.categorized[category].sums[functionName].total += time;
      all.categorized[category].total += time;

      if (!breakdowns[category]) {
        breakdowns[category] = {};
      }

      if (!breakdowns[category][functionName]) {
        breakdowns[category][functionName] = [];
      }

      breakdowns[category][functionName].push(this.createBreakDown(heuristic, time));
    }

    Object.keys(breakdowns).forEach(category => {
      Object.keys(breakdowns[category]).forEach(method => {
        breakdowns[category][method].sort((a, b) => b.time - a.time);
        all.categorized[category].sums[method].heuristics = breakdowns[category][method].map(
          b => b.mes,
        );
      });
    });

    return all;
  }

  private createBreakDown(heuristic: Heuristic, time: number): Breakdown {
    let { moduleName, fileName, loc: { line, col } } = heuristic;
    let shortNameFileName = fileName;
    return {
      mes: `[${shortNameFileName}:${moduleName}] L${line}:C${col} ${time}ms`,
      time,
    };
  }
}

function verifyMethods(array: string[]) {
  let valuesSoFar = Object.create(null);
  for (let i = 0; i < array.length; ++i) {
    let value = array[i];
    if (value in valuesSoFar) {
      throw new Error(`Duplicate heuristic detected ${value}`);
    }
    valuesSoFar[value] = true;
  }
}

function toMS(num: number) {
  return num / 1000;
}

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

interface Containers {
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

export interface Categorized {
  [key: string]: AggregationResult[];
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
