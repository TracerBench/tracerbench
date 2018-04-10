import CpuProfile, { IProfileNode } from '../cpuprofile';
import { HierarchyNode } from 'd3-hierarchy';
import { Categories } from './reporter';
import { prototype } from 'events';
import { Trace, ITraceEvent } from '../trace';
import { Heuristics, Heuristic } from './heuristics';

export interface Result {
  sums: Sums,
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
  root: HierarchyNode<IProfileNode>;
  trace: Trace;
  heuristics: Heuristics;

  constructor(trace: Trace, profile: CpuProfile, heuristics: Heuristics) {
    this.root = profile.hierarchy;
    this.trace = trace;
    this.heuristics = heuristics;
  }

  private sumsPerMethod(heuristic: Heuristic, category: string): number {
    let sum = 0;
    this.root.each((node) => {
      if (heuristic.validate(node.data.callFrame)) {
        sum += node.data.self;
        if (node.children) {
          sum += this.aggregateChildren(node, category);
        }
      }
    });

    return sum;
  }

  private aggregateChildren(node: HierarchyNode<IProfileNode>, category: string): number {
    let { methods } = this;
    let sum = 0;

    const aggregate = (node: HierarchyNode<IProfileNode>) => {
      node.children!.forEach((n) => {
        if (!this.heuristics.isContained(n.data.callFrame, category)) {
          sum += n.data.self;
          if (n.children) {
            aggregate(n);
          }
        }
      });
    }

    aggregate(node);
    return sum;
  }

  sumsPerHeuristicCategory(heuristics: Heuristics): CategoryResult {
    // verifyMethods(methods);

    let heuristicsMap = heuristics.get();

    let sums: Sums = {};
    heuristicsMap.forEach((heuristic) => {
      if (!sums[heuristic.functionName]) {
        sums[heuristic.functionName] = { heuristics: [], total: 0 };
      }

      let t = toMS(this.sumsPerMethod(heuristic, 'adHoc'));
      sums[heuristic.functionName].total += t;
      let { line, col } = heuristic.loc;
      let shortName = heuristic.fileName.split('/').pop();
      sums[heuristic.functionName].heuristics.push(`[${shortName}:${heuristic.moduleName}] L${line}:C${col} ${t}ms`);
    });

    let total = Object.keys(sums).reduce((accumulator, current) => {
      return accumulator += sums[current].total;
    }, 0);

    return { sums, total };
  }

  sumsAllHeuristicCategories(heuristics: Heuristics): FullReport {
    let categoryNames = Object.keys(heuristics);
    let all: FullReport = {
      categorized: {},
      all: undefined
    }

    let allMethods: string[] = [];

    // categoryNames.forEach((category: string) => {
    //   let methods = heuristics[category];
    //   allMethods.push(...methods);
    //   all.categorized[category] = this.sumsPerHeuristicCategory(methods);
    // });

    verifyMethods(allMethods);

    all.all = this.sumsPerHeuristicCategory(allMethods);
    return all;
  }
}

function verifyMethods(array: string[]) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
        throw new Error(`Duplicate heuristic detected ${value}`);
      }
      valuesSoFar[value] = true;
  }
}

function toMS(num: number) {
  return num / 1000;
}
