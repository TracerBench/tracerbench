import { quantile } from 'd3-array';
import { test, significant } from './mann-whitney';

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
  isSignificant: boolean;
}

export class StatDisplay implements IStatDisplayClass {
  private control: number[];
  private experiment: number[];
  public controlQ: number;
  public experimentQ: number;
  public name: string;
  public deltaQ: number;
  public isSignificant: boolean;
  constructor(options: IStatDisplayOptions) {
    const { control, experiment, name } = options;

    this.control = control;
    this.experiment = experiment;
    this.name = name;
    this.controlQ = this.setQuantile(this.control) as number;
    this.experimentQ = this.setQuantile(this.experiment) as number;
    this.deltaQ = this.setDelta(this.controlQ, this.experimentQ);
    this.isSignificant = this.setIsSignificant(this.control, this.experiment);
  }
  private setQuantile(a: number[]): number | undefined {
    const n = a.sort((a: number, b: number) => a - b);
    return quantile(n, 0.5);
  }
  private setDelta(controlQ: number, experimentQ: number): number {
    return controlQ - experimentQ;
  }
  private setIsSignificant(control: any[], experiment: any[]): boolean {
    return significant(test([control, experiment]), [control, experiment]);
  }
}
