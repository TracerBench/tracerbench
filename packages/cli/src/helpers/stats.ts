import { cross, histogram, quantile } from 'd3-array';
import { significant, test } from './mann-whitney';
import { chalkScheme } from './utils';

export interface IStatDisplayOptions {
  control: number[];
  experiment: number[];
  name: string;
}

interface IStatDisplayClass {
  name: string;
  estimator: number;
  // based on alpha of 5%
  significance: string;
  controlDistribution: string;
  experimentDistribution: string;
  // todo: add locationShift as +/- μs
  // locationShift: number;
  // todo: add observation probability as %
  // probablity: number;
}

export class StatDisplay implements IStatDisplayClass {
  public name: string;
  public significance: string;
  public estimator: number;
  public ustat: number;
  public controlDistribution: string;
  public experimentDistribution: string;
  constructor(options: IStatDisplayOptions) {
    const { control, experiment, name } = options;
    this.name = name;
    this.ustat = this.getUSTAT(control, experiment);
    this.significance = this.setIsSignificant(this.ustat, control, experiment);
    this.estimator = this.getHodgesLehmann(control, experiment) as number;
    this.controlDistribution = sparkline(this.getHistogram(control));
    this.experimentDistribution = sparkline(this.getHistogram(experiment));
  }
  private getHistogram(a: number[]) {
    return histogram()(a).map(i => {
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

function sparkline(numbers: any, options: any = {}) {
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

  return `${min} ${results.join('')} ${max}`;
}
