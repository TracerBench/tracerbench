import { cross, histogram, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { confidenceInterval } from './confidence-interval';
import { convertMicrosecondsToMS } from './utils';

export interface ISevenFigureSummary {
  min: number;
  max: number;
  10: number;
  25: number;
  50: number;
  75: number;
  90: number;
}

export interface IOutliers {
  IQR: number;
  outliers: number[];
  lowerOutlier: number;
  upperOutlier: number;
}

export interface IStatsOptions {
  control: number[];
  experiment: number[];
  name: string;
}

export interface IConfidenceInterval {
  min: number;
  max: number;
  isSig: boolean;
}

// ! all stats assume microseconds from tracerbench and round to milliseconds
export class Stats {
  public readonly name: string;
  public readonly estimator: number;
  public readonly sparkLine: { control: string; experiment: string };
  public readonly confidenceInterval: IConfidenceInterval;
  public readonly sevenFigureSummary: {
    control: ISevenFigureSummary;
    experiment: ISevenFigureSummary;
  };
  public readonly outliers: {
    control: IOutliers;
    experiment: IOutliers;
  };
  public readonly sampleCount: { control: number; experiment: number };
  public readonly experimentMS: number[];
  public readonly controlMS: number[];
  public readonly experimentSortedMS: number[];
  public readonly controlSortedMS: number[];
  private range: { min: number; max: number };
  constructor(options: IStatsOptions) {
    const { name, control, experiment } = options;
    // explicitly for NOT sorted
    this.controlMS = control.map((x) => Math.round(convertMicrosecondsToMS(x)));
    this.experimentMS = experiment.map((x) =>
      Math.round(convertMicrosecondsToMS(x))
    );

    // explicitly for sortedMS
    const controlSortedMS = control.map((x) =>
      Math.round(convertMicrosecondsToMS(x))
    );
    const experimentSortedMS = experiment.map((x) =>
      Math.round(convertMicrosecondsToMS(x))
    );
    this.controlSortedMS = controlSortedMS.sort((a, b) => a - b);
    this.experimentSortedMS = experimentSortedMS.sort((a, b) => a - b);

    this.name = name;
    this.sampleCount = {
      control: this.controlSortedMS.length,
      experiment: this.experimentSortedMS.length
    };
    this.range = this.getRange(this.controlSortedMS, this.experimentSortedMS);
    this.sparkLine = {
      control: this.getSparkline(
        this.getHistogram(this.range, this.controlSortedMS)
      ),
      experiment: this.getSparkline(
        this.getHistogram(this.range, this.experimentSortedMS)
      )
    };
    this.confidenceInterval = this.getConfidenceInterval(
      this.controlSortedMS,
      this.experimentSortedMS
    );
    this.estimator = Math.round(
      this.getHodgesLehmann(
        this.controlSortedMS,
        this.experimentSortedMS
      ) as number
    );
    this.sevenFigureSummary = {
      control: this.getSevenFigureSummary(this.controlSortedMS),
      experiment: this.getSevenFigureSummary(this.experimentSortedMS)
    };
    this.outliers = {
      control: this.getOutliers(
        this.controlSortedMS,
        this.sevenFigureSummary.control
      ),
      experiment: this.getOutliers(
        this.experimentSortedMS,
        this.sevenFigureSummary.experiment
      )
    };
  }

  private getOutliers(
    a: number[],
    sevenFigSum: ISevenFigureSummary
  ): IOutliers {
    const IQR = sevenFigSum[75] - sevenFigSum[25];
    const obj: IOutliers = {
      IQR,
      lowerOutlier: Math.floor(sevenFigSum[25] - 1.5 * IQR),
      upperOutlier: Math.round(sevenFigSum[75] + 1.5 * IQR),
      outliers: []
    };

    a.forEach((n) => {
      const roundedN: number = Math.round(n);
      if (roundedN < obj.lowerOutlier || roundedN > obj.upperOutlier) {
        obj.outliers.push(roundedN);
      }
    });

    return obj;
  }

  private getSevenFigureSummary(a: number[]): ISevenFigureSummary {
    return {
      min: Math.round(Math.min.apply(null, a)),
      max: Math.round(Math.max.apply(null, a)),
      10: Math.round(quantile(a, 0.1) as number),
      25: Math.round(quantile(a, 0.25) as number),
      50: Math.round(quantile(a, 0.5) as number),
      75: Math.round(quantile(a, 0.75) as number),
      90: Math.round(quantile(a, 0.9) as number)
    };
  }

  private getConfidenceInterval(
    control: number[],
    experiment: number[]
  ): IConfidenceInterval {
    const sigVal = 0.05;
    const interval = 1 - sigVal;
    const ci = confidenceInterval(control, experiment, interval);
    const isSig =
      (ci[0] < 0 && 0 < ci[1]) ||
      (ci[0] > 0 && 0 > ci[1]) ||
      (ci[0] === 0 && ci[1] === 0)
        ? false
        : true;
    return {
      min: Math.round(Math.ceil(ci[0] * 100) / 100),
      max: Math.round(Math.ceil(ci[1] * 100) / 100),
      isSig
    };
  }

  private getHodgesLehmann(
    control: number[],
    experiment: number[]
  ): number | undefined {
    const crossProduct = cross(control, experiment, (a, b) => a - b).sort(
      (a, b) => a - b
    );
    return quantile(crossProduct, 0.5);
  }

  private getRange(
    control: number[],
    experiment: number[]
  ): { min: number; max: number } {
    const a = control.concat(experiment);
    return { min: Math.min(...a), max: Math.max(...a) };
  }

  private getHistogram(
    range: { min: number; max: number },
    a: number[]
  ): number[] {
    const x: any = scaleLinear()
      .domain([range.min, range.max])
      .range([range.min, range.max]);
    const h = histogram()
      .value((d) => {
        return d;
      })
      .domain(x.domain())
      .thresholds(x.ticks());

    return h(a).map((i) => {
      return i.length;
    });
  }

  private getSparkline(
    numbers: number[],
    min: number = Math.min.apply(null, numbers),
    max: number = Math.max.apply(null, numbers)
  ): string {
    function lshift(n: number, bits: number): number {
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
