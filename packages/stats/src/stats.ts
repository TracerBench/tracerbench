import { cross, histogram, mean, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { confidenceInterval } from './confidence-interval';
import { toNearestHundreth } from './utils';

export interface Bucket {
  min: number;
  max: number;
  count: {
    control: number;
    experiment: number;
  };
}

export type ISevenFigureSummary = {
  [key in string | number]: number;
} & {
  min: number;
  max: number;
  10: number;
  25: number;
  50: number;
  75: number;
  90: number;
};

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
  confidenceLevel?: 0.8 | 0.85 | 0.9 | 0.95 | 0.99 | 0.995 | 0.999;
}

type IAsPercentage = {
  percentMin: number;
  percentMedian: number;
  percentMax: number;
};

export type IConfidenceInterval = {
  min: number;
  median: number;
  max: number;
  zScore: number;
  isSig: boolean;
  pValue: number;
  U: number;
  asPercent: IAsPercentage;
};
export class Stats {
  public readonly name: string;
  public estimator: number;
  public readonly sparkLine: { control: string; experiment: string };
  public confidenceIntervals: { [key: number]: IConfidenceInterval };
  public confidenceInterval: IConfidenceInterval;
  public sevenFigureSummary: {
    control: ISevenFigureSummary;
    experiment: ISevenFigureSummary;
  };
  public outliers: {
    control: IOutliers;
    experiment: IOutliers;
  };
  public readonly sampleCount: { control: number; experiment: number };
  public experimentSorted: number[];
  public controlSorted: number[];
  public buckets: Bucket[];
  public range: { min: number; max: number };
  public populationVariance: { control: number; experiment: number };
  public control: number[];
  public experiment: number[];
  constructor(options: IStatsOptions, unitConverterFn?: (n: number) => number) {
    const { name, control, experiment, confidenceLevel } = options;

    this.control = control;
    this.experiment = experiment;

    const controlSorted = control;
    const experimentSorted = experiment;
    this.controlSorted = controlSorted.sort((a, b) => a - b);
    this.experimentSorted = experimentSorted.sort((a, b) => a - b);

    this.name = name;
    this.sampleCount = {
      control: this.controlSorted.length,
      experiment: this.experimentSorted.length
    };
    this.range = this.getRange(this.controlSorted, this.experimentSorted);
    this.sparkLine = {
      control: this.getSparkline(
        this.getHistogram(this.range, this.controlSorted)
      ),
      experiment: this.getSparkline(
        this.getHistogram(this.range, this.experimentSorted)
      )
    };
    this.confidenceIntervals = {
      80: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.8
      ),
      85: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.85
      ),
      90: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.9
      ),
      95: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.95
      ),
      99: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.99
      ),
      995: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.995
      ),
      999: this.getConfidenceInterval(
        this.controlSorted,
        this.experimentSorted,
        0.999
      )
    };
    this.confidenceInterval = this.getConfidenceInterval(
      this.controlSorted,
      this.experimentSorted,
      confidenceLevel
    );
    this.estimator = Math.round(
      this.getHodgesLehmann(this.controlSorted, this.experimentSorted) as number
    );
    this.sevenFigureSummary = {
      control: this.getSevenFigureSummary(this.controlSorted),
      experiment: this.getSevenFigureSummary(this.experimentSorted)
    };
    this.outliers = {
      control: this.getOutliers(
        this.controlSorted,
        this.sevenFigureSummary.control
      ),
      experiment: this.getOutliers(
        this.experimentSorted,
        this.sevenFigureSummary.experiment
      )
    };
    this.buckets = this.getBuckets(this.controlSorted, this.experimentSorted);
    this.populationVariance = {
      control: this.getPopulationVariance(this.controlSorted),
      experiment: this.getPopulationVariance(this.experimentSorted)
    };
    // when passed will convert all units **after** statistical computation
    // its critical this happens after computation since we need to correctly handle ties
    if (unitConverterFn) {
      this.convertAllUnits(unitConverterFn);
    }
  }

  private convertAllUnits(unitConverterFn: (n: number) => number): void {
    this.estimator = unitConverterFn(this.estimator);
    this.experiment = this.experiment.map((n) => {
      return unitConverterFn(n);
    });
    this.experimentSorted = this.experimentSorted.map((n) => {
      return unitConverterFn(n);
    });
    this.control = this.control.map((n) => {
      return unitConverterFn(n);
    });
    this.controlSorted = this.controlSorted.map((n) => {
      return unitConverterFn(n);
    });
    this.range.min = unitConverterFn(this.range.min);
    this.range.max = unitConverterFn(this.range.max);
    this.populationVariance.control = unitConverterFn(
      this.populationVariance.control
    );
    this.populationVariance.experiment = unitConverterFn(
      this.populationVariance.experiment
    );

    this.outliers.control.IQR = unitConverterFn(this.outliers.control.IQR);
    this.outliers.control.lowerOutlier = unitConverterFn(
      this.outliers.control.lowerOutlier
    );
    this.outliers.control.upperOutlier = unitConverterFn(
      this.outliers.control.upperOutlier
    );
    this.outliers.control.outliers = this.outliers.control.outliers.map((n) => {
      return unitConverterFn(n);
    });

    this.outliers.experiment.IQR = unitConverterFn(
      this.outliers.experiment.IQR
    );
    this.outliers.experiment.lowerOutlier = unitConverterFn(
      this.outliers.experiment.lowerOutlier
    );
    this.outliers.experiment.upperOutlier = unitConverterFn(
      this.outliers.experiment.upperOutlier
    );
    this.outliers.experiment.outliers = this.outliers.experiment.outliers.map(
      (n) => {
        return unitConverterFn(n);
      }
    );

    for (const k in this.confidenceInterval) {
      if (k === 'min' || k === 'max' || k === 'median') {
        this.confidenceInterval[k] = unitConverterFn(
          this.confidenceInterval[k]
        );
      }
    }

    for (const k in this.sevenFigureSummary.control) {
      this.sevenFigureSummary.control[k] = unitConverterFn(
        this.sevenFigureSummary.control[k]
      );
    }

    for (const k in this.sevenFigureSummary.experiment) {
      this.sevenFigureSummary.experiment[k] = unitConverterFn(
        this.sevenFigureSummary.experiment[k]
      );
    }

    for (const k in this.confidenceIntervals) {
      for (const kk in this.confidenceIntervals[k]) {
        if (kk === 'min' || kk === 'max' || kk === 'median') {
          this.confidenceIntervals[k][kk] = unitConverterFn(
            this.confidenceIntervals[k][kk]
          );
        }
      }
    }

    this.buckets = this.buckets.map((o) => {
      o.min = unitConverterFn(o.min);
      o.max = unitConverterFn(o.max);
      return o;
    });
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
    experiment: number[],
    confidenceLevel: 0.8 | 0.85 | 0.9 | 0.95 | 0.99 | 0.995 | 0.999 = 0.95
  ): IConfidenceInterval {
    const ci = confidenceInterval(control, experiment, confidenceLevel);
    const isCISig =
      (ci.min < 0 && 0 < ci.max) ||
      (ci.min > 0 && 0 > ci.max) ||
      (ci.min === 0 && ci.max === 0)
        ? false
        : true;
    // ci sign must match on lower and upper bounds and pValue < 5%
    const isSig = isCISig && ci.pValue < 0.05;
    return {
      min: Math.round(Math.ceil(ci.min * 100) / 100),
      max: Math.round(Math.ceil(ci.max * 100) / 100),
      isSig,
      median: ci.median,
      zScore: ci.zScore,
      pValue: ci.pValue,
      U: ci.U,
      asPercent: ci.asPercent
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  private getBuckets(
    controlSorted: number[],
    experimentSorted: number[],
    bucketCount = 12
  ): Bucket[] {
    const { min, max } = this.range;
    const buffer = 1;
    const minBuffer = min - buffer;
    const maxBuffer = max + buffer;
    const bucketIncrementor = (maxBuffer - minBuffer) / bucketCount;
    const buckets = [];
    let count = minBuffer;
    while (count < maxBuffer) {
      buckets.push({
        min: Math.floor(count),
        max: Math.floor(count + bucketIncrementor),
        count: {
          control: 0,
          experiment: 0
        }
      });
      count += bucketIncrementor;
    }

    // since we use a buffer all samples will be caught
    // within each bucket regardless of comparator
    // and without overlap
    buckets.map((bucket) => {
      controlSorted.map((sample) => {
        if (sample >= bucket.min && sample < bucket.max) {
          bucket.count.control++;
        }
      });
      experimentSorted.map((sample) => {
        if (sample >= bucket.min && sample < bucket.max) {
          bucket.count.experiment++;
        }
      });
    });

    return buckets;
  }

  private getPopulationVariance(a: number[]): number {
    const _mean = mean(a);
    let sum = 0;
    if (_mean) {
      a.map((n) => {
        sum = sum + Math.pow(n - _mean, 2);
      });
    }
    return toNearestHundreth(sum / a.length);
  }
}
