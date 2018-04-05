import { ICpuProfile, IProfileNode } from '../cpuprofile';
import { HierarchyNode } from 'd3-hierarchy';
import { Categories } from './reporter';

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
  profile: ICpuProfile;
  methods: string[] = [];
  root: HierarchyNode<IProfileNode>;

  constructor(profile: ICpuProfile, root: HierarchyNode<IProfileNode>) {
    this.root = root;
    this.profile = profile;
  }

  private sumsPerMethod(methodName: string): number {
    let sum = 0;
    this.root.each((node) => {
      if (node.data.callFrame.functionName === methodName) {
        sum += node.data.hitCount;
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
          sum += n.data.hitCount;
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
    let { profile } = this;
    this.methods = methods;
    let sums: Sums = {};

    methods.forEach(method => {
      sums[method] = toMS(this.sumsPerMethod(method), profile.hitCount, profile.duration);
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

    all.all = this.sumsPerHeuristicCategory(allMethods);
    return all;
  }
}

function toMS(num: number, freq: number, dur: number) {
  return ((num / freq) * dur) / 1000;
}
