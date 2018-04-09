import { Aggregator, CategoryResult, CategorizedResults, FullReport } from './aggregator';
import chalk from 'chalk';
import { Heuristics } from './heuristics';

export interface Categories {
  [key: string]: string[];
}

export interface Row {
  category: string;
  heading1: string;
  heading2: string;
  space1: string;
  space2: string;
}

export class Reporter {
  aggregator: Aggregator;
  private cols: number[] = [0,6];
  private width: number = 0;

  constructor(aggregator: Aggregator) {
    this.aggregator = aggregator;
  }

  categoryReport(methods: string[]) {
    let result = this.aggregator.sumsPerHeuristicCategory(methods);
    this.print(`Aggregated Sum:`, result);
  }

  fullReport(heuristics: Heuristics) {
    let report = this.aggregator.sumsAllHeuristicCategories(heuristics);
    let rows = this.generateRows(report);
    this.printReport(rows, Object.keys(heuristics));
  }

  private generateRows(report: FullReport) {
    let { categorized, all } = report;
    let rows: string[][] = [];

    Object.keys(categorized).forEach(category => {
      let [col1] = this.cols;

      rows.push([category, 'Timing', 'Aggregate']);

      if (category.length > col1) {
        this.cols[0] = category.length;
      }

      let aggregateTotal = 0;
      Object.keys(categorized[category].sums).forEach((methodName) => {
        let [col1, col2] = this.cols;
        let phaseTiming = `${round(categorized[category].sums[methodName])}ms`;
        let aggegateTime = round(all!.sums[methodName]);
        aggregateTotal += aggegateTime;
        let aggregateTime = `${aggegateTime}ms`;

        rows.push([methodName, phaseTiming, aggregateTime]);

        if (methodName.length > col1) {
          this.cols[0] = methodName.length;
        }

        if (phaseTiming.length > col2) {
          this.cols[1] = phaseTiming.length;
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

  private printReport(rows: string[][], categories: string[]) {
    let buffer = `Aggregated Scripting Time:\n`;
    let [ col1, col2 ] = this.cols;

    const indent = 2;

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let [category, heading1, heading2] = row;

      let header;
      let space1;
      let space2;

      if (isHeader(categories, category)) {
        space1 = this.spaceCols(col1 - category.length + (indent * 2));
        space2 = this.spaceCols(col2 - heading1.length + indent);
      } else {
        space1 = this.spaceCols(col1 - category.length + indent);
        space2 = this.spaceCols(col2 - heading1.length + indent);
      }

      let rowParts = {
        category,
        heading1,
        heading2,
        space1,
        space2
      };

      buffer += this.formatRow(rowParts, categories);
    }

    console.log(buffer);
  }

  private formatRow(row: Row, categories: string[]) {
    let { category, heading1, heading2, space1, space2 } = row;
    let { width } = this;
    let buffer = '';

    if (categories.includes(category)) {
      category = chalk.inverse(category);
      let header = `\n${category}${space1}${heading1}${space2}${heading2}\n`;
      this.width = header.length;
      buffer += header;
      buffer += `${new Array(this.width).join('=')}\n`;
    } else if (category === 'SubTotal' || category === 'Total') {
      let header = `${space1}${heading1}${space2}${heading2}\n`;

      if (category === 'SubTotal') {
        header = `\n${yellow(category)}${header}`;
        buffer += `${new Array(width).join('-')}`
        buffer += header;
      } else {
        header = `\n${green(category)}${header}`;
        buffer += `\n${new Array(width).join('=')}`
        header = green(header);
        buffer += header;
        buffer += `${new Array(width).join('=')}`
      }

    } else {
      buffer += `  ${category}${space1}${heading1}${space2}${heading2}\n`
    }

    return buffer;
  }

  private print(title: string, body: CategoryResult) {
    let buffer = white(`\n${title}\n================\n`);
    Object.keys(body.sums).forEach((methodName) => {
      let normalizedName = normalizeMethodName(methodName);
      buffer += `${magenta(normalizedName)}: ${round(body.sums[methodName])}ms\n`
    });
    buffer += white(`================\nTotal: ${round(body.total)}ms`);
    console.log(buffer);
  }
}

function normalizeMethodName(name: string) {
  if (name === '') {
    name = '(anonymous function)'
  }

  return name;
}

function isHeader(categories: string[], category: string) {
  return categories.includes(category) || category === 'SubTotal' || category === 'Total';
}

function yellow(str: string) {
  return chalk.bold.yellow(str);
}

function green(str: string) {
  return chalk.bold.green(str);
}

function magenta(str: string) {
  return chalk.bold.magenta(str);
}

function white(str: string) {
  return chalk.bold.white(str);
}



function round(num: number) {
  return Math.round(num * 100) / 100;
}