import { quantile, sum, median, mean } from 'd3-array';
import { test, significant } from './mann-whitney';
import { chalkScheme } from './utils';

export interface IStatDisplayOptions {
  control: number[];
  experiment: number[];
  name: string;
}

interface IStatDisplayClass {
  controlQ: number;
  experimentQ: number;
  name: string;
  deltaQ: number;
  significance: string;
  varianceControl: number;
  varianceExperiment: number;
}

export class StatDisplay implements IStatDisplayClass {
  private control: number[];
  private experiment: number[];
  private staticVariance: number = 20000;
  public controlQ: number;
  public experimentQ: number;
  public name: string;
  public deltaQ: number;
  public significance: string;
  public standardDeviationControl: number;
  public standardDeviationExperiment: number;
  public varianceControl: number;
  public varianceExperiment: number;
  public meanControl: number;
  public meanExperiment: number;
  public medianControl: number;
  public medianExperiment: number;
  constructor(options: IStatDisplayOptions) {
    const { control, experiment, name } = options;

    this.control = control;
    this.experiment = experiment;
    this.name = name;
    this.controlQ = this.setQuantile(this.control) as number;
    this.experimentQ = this.setQuantile(this.experiment) as number;
    this.deltaQ = this.setDelta(this.controlQ, this.experimentQ);
    this.significance = this.setSignificance(this.deltaQ);
    this.standardDeviationControl = this.setStandardDeviation(control);
    this.standardDeviationExperiment = this.setStandardDeviation(experiment);
    this.varianceControl = Math.ceil(
      this.setVariance(this.standardDeviationControl)
    );
    this.varianceExperiment = Math.ceil(
      this.setVariance(this.standardDeviationExperiment)
    );
    this.meanControl = mean(control) as number;
    this.meanExperiment = mean(experiment) as number;
    this.medianControl = median(control) as number;
    this.medianExperiment = median(experiment) as number;
  }
  private setQuantile(a: number[]): number | undefined {
    const n = a.sort((a: number, b: number) => a - b);
    return Math.ceil(quantile(n, 0.5) as number);
  }
  private setDelta(controlQ: number, experimentQ: number): number {
    return Math.ceil(controlQ - experimentQ);
  }
  private setSignificance(delta: number): string {
    if (Math.abs(delta) < this.staticVariance) {
      return chalkScheme.neutral('Neutral');
    }

    return delta > 0
      ? chalkScheme.imprv('Improvement')
      : chalkScheme.regress('Regression');
  }
  private setStandardDeviation(a: number[]) {
    const dev: number[] = [];
    const m = mean(a) as number;
    a.sort().forEach(n => {
      dev.push(Math.pow(n - m, 2));
    });
    return sum(dev) / (a.length - 1);
  }
  private setVariance(deviation: number) {
    return Math.sqrt(deviation);
  }
  // TODO: using mann-whitney need to verify results
  private setIsSignificant(control: any[], experiment: any[]): boolean {
    return significant(test([control, experiment]), [control, experiment]);
  }
}
