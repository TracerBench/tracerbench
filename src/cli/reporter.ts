import chalk from 'chalk';
import { Aggregator, CategorizedResults, CategoryResult, FullReport, Aggregations, Categorized } from './aggregator';
import { Heuristics, IHeuristicJSON, IValidation } from './heuristics';

// tslint:disable:no-console

export interface Row {
  category: string;
  heading1: string;
  space1: string;
  space2: string;
}

export class Reporter {
  private cols: number[] = [0, 6];
  private width: number = 0;

  constructor(public categorized: Categorized) {}

  // categoryReport(heuristics: Heuristics) {
  //   let result = this.aggregator.sumsPerHeuristicCategory(heuristics);
  //   this.print(`Aggregated Sum:`, result);
  // }

  // fullReport(heuristics: Heuristics, verbose: boolean) {
  //   let report = this.aggregator.sumsAllHeuristicCategories(heuristics);
  //   let rows = this.generateRows(report, verbose);
  //   this.printReport(rows, heuristics.categories);
  // }

  report(verbose: boolean) {
    let { categorized } = this;
    let rows: string[][] = [];
    let aggregateTotal = 0;
    let categories: string[] = [];

    Object.keys(categorized).forEach(category => {
      let [c1] = this.cols;
      categories.push(category);

      rows.push([category, 'Timing']);

      if (category.length > c1) {
        this.cols[0] = category.length;
      }

      let categoryTotal = 0;
      categorized[category].forEach((result) => {
        let { name, total, callsites } = result;

        aggregateTotal += total;
        categoryTotal += total;

        let [col1, col2] = this.cols;

        let timing = `${round(total)}ms`;

        rows.push([name, timing]);

        if (timing.length > col2) {
          this.cols[1] = timing.length;
        }

        if (verbose) {
          callsites.sort((a, b) => b.time - a.time);
          callsites.forEach((callsite) => {
            let { url, moduleName, loc: { line, col }, time } = callsite;
            let info = `  ${url}@${moduleName}-L${line}:C${col} ${round(time)}ms`;
            rows.push([info, '']);

            if (info.length > col1) {
              this.cols[0] = info.length;
            }
          });
        } else {
          if (name.length > col1) {
            this.cols[0] = name.length;
          }
        }
      });

      rows.push(['SubTotal', `${round(categoryTotal)}ms`]);
    });

    rows.push(['Total', `${round(aggregateTotal)}ms`]);

    this.printReport(rows, categories);
  }

  // private generateRows(report: FullReport, verbose: boolean) {
  //   let { categorized } = report;
  //   let rows: string[][] = [];
  //   let aggregateTotal = 0;

  //   Object.keys(categorized).forEach(category => {
  //     let [col1] = this.cols;

  //     rows.push([category, 'Timing']);

  //     if (category.length > col1) {
  //       this.cols[0] = category.length;
  //     }

  //     aggregateTotal += categorized[category].total;
  //     Object.keys(categorized[category].sums).forEach(methodName => {
  //       // tslint:disable-next-line:no-shadowed-variable
  //       let [col1, col2] = this.cols;
  //       let phaseTiming = `${round(categorized[category].sums[methodName].total)}ms`;
  //       rows.push([methodName, phaseTiming]);

  //       if (verbose) {
  //         categorized[category].sums[methodName].heuristics.forEach(heuristic => {
  //           let h = `  ${heuristic}`;
  //           rows.push([h, '']);

  //           if (h.length > col1) {
  //             this.cols[0] = h.length;
  //           }
  //         });
  //       } else {
  //         if (methodName.length > col1) {
  //           this.cols[0] = methodName.length;
  //         }
  //       }

  //       if (phaseTiming.length > col2) {
  //         this.cols[1] = phaseTiming.length;
  //       }
  //     });

  //     rows.push(['SubTotal', `${round(categorized[category].total)}ms`]);
  //   });

  //   rows.push([chalk.bold.yellow('\nDropped'), '']);

  //   // rows.push(...this.validations.warnings.map(w => [w, '']));

  //   rows.push(['Total', `${round(aggregateTotal)}ms`]);

  //   return rows;
  // }

  private spaceCols(num: number) {
    if (num > 0) {
      return new Array(num).join(' ');
    }

    return '';
  }

  private printReport(rows: string[][], categories: string[]) {
    let buffer = `Aggregated Scripting Time:\n`;
    let [col1, col2] = this.cols;

    const indent = 2;

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let [category, heading1] = row;

      let header;
      let space1;
      let space2;

      if (isHeader(categories, category)) {
        space1 = this.spaceCols(col1 - category.length + indent * 2);
        space2 = this.spaceCols(col2 - heading1.length + indent);
      } else {
        space1 = this.spaceCols(col1 - category.length + indent);
        space2 = this.spaceCols(col2 - heading1.length + indent);
      }

      let rowParts = {
        category,
        heading1,
        space1,
        space2,
      };

      buffer += this.formatRow(rowParts, categories);
    }
    console.log(buffer);
  }

  private formatRow(row: Row, categories: string[]) {
    let { category, heading1, space1, space2 } = row;
    let { width } = this;
    let buffer = '';

    if (categories.includes(category)) {
      category = chalk.inverse(category);
      let header = `\n${category}${space1}${heading1}\n`;
      this.width = header.length;
      buffer += header;
      buffer += `${new Array(this.width).join('=')}\n`;
    } else if (category === 'SubTotal' || category === 'Total' || category === 'Dropped') {
      let header = `${space1}${heading1}\n`;

      if (category === 'SubTotal' || category === 'Dropped') {
        header = `\n${yellow(category)}${header}`;
        buffer += `${new Array(width).join('-')}`;
        buffer += header;
      } else {
        header = `\n${green(category)}${header}`;
        buffer += `\n${new Array(width).join('=')}`;
        header = green(header);
        buffer += header;
        buffer += `${new Array(width).join('=')}`;
      }
    } else {
      buffer += `  ${category}${space1}${heading1}\n`;
    }

    return buffer;
  }

  private print(title: string, body: CategoryResult) {
    let buffer = white(`\n${title}\n================\n`);
    Object.keys(body.sums).forEach(methodName => {
      let normalizedName = normalizeMethodName(methodName);
      buffer += `${magenta(normalizedName)}: ${round(body.sums[methodName].total)}ms`;
      buffer += `\n  From ->`;
      buffer += `\n    ${body.sums[methodName].heuristics.join('\n    ')}\n`;
    });
    buffer += white(`================\nTotal: ${round(body.total)}ms`);
    console.log(buffer);
  }
}

function normalizeMethodName(name: string) {
  if (name === '') {
    name = '(anonymous function)';
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
