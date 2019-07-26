import * as Table from 'cli-table3';
import { Stats, ISevenFigureSummary } from './statistics/stats';
import { chalkScheme } from './utils';

export interface ICompareJSONResults {
  heading: string;
  statName: string;
  isSignificant: 'Yes' | 'No';
  estimatorDelta: string;
  controlSampleCount: number;
  experimentSampleCount: number;
  confidenceIntervalMin: string;
  confidenceIntervalMax: string;
  confidenceIntervalIsSig: 'Yes' | 'No' | string;
  controlSevenFigureSummary: ISevenFigureSummary;
  experimentSevenFigureSummary: ISevenFigureSummary;
}

export default class TBTable {
  public config: Table.TableConstructorOptions;
  public table: any;
  public display: Stats[];
  public estimatorDeltas: number[];
  public isSigArray: string[];
  private heading: string;
  constructor(heading: string) {
    this.heading = heading;
    this.config = this.initConfig();
    this.table = new Table(this.config) as Table.HorizontalTable;
    this.display = [];
    this.isSigArray = [];
    this.estimatorDeltas = [];
  }
  // return table data for --json flag
  public getData(): ICompareJSONResults[] {
    const a: ICompareJSONResults[] = [];
    this.display.forEach(stat => {
      a.push({
        heading: this.heading,
        statName: stat.name,
        isSignificant: stat.confidenceInterval.isSig,
        estimatorDelta: `${stat.estimator}ms`,
        controlSampleCount: stat.sampleCount.control,
        experimentSampleCount: stat.sampleCount.experiment,
        confidenceIntervalMin: `${stat.confidenceInterval.min}ms`,
        confidenceIntervalMax: `${stat.confidenceInterval.max}ms`,
        confidenceIntervalIsSig: `${stat.confidenceInterval.isSig}`,
        controlSevenFigureSummary: stat.sevenFigureSummary.control,
        experimentSevenFigureSummary: stat.sevenFigureSummary.experiment,
      });

      this.isSigArray.push(stat.confidenceInterval.isSig);
      this.estimatorDeltas.push(stat.estimator);
    });
    return a;
  }

  public render(): string {
    this.setTableData();
    return this.table.toString();
  }

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
          {
            vAlign: 'center',
            rowSpan: 2,
            colSpan: 1,
            content: 'Sample Counts:',
          },
          `Control: ${stat.sampleCount.control}`,
        ],
        [`Experiment: ${stat.sampleCount.experiment}`],
        [],
        [
          {
            vAlign: 'center',
            rowSpan: 7,
            colSpan: 1,
            content: 'Control Seven Figure Summary:',
          },
          `MIN: ${stat.sevenFigureSummary.control.min}ms`,
        ],
        [`MAX: ${stat.sevenFigureSummary.control.max}ms`],
        [`10th: ${stat.sevenFigureSummary.control[10]}ms`],
        [`25th: ${stat.sevenFigureSummary.control[25]}ms`],
        [`50th: ${stat.sevenFigureSummary.control[50]}ms`],
        [`75th: ${stat.sevenFigureSummary.control[75]}ms`],
        [`90th: ${stat.sevenFigureSummary.control[90]}ms`],
        [],
        [
          {
            vAlign: 'center',
            rowSpan: 7,
            colSpan: 1,
            content: 'Experiment Seven Figure Summary:',
          },
          `MIN: ${stat.sevenFigureSummary.experiment.min}ms`,
        ],
        [`MAX: ${stat.sevenFigureSummary.experiment.max}ms`],
        [`10th: ${stat.sevenFigureSummary.experiment[10]}ms`],
        [`25th: ${stat.sevenFigureSummary.experiment[25]}ms`],
        [`50th: ${stat.sevenFigureSummary.experiment[50]}ms`],
        [`75th: ${stat.sevenFigureSummary.experiment[75]}ms`],
        [`90th: ${stat.sevenFigureSummary.experiment[90]}ms`],
        [],
        [
          {
            content: 'Hodges–Lehmann estimated delta:',
          },
          { content: `${stat.estimator}ms` },
        ],
        [],
        [
          {
            content: `95% confident the delta is between:`,
          },
          {
            content: `${stat.confidenceInterval.min}ms to ${stat.confidenceInterval.max}ms`,
          },
        ],
        [],
        [
          { content: 'Is Significant:' },
          { content: `${stat.confidenceInterval.isSig}` },
        ],
        [],
        ['Control Sparkline', { content: `${stat.sparkLine.control}` }],
        [
          'Experiment Sparkline',
          {
            content: `${stat.sparkLine.experiment}`,
          },
        ]
      );
    });
  }
  private initConfig() {
    return {
      colWidths: [40, 30],
    };
  }
}
