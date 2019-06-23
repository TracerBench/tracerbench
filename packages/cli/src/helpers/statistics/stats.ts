import { cross, histogram, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { getWilcoxonRankSumTest } from './wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './wilcoxon-signed-rank';
import { confidenceInterval } from './confidence-interval';
import { convertMicrosecondsToMS } from '../utils';

export interface ISevenFigureSummary {
  min: number;
  max: number;
  10: number;
  25: number;
  50: number;
  75: number;
  90: number;
}

export interface IStatsOptions {
  control: number[];
  experiment: number[];
  name: string;
}

export class Stats {
  public readonly name: string;
  public readonly estimator: number;
  public readonly sparkLine: { control: string; experiment: string };
  public readonly isSigWilcoxonSignedRankTest: string;
  public readonly confidenceInterval: {
    min: number;
    max: number;
    isSig: boolean;
  };
  public readonly sevenFigureSummary: {
    control: ISevenFigureSummary;
    experiment: ISevenFigureSummary;
  };
  public readonly isSigWilcoxonRankSumTest: string;
  public readonly sampleCount: { control: number; experiment: number };
  private range: { min: number; max: number };
  constructor(options: IStatsOptions) {
    const { name } = options;
    let { control, experiment } = options;
    control = control.sort((a, b) => a - b);
    experiment = experiment.sort((a, b) => a - b);

    control = control.map(x => convertMicrosecondsToMS(x));
    experiment = experiment.map(x => convertMicrosecondsToMS(x));

    this.name = name;
    this.sampleCount = {
      control: control.length,
      experiment: experiment.length,
    };
    this.range = this.getRange(control, experiment);
    this.sparkLine = {
      control: this.getSparkline(this.getHistogram(this.range, control)),
      experiment: this.getSparkline(this.getHistogram(this.range, experiment)),
    };
    this.isSigWilcoxonRankSumTest = getWilcoxonRankSumTest(control, experiment);
    this.isSigWilcoxonSignedRankTest = getWilcoxonSignedRankTest(
      control,
      experiment
    );
    this.confidenceInterval = this.getConfidenceInterval(control, experiment);
    this.estimator = this.getHodgesLehmann(control, experiment) as number;
    this.sevenFigureSummary = {
      control: this.getSevenFigureSummary(control),
      experiment: this.getSevenFigureSummary(experiment),
    };
  }

  private getSevenFigureSummary(a: number[]): ISevenFigureSummary {
    return {
      min: Math.min.apply(null, a),
      max: Math.max.apply(null, a),
      10: quantile(a, 0.1) as number,
      25: quantile(a, 0.25) as number,
      50: quantile(a, 0.5) as number,
      75: quantile(a, 0.75) as number,
      90: quantile(a, 0.9) as number,
    };
  }
  private getConfidenceInterval(
    control: number[],
    experiment: number[]
  ): { min: number; max: number; isSig: boolean } {
    const ci = confidenceInterval(control, experiment, 0.95);
    return {
      min: Math.ceil(ci[0] * 100) / 100,
      max: Math.ceil(ci[1] * 100) / 100,
      isSig: !((ci[0] < 0 && 0 < ci[1]) || (ci[0] > 0 && 0 > ci[1])),
    };
  }
  private getHodgesLehmann(control: any[], experiment: any[]) {
    return quantile(cross(control, experiment, (a, b) => a - b), 0.5);
  }
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
