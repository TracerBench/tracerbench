import CpuProfile, { IProfileNode } from '../cpuprofile';
import { HierarchyNode } from 'd3-hierarchy';
import { Categories } from './reporter';
import { prototype } from 'events';
import { Trace, ITraceEvent } from '../trace';

export interface Result {
  sums: Sums,
  all: number;
}

export interface Sums {
  [key: string]: number;
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

  constructor(trace: Trace, profile: CpuProfile) {
    this.root = profile.hierarchy;
    this.trace = trace;
  }

  private sumsPerMethod(methodName: string): number {
    let sum = 0;
    this.root.each((node) => {
      if (node.data.callFrame.functionName === methodName) {
        sum += node.data.self;
        if (node.children) {
          sum += this.aggregateChildren(node)
        }
      }
    });

    return sum;
  }

  private aggregateChildren(node: HierarchyNode<IProfileNode>): number {
    let { methods } = this;
    let sum = 0;

    const aggregate = (node: HierarchyNode<IProfileNode>) => {
      node.children!.forEach((n) => {
        if (!methods.includes(n.data.callFrame.functionName)) {
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

  sumsPerHeuristicCategory(methods: string[]): CategoryResult {
    verifyMethods(methods);

    this.methods = methods;
    let sums: Sums = {};

    methods.forEach(method => {
      sums[method] = toMS(this.sumsPerMethod(method));
    });

    this.methods = [];

    let total = Object.keys(sums).reduce((accumulator, current) => {
      return accumulator += sums[current];
    }, 0);

    return { sums, total };
  }

  sumsAllHeuristicCategories(categories: Categories): FullReport {
    let categoryNames = Object.keys(categories);
    let all: FullReport = {
      categorized: {},
      all: undefined
    }

    let allMethods: string[] = [];

    categoryNames.forEach((category: string) => {
      let methods = categories[category];
      allMethods.push(...methods);
      all.categorized[category] = this.sumsPerHeuristicCategory(methods);
    });

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
