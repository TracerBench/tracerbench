import { cross, histogram, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { getWilcoxonRankSumTest } from './wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './wilcoxon-signed-rank';

interface IQuantile {
  p: number;
  val: number | undefined;
}

export interface IStatsOptions {
  control: number[];
  experiment: number[];
  name: string;
}

export class Stats {
  public name: string;
  public estimator: number;
  public controlDistributionSparkline: string;
  public experimentDistributionSparkline: string;
  public controlDistributionHistogram: number[];
  public experimentDistributionHistogram: number[];
  public range: { min: number; max: number };
  public isSigWilcoxonRankSumTest: string;
  public isSigWilcoxonSignedRankTest: string;
  public controlQuantiles: IQuantile[];
  public experimentQuantiles: IQuantile[];
  constructor(options: IStatsOptions) {
    const { name } = options;
    let { control, experiment } = options;
    control = control.sort((a, b) => a - b);
    experiment = experiment.sort((a, b) => a - b);
    this.name = name;
    this.estimator = this.getHodgesLehmann(control, experiment) as number;
    this.range = this.getRange(control, experiment);
    this.controlDistributionHistogram = this.getHistogram(this.range, control);
    this.experimentDistributionHistogram = this.getHistogram(
      this.range,
      experiment
    );
    this.controlDistributionSparkline = this.getSparkline(
      this.getHistogram(this.range, control)
    );
    this.experimentDistributionSparkline = this.getSparkline(
      this.getHistogram(this.range, experiment)
    );
    this.isSigWilcoxonRankSumTest = getWilcoxonRankSumTest(control, experiment);
    this.isSigWilcoxonSignedRankTest = getWilcoxonSignedRankTest(
      control,
      experiment
    );
    this.controlQuantiles = this.getQuantiles(control);
    this.experimentQuantiles = this.getQuantiles(experiment);
  }
  // todo: currently not displaying this in terminal results
  private getRange(control: number[], experiment: number[]) {
    const a = control.concat(experiment);
    return { min: Math.min(...a), max: Math.max(...a) };
  }
  private getHistogram(range: { min: number; max: number }, a: number[]) {
    a.sort((a, b) => a - b);
    const x: any = scaleLinear()
      .domain([range.min, range.max])
      .range([range.min, range.max]);
    const h = histogram()
      .value(d => {
        return d;
      })
      .domain(x.domain())
      .thresholds(x.ticks());

    return h(a).map(i => {
      return i.length;
    });
  }
  private getQuantiles(a: number[]): IQuantile[] {
    let p: number = 0;
    const q = [];
    while (p <= 1) {
      p = parseFloat(p.toFixed(1));
      q.push({ p, val: quantile(a, p) });
      p += 0.1;
    }
    return q;
  }
  // estimator shift logic
  private getHodgesLehmann(control: any[], experiment: any[]) {
    // todo this need 1 more step with the u statistic to index
    // into the sorted
    return quantile(cross(control, experiment, (a, b) => a - b), 0.5);
  }
  private getSparkline(
    numbers: number[],
    min: number = Math.min.apply(null, numbers),
    max: number = Math.max.apply(null, numbers)
  ) {
    function lshift(n: number, bits: number) {
      return Math.floor(n) * Math.pow(2, bits);
    }

    const ticks: string[] = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
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
}
