import { cross, histogram, quantile, deviation, mean } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { getWilcoxonRankSumTest } from './wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './wilcoxon-signed-rank';
import { toNearestHundreth } from '../utils';

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
  public controlMean: number;
  public experimentMean: number;
  public experimentCInt: number;
  public controlCInt: number;
  public controlStandardDeviation: number;
  public experimentStandardDeviation: number;
  public controlInterquartileRange: number;
  public experimentInterquartileRange: number;
  public readonly controlSamplesCount: number;
  public readonly experimentSamplesCount: number;
  public readonly confidenceLevel: 90 | 95 | 99;
  constructor(options: IStatsOptions) {
    const { name } = options;
    let { control, experiment } = options;
    control = control.sort((a, b) => a - b);
    experiment = experiment.sort((a, b) => a - b);
    this.name = name;
    this.confidenceLevel = 95;
    this.controlSamplesCount = control.length;
    this.experimentSamplesCount = experiment.length;
    this.controlMean = toNearestHundreth(mean(control) as number);
    this.experimentMean = toNearestHundreth(mean(experiment) as number);
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
    this.experimentCInt = this.getConfidenceInterval(experiment, this.confidenceLevel);
    this.controlCInt = this.getConfidenceInterval(control, this.confidenceLevel);
    this.controlStandardDeviation = toNearestHundreth(deviation(control) as number);
    this.experimentStandardDeviation = toNearestHundreth(deviation(experiment) as number);

    this.controlInterquartileRange = this.getInterquartileRange(control);
    this.experimentInterquartileRange = this.getInterquartileRange(experiment);
  }
  private getInterquartileRange(a: any[]): number {
    return (quantile(a, 0.75) as number) - (quantile(a, 0.25) as number);
  }
  // now get the cartesian product of the two confidence intervals
  private getConfidenceInterval(a: any[], z: 90 | 95 | 99 = 95): number {
    // default to 95
    const zTable = {
      90: 1.645,
      95: 1.960,
      99: 2.576
    };
    const sampleCount = a.length;
    const sd = deviation(a) as number;
    const ci = zTable[z] * (sd / Math.sqrt(sampleCount));

    // for the confidence interval to return valuable data
    // the sample size needs to be at the very least 25 ideally 30
    if (sampleCount < 25) {
      return 0;
    } 

    return toNearestHundreth(ci);
  }
  // estimator shift logic
  private getHodgesLehmann(control: any[], experiment: any[]) {
    // todo this need 1 more step with the u statistic to index
    // into the sorted
    return quantile(cross(control, experiment, (a, b) => a - b), 0.5);
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