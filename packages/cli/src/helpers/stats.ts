import { cross, histogram, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { getWilcoxonRankSumTest } from './wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './wilcoxon-signed-rank';
export interface IStatsOptions {
  control: number[];
  experiment: number[];
  name: string;
}

export class Stats {
  public name: string;
  public estimator: number;
  public controlDistribution: string;
  public experimentDistribution: string;
  public range: { min: number; max: number };
  public isSigWilcoxonRankSumTest: string;
  public isSigWilcoxonSignedRankTest: string;
  constructor(options: IStatsOptions) {
    const { control, experiment, name } = options;
    this.name = name;
    this.estimator = this.getHodgesLehmann(control, experiment) as number;
    this.range = this.getRange(control, experiment);
    this.controlDistribution = sparkline(
      this.getHistogram(this.range, control)
    );
    this.experimentDistribution = sparkline(
      this.getHistogram(this.range, experiment)
    );
    this.isSigWilcoxonRankSumTest = getWilcoxonRankSumTest(control, experiment);
    this.isSigWilcoxonSignedRankTest = getWilcoxonSignedRankTest(
      control,
      experiment
    );
  }
  // todo: currently not displaying this in terminal results
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
  private getHodgesLehmann(control: any[], experiment: any[]) {
    return quantile(cross(control, experiment, (a, b) => a - b), 0.5);
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
