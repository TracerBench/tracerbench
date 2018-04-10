import CpuProfile, { IProfileNode } from '../cpuprofile';
import { HierarchyNode } from 'd3-hierarchy';
import { Categories } from './reporter';
import { prototype } from 'events';
import { Trace, ITraceEvent } from '../trace';
import { Heuristics, Heuristic } from './heuristics';

export interface Breakdown {
  mes: string;
  time: number;
}

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
    let heuristicsMap = heuristics.get();

    let sums: Sums = {};
    let breakdowns: { [key: string ]: Breakdown[] } = {};
    heuristicsMap.forEach((heuristic) => {
      if (!sums[heuristic.functionName]) {
        sums[heuristic.functionName] = { heuristics: [], total: 0 };
      }

      let time = toMS(this.sumsPerMethod(heuristic, 'adHoc'));
      sums[heuristic.functionName].total += time;
      let { line, col } = heuristic.loc;
      let shortNameFileName = heuristic.fileName.split('/').pop();

      if (breakdowns[heuristic.functionName] === undefined) {
        breakdowns[heuristic.functionName] = []
      }

      breakdowns[heuristic.functionName].push({
        mes: `[${shortNameFileName}:${heuristic.moduleName}] L${line}:C${col} ${time}ms`,
        time
      })
    });

    Object.keys(breakdowns).forEach((breakdown) => {
      breakdowns[breakdown].sort((a, b) => b.time - a.time);
      sums[breakdown].heuristics = breakdowns[breakdown].map(b => b.mes);
    });

    let total = Object.keys(sums).reduce((accumulator, current) => {
      return accumulator += sums[current].total;
    }, 0);

    return { sums, total };
  }

  sumsAllHeuristicCategories(heuristics: Heuristics): FullReport {
    let heuristicsMap = heuristics.get();
    let keys = heuristicsMap.keys();
    // let categoryNames = Object.keys(heuristics);
    let all: FullReport = {
      categorized: {},
      all: undefined
    }

    let categories: string[] = [];
    let breakdowns: {
      [key: string] : { [key: string ]: Breakdown[] }
    } = {};


    for (let key of keys) {
      let heuristic = heuristicsMap.get(key)!;
      let { category, functionName } = heuristic;

      if (!all.categorized[category]) {
        all.categorized[category] = {
          sums: {
            [functionName]: { heuristics: [], total: 0 }
          },
          total: 0
        }
      }

      if (!all.categorized[category].sums[functionName]) {
        all.categorized[category].sums[functionName] = { heuristics: [], total: 0 };
      }

      let time = toMS(this.sumsPerMethod(heuristic, category));
      all.categorized[category].sums[functionName].total += time;
      all.categorized[category].total += time;

      if (!breakdowns[category]) {
        breakdowns[category] = {}
      }

      if (!breakdowns[category][functionName]) {
        breakdowns[category][functionName] = [];
      }

      breakdowns[category][functionName].push(this.createBreakDown(heuristic, time));
    }

    Object.keys(breakdowns).forEach((category) => {
      Object.keys(breakdowns[category]).forEach(method => {
        breakdowns[category][method].sort((a, b) => b.time - a.time);
        all.categorized[category].sums[method].heuristics =  breakdowns[category][method].map(b => b.mes);
      });
    });

    return all;
  }

  private createBreakDown(heuristic: Heuristic, time: number): Breakdown {
    let { moduleName, fileName, loc: { line, col } } = heuristic;
    let shortNameFileName = fileName.split('/').pop();
    return {
      mes: `[${shortNameFileName}:${moduleName}] L${line}:C${col} ${time}ms`,
      time
    }
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
