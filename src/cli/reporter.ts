import { Aggregator, CategoryResult, CategorizedResults, FullReport} from './aggregator';
import chalk from 'chalk';

export interface Categories {
  [key: string]: string[];
}

export class Reporter {
  aggregator: Aggregator;
  private longestMethodName: number = 0;
  private longestCategory: number = 0;
  private longestPhaseTiming: number = 0;
  private longestAggTiming: number = 0;

  constructor(aggregator: Aggregator) {
    this.aggregator = aggregator;
  }

  categoryReport(methods: string[]) {
    let result = this.aggregator.sumsPerHeuristicCategory(methods);
    this.print(`Aggregated Sum:`, result);
  }

  fullReport(categories: Categories) {
    let report = this.aggregator.sumsAllHeuristicCategories(categories);
    let rows = this.generateRows(report);
    this.printReport(rows);
  }

  private get col1Size() {
    let { longestMethodName, longestCategory } = this;
    return longestMethodName > longestCategory ? longestMethodName : longestCategory;
  }

  private get col2Size() {
    let { longestPhaseTiming } = this;
    return longestPhaseTiming > 6 ? longestPhaseTiming : 6;
  }

  private generateRows(report: FullReport) {
    let { categorized, all } = report;
    let rows: string[][] = [];

    Object.keys(categorized).forEach(category => {
      let { longestCategory } = this;

      rows.push([category]);

      if (category.length > longestCategory) {
        this.longestCategory = category.length;
      }

      let aggregateTotal = 0;
      Object.keys(categorized[category].sums).forEach((methodName) => {
        let { longestMethodName, longestPhaseTiming } = this;
        let phaseTiming = `${round(categorized[category].sums[methodName])}ms`;
        let aggegateTime = round(all!.sums[methodName]);
        aggregateTotal += aggegateTime;
        let aggregateTime = `${aggegateTime}ms`;

        rows.push([methodName, phaseTiming, aggregateTime]);

        if (methodName.length > longestMethodName) {
          this.longestMethodName = methodName.length;
        }

        if (phaseTiming.length > longestPhaseTiming) {
          this.longestPhaseTiming = phaseTiming.length;
        }
      });

      rows.push(['SubTotal', `${round(categorized[category].total)}ms`, `${round(aggregateTotal)}ms`]);
    });

    rows.push(['Total', '', `${round(all!.total)}ms`])

    return rows;
  }

  private spaceCols(num: number) {
    if (num > 0) {
      return new Array(num).join(' ');
    }

    return '';
  }

  private printReport(rows: string[][]) {
    let buffer = `Aggregated Scripting Time:\n`;
    let { col1Size, col2Size } = this;

    const indent = 2;
    let dividerLen = 0;

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let [category] = row;

      if (row.length === 1) {
        let space1 = this.spaceCols(col1Size - category.length + (indent * 2));
        let space2 = this.spaceCols(col2Size - 4);
        category = chalk.inverse(category);
        let header = `\n${category}${space1}Timing${space2}Aggregate\n`;
        dividerLen = header.length;
        buffer += header;
        buffer += `${new Array(dividerLen).join('=')}\n`;
      } else if (category === 'SubTotal' || category === 'Total') {
        let [name, totalTime, aggTime] = row;
        let space1 = this.spaceCols(col1Size - name.length + (indent * 2));
        let space2 = this.spaceCols(col2Size - totalTime.length + indent)
        let header = `${space1}${totalTime}${space2}${aggTime}\n`;

        if (name === 'SubTotal') {
          header = `\n${chalk.bold.yellow(name)}${header}`;
          buffer += `${new Array(dividerLen).join('-')}`
          buffer += header;
        } else {
          header = `\n${chalk.bold.green(name)}${header}`;
          buffer += `\n${new Array(dividerLen).join('=')}`
          header = chalk.bold.green(header);
          buffer += header;
          buffer += `${new Array(dividerLen).join('=')}`
        }

      } else {
        let [methodName, timing, aggTime] = row;
        let space1 = this.spaceCols(col1Size - methodName.length + indent);
        let space2 = this.spaceCols(col2Size - timing.length + indent);

        buffer += `  ${methodName}${space1}${timing}${space2}${aggTime}\n`
      }
    }

    console.log(buffer);
  }

  private print(title: string, body: CategoryResult) {
    let buffer = chalk.bold.white(`\n${title}\n================\n`);
    Object.keys(body.sums).forEach((methodName) => {
      let normalizedName = normalizeMethodName(methodName);
      buffer += `${chalk.bold.magenta(normalizedName)}: ${round(body.sums[methodName])}ms\n`
    });
    buffer += chalk.bold.white(`================\nTotal: ${round(body.total)}ms`);
    console.log(buffer);
  }
}

function normalizeMethodName(name: string) {
  if (name === '') {
    name = '(anonymous function)'
  }

  return name;
}

function round(num: number) {
  return Math.round(num * 100) / 100;
}