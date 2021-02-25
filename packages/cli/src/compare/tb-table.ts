import type { Stats } from "@tracerbench/stats";
import * as chalk from "chalk";
import * as Table from "cli-table3";

import { chalkScheme } from "../helpers/utils";
import { ICompareJSONResult } from "./compare-results";

export default class TBTable {
  public table: Table.Table;
  public display: Stats[];
  public estimatorDeltas: number[];
  public isSigArray: boolean[];
  private heading: string;

  constructor(heading: string) {
    this.heading = heading;
    this.table = new Table({
      colWidths: [40, 30],
    });
    this.display = [];
    this.isSigArray = [];
    this.estimatorDeltas = [];
  }

  // return table data for JSON results
  // confidence interval and estimatorDelta are inverted
  // to show a regression as a positive number
  // and an improvement as a negative number ie (N * -1)
  // JSON results, stdout, PDF, HTML have parity
  public getData(): ICompareJSONResult[] {
    const a: ICompareJSONResult[] = [];
    this.display.forEach((stat) => {
      // flip min/max when negative number
      // eg [max: 100, med: 80, min: 60]
      // eg [max: -60, med: -40, min: -20]
      const asPercent = {
        percentMin:
          stat.estimator * -1 < 0
            ? stat.confidenceInterval.asPercent.percentMin * -1
            : stat.confidenceInterval.asPercent.percentMax * -1,
        percentMedian: stat.confidenceInterval.asPercent.percentMedian * -1,
        percentMax:
          stat.estimator * -1 < 0
            ? stat.confidenceInterval.asPercent.percentMax * -1
            : stat.confidenceInterval.asPercent.percentMin * -1,
      };

      a.push({
        heading: this.heading,
        phaseName: stat.name,
        isSignificant: stat.confidenceInterval.isSig,
        pValue: stat.confidenceInterval.pValue,
        estimatorDelta: `${stat.estimator * -1}ms`,
        controlSampleCount: stat.sampleCount.control,
        experimentSampleCount: stat.sampleCount.experiment,
        confidenceInterval: [
          `${stat.confidenceInterval.max * -1}ms`,
          `${stat.confidenceInterval.min * -1}ms`,
        ],
        controlSevenFigureSummary: stat.sevenFigureSummary.control,
        experimentSevenFigureSummary: stat.sevenFigureSummary.experiment,
        asPercent,
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

  private setTableData(): Table.Table {
    const controlLabelWithColor = chalkScheme.tbBranding.lime("Control");
    const experimentLabelWithColor = chalkScheme.tbBranding.aqua("Experiment");
    this.display.forEach((stat) => {
      // setting the color for the Hodges–Lehmann estimated delta
      const estimatorForDisplay = stat.estimator * -1;
      let hlDeltaWithColor;
      // only flag delta stat sig over 2 ms
      // prevent flagging on the fence sig eg.
      // estimator of 1 ci of [0,1]
      const estimatorISig = Math.abs(stat.estimator) >= 2 ? true : false;
      const statSig = estimatorISig && stat.confidenceInterval.isSig;
      if (statSig) {
        if (estimatorForDisplay > 0) {
          hlDeltaWithColor = chalk.red(`${estimatorForDisplay}ms`);
        } else if (!estimatorForDisplay) {
          hlDeltaWithColor = chalk.grey(`${estimatorForDisplay}ms`);
        } else {
          hlDeltaWithColor = chalk.green(`${estimatorForDisplay}ms`);
        }
      } else {
        hlDeltaWithColor = chalk.grey(`${estimatorForDisplay}ms`);
      }

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
            vAlign: "center",
            rowSpan: 2,
            colSpan: 1,
            content: "Sample Counts:",
          },
          `${controlLabelWithColor}: ${stat.sampleCount.control}`,
        ],
        [`${experimentLabelWithColor}: ${stat.sampleCount.experiment}`],
        [],
        [
          {
            vAlign: "center",
            rowSpan: 7,
            colSpan: 1,
            content: `${controlLabelWithColor} Seven Figure Summary:`,
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
            vAlign: "center",
            rowSpan: 7,
            colSpan: 1,
            content: `${experimentLabelWithColor} Seven Figure Summary:`,
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
            content: "Hodges–Lehmann estimated delta:",
          },
          // Reverse the signs when displaying
          { content: `${hlDeltaWithColor}` },
        ],
        [],
        [
          {
            content: `95% confident the delta is between:`,
          },
          {
            // For display flip the min and max
            content: `${stat.confidenceInterval.max * -1}ms to ${
              stat.confidenceInterval.min * -1
            }ms`,
          },
        ],
        [],
        [{ content: "Is Significant:" }, { content: `${statSig}` }],
        [
          { content: "P-Value:" },
          { content: `${stat.confidenceInterval.pValue}` },
        ],
        [],
        ["Control Sparkline", { content: `${stat.sparkLine.control}` }],
        [
          "Experiment Sparkline",
          {
            content: `${stat.sparkLine.experiment}`,
          },
        ]
      );
    });

    return this.table;
  }
}
