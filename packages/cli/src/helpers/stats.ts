import { cross, histogram, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { significant, test } from './mann-whitney';
import { chalkScheme } from './utils';
import { wilcoxonSignedRanksTable } from './critical-values';
export interface IStatsOptions {
  control: number[];
  experiment: number[];
  name: string;
}

export class Stats {
  public name: string;
  public significance: string;
  public estimator: number;
  public ustat: number;
  public controlDistribution: string;
  public experimentDistribution: string;
  public range: { min: number; max: number };
  public isSigWilcoxonSignedRankTest: boolean;
  constructor(options: IStatsOptions) {
    const { control, experiment, name } = options;
    this.name = name;
    this.ustat = this.getUSTAT(control, experiment);
    this.significance = this.setIsSignificant(this.ustat, control, experiment);
    this.estimator = this.getHodgesLehmann(control, experiment) as number;
    this.range = this.getRange(control, experiment);
    this.controlDistribution = sparkline(
      this.getHistogram(this.range, control)
    );
    this.experimentDistribution = sparkline(
      this.getHistogram(this.range, experiment)
    );
    this.isSigWilcoxonSignedRankTest = this.getWilcoxonSignedRankTest(
      control,
      experiment
    );
  }
  private getWilcoxonSignedRankTest(
    control: number[],
    experiment: number[]
  ): boolean {
    // two-tailed test alpha 0.05 critical values
    const samples = control.map((c, i) => {
      return Object.assign({
        c,
        e: experiment[i],
        diff: c - experiment[i],
        absDiff: Math.abs(c - experiment[i]),
        rank: 0,
      });
    });

    // sort by absolute difference & rank
    const sorted = samples.sort((a, b) => {
      return a.absDiff - b.absDiff;
    });
    samples.slice().map(s => {
      s.rank = sorted.indexOf(s) + 1;
    });

    const N = control.length;
    const tMinusVal = samples.reduce((currentSum, sample) => {
      if (Math.sign(sample.diff) === -1) {
        return currentSum + sample.rank;
      }
      return currentSum;
    }, 0);

    const tPlusVal = samples.reduce((currentSum, sample) => {
      if (Math.sign(sample.diff) === 1 || Math.sign(sample.diff) === 0) {
        return currentSum + sample.rank;
      }
      return currentSum;
    }, 0);

    const wStat = Math.min(tMinusVal, tPlusVal);

    try {
      const wCrit = wilcoxonSignedRanksTable[N];
      // !! important this is lt not gt
      return wStat < wCrit;
    } catch (e) {
      throw new Error(
        `Sample sizes greater than 50 are not supported. Your sample size is ${N}`
      );
    }
  }
  private getRange(control: number[], experiment: number[]) {
    const a = control.concat(experiment);
    return { min: Math.min(...a), max: Math.max(...a) };
  }
  private getHistogram(range: any, a: number[], bins: number = 20) {
    a.sort((a, b) => a - b);
    const x: any = scaleLinear()
      .domain([range.min, range.max])
      .range([range.min, range.max]);
    const h = histogram()
      .value(d => {
        return d;
      })
      .domain(x.domain())
      .thresholds(x.ticks(bins));

    return h(a).map(i => {
      return i.length;
    });
  }
  private getQuantiles(a: any[]) {
    let p: any = 0;
    const q = [];
    while (p <= 1) {
      p = parseFloat(p.toFixed(1));
      q.push({ p, val: quantile(a, p) });
      p += 0.1;
    }
    return q;
  }
  private getUSTAT(control: any[], experiment: any[]): number {
    return Math.min(...test([control, experiment]));
  }
  private getHodgesLehmann(control: any[], experiment: any[]) {
    return quantile(cross(control, experiment, (a, b) => a - b), 0.5);
  }
  private setIsSignificant(
    ustat: number,
    control: any[],
    experiment: any[]
  ): string {
    return significant(ustat, [control, experiment])
      ? chalkScheme.significant('Yes')
      : chalkScheme.neutral('No');
  }
}

export function sparkline(numbers: any, options: any = {}) {
  function lshift(n: number, bits: number) {
    return Math.floor(n) * Math.pow(2, bits);
  }

  const ticks: string[] = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

  const max =
    typeof options.max === 'number'
      ? options.max
      : Math.max.apply(null, numbers);
  const min =
    typeof options.min === 'number'
      ? options.min
      : Math.min.apply(null, numbers);
  const results: string[] = [];
  let f: number = Math.floor(lshift(max - min, 8) / (ticks.length - 1));
  if (f < 1) {
    f = 1;
  }

  numbers.forEach((n: number) => {
    const value: string = ticks[Math.floor(lshift(n - min, 8) / f)];

    results.push(value);
  });

  return `${results.join('')}`;
}
