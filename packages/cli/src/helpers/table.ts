import * as Table from 'cli-table3';
import { Stats } from './stats';
import { chalkScheme } from './utils';

export default class TBTable {
  public config: Table.TableConstructorOptions;
  public table: any;
  public display: Stats[];
  public estimatorDeltas: number[];
  public isSigWilcoxonRankSumTestArray: string[];
  private heading: string;
  constructor(heading: string) {
    this.heading = heading;
    this.config = this.initConfig();
    this.table = new Table(this.config) as Table.HorizontalTable;
    this.display = [];
    this.isSigWilcoxonRankSumTestArray = [];
    this.estimatorDeltas = [];
  }
  // return table data for jsonResults
  public getData(): object[] {
    const a: object[] = [];
    this.display.forEach(stat => {
      a.push({
        heading: this.heading,
        statName: stat.name,
        rankSumSignificant: stat.isSigWilcoxonRankSumTest,
        controlMean: `${stat.controlMean}μs`,
        experimentMean: `${stat.experimentMean}μs`,
        estimatorDelta: `${stat.estimator}μs`,
        controlStandardDeviation: `${stat.controlStandardDeviation}μs`,
        experimentStandardDeviation: `${stat.experimentStandardDeviation}μs`,
        controlInterquartileRange: `${stat.controlInterquartileRange}μs`,
        experimentInterquartileRange: `${stat.experimentInterquartileRange}μs`,
        controlSampleCount: `${stat.controlSamplesCount}`,
        experimentSampleCount: `${stat.experimentSamplesCount}`,
        controlConfidenceInterval: `${stat.controlMean}μs +/- ${
          stat.controlCInt
        }μs`,
        experimentConfidenceInterval: `${stat.experimentMean}μs +/- ${
          stat.experimentCInt
        }μs`,
        controlDistributionHistogram: stat.controlDistributionHistogram,
        experimentDistributionHistogram: stat.experimentDistributionHistogram,
      });
      this.isSigWilcoxonRankSumTestArray.push(stat.isSigWilcoxonRankSumTest);
      this.estimatorDeltas.push(stat.estimator);
    });
    return a;
  }

  public render(): string {
    this.setTableData();
    return this.table.toString();
  }

  // Based on the confidence interval with a margin of error of +\- N on N samples, TracerBench is 99% confident the:

  // Control mean is between N and N.
  // Experiment mean is between N and N.
  // With a delta between N and N.

  private setTableData() {
    this.display.forEach(stat => {
      this.table.push(
        [
          {
            colSpan: 2,
            content: `${chalkScheme.tbBranding.blue(
              `${this.heading} : ${stat.name}`
            )}`,
          },
        ],
        [
          'Control Sample Count',
          { hAlign: 'right', content: `${stat.controlSamplesCount}` },
        ],
        [
          'Experiment Sample Count',
          { hAlign: 'right', content: `${stat.experimentSamplesCount}` },
        ],
        ['Control Mean', { hAlign: 'right', content: `${stat.controlMean}` }],
        [
          'Experiment Mean',
          { hAlign: 'right', content: `${stat.experimentMean}` },
        ],
        [
          'Control Standard Deviation',
          { hAlign: 'right', content: `${stat.controlStandardDeviation}` },
        ],
        [
          'Experiment Standard Deviation',
          { hAlign: 'right', content: `${stat.experimentStandardDeviation}` },
        ],
        [
          'Control 95% Confidence Interval',
          {
            hAlign: 'right',
            content: `${stat.controlMean}μs +/- ${stat.controlCInt}μs`,
          },
        ],
        [
          'Experiment 95% Confidence Interval',
          {
            hAlign: 'right',
            content: `${stat.experimentMean}μs +/- ${stat.experimentCInt}μs`,
          },
        ],
        [
          'Control Interquartile Range',
          { hAlign: 'right', content: `${stat.controlInterquartileRange}μs` },
        ],
        [
          'Experiment Interquartile Range',
          {
            hAlign: 'right',
            content: `${stat.experimentInterquartileRange}μs`,
          },
        ],
        ['Estimator Δ', { hAlign: 'right', content: `${stat.estimator}μs` }],
        [
          'Rank-Sum Significant',
          { hAlign: 'right', content: `${stat.isSigWilcoxonRankSumTest}` },
        ],
        [
          'Control Sparkline',
          { hAlign: 'right', content: `${stat.controlDistributionSparkline}` },
        ],
        [
          'Experiment Sparkline',
          {
            hAlign: 'right',
            content: `${stat.experimentDistributionSparkline}`,
          },
        ]
      );
    });
  }
  private initConfig() {
    return {
      colWidths: [40, 40],
      chars: {
        top: '═',
        'top-mid': '─',
        'top-left': '╔',
        'top-right': '╗',
        bottom: '═',
        'bottom-mid': '═',
        'bottom-left': '╚',
        'bottom-right': '╝',
        left: '║',
        'left-mid': '║',
        mid: '─',
        'mid-mid': '─',
        right: '║',
        'right-mid': '║',
        middle: '│',
      },
    };
  }
}
