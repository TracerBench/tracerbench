import chalk from 'chalk';
import { Aggregator, CategorizedResults, CategoryResult, FullReport, Aggregations, Categorized, Containment, Containers } from './aggregator';
import { Heuristics, IHeuristicJSON, IValidation } from './heuristics';

// tslint:disable:no-console

// category               Container  Containee  Aggregate
// e.create               100ms      110ms      0ms
//  Containers:
//  -----------------------------------------------------
//  e.flush               50ms
//  Containees:
//  -----------------------------------------------------
//  e.flush                          50ms
//  Callsites:
//  -----------------------------------------------------
//  @ember/container

export interface Row {
  category: string;
  heading1: string;
  heading2: string;
  heading3: string;
  space1: string;
  space2: string;
  space3: string;
  space4: string;
}

export class Reporter {
  private cols: number[] = [0, 6, 12, 18];
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

      rows.push([category, 'Container', 'Containee', 'Aggregate']);

      if (category.length > c1) {
        this.cols[0] = category.length;
      }

      let categoryTotal = 0;
      categorized[category].forEach((result) => {
        let { name, total, callsites, containees, containers } = result;

        // name = verbose ? white(name) : name;

        aggregateTotal += total;
        categoryTotal += total;

        let [col1, col2, col3, col4] = this.cols;

        let timing = `${round(toMS(total))}ms`;
        let containeeTime = `${round(toMS(this.containmentTime(containees)))}ms`;
        let containerTime = `${round(toMS(this.containmentTime(containers)))}ms`;

        rows.push([name, containerTime, containeeTime, timing]);

        this.fitRow(name, containerTime, containeeTime, timing);

        if (verbose) {
          if (containerTime !== '0ms') {
            rows = this.formatContainers(containers, 'Containers', rows);
            rows.push([' subtotal', `${white(containerTime)}`, '', '']);
          }

          if (containeeTime !== '0ms') {
            rows = this.formatContainers(containees, 'Containees', rows);
            rows.push(['', '', `${white(containeeTime)}`, '']);
          }

          rows.push(['', '', '', '']);
        } else {
          if (name.length > col1) {
            this.cols[0] = name.length;
          }
        }
      });

      rows.push(['SubTotal', '', '', `${round(toMS(categoryTotal))}ms`]);
    });

    rows.push(['Total', '', '', `${round(toMS(aggregateTotal))}ms`]);

    this.printReport(rows, categories);
  }

  private formatContainers(containers: Containers, label: string, rows: string[][]) {
    let containerRows: any[] = [];

    Object.keys(containers).forEach(container => {
      let t = containers[container].time;
      let time = `${round(toMS(containers[container].time))}ms`;
      let method = `  ${container}`;
      let row: string[] = [];
      if (label === 'Containers') {
        row.push(method, time, '', '');
      } else {
        row.push(method, '', time, '');
      }
      containerRows.push([row, t]);
      this.fitRow(method, time);
    });

    if (containerRows.length > 0) {
      rows.push([`  ${label}`, '', '', '']);
      this.fitRow(label);
    }

    containerRows.sort((a, b) => {
      return b[1] - a[1];
    });

    containerRows.forEach(r => {
      rows.push(r[0]);
    });

    return rows;
  }

  private containmentTime(containers: Containers) {
    return Object.keys(containers).reduce((accum, cur) => {
      return accum += containers[cur].time;
    }, 0);
  }

  private fitRow(...parts: string[]) {
    // let [a = '', b = '', c = '', d = ''] = parts;
    let [col1, col2, col3, col4] = this.cols;

    this.cols.forEach((_, i) => {
      let part = parts[i];
      let col = this.cols[i];

      if (part && part.length > col) {
        this.cols[i] = part.length;
      }

    });
  }

  private spaceCols(num: number) {
    if (num > 0) {
      return new Array(num).join(' ');
    }

    return '';
  }

  private printReport(rows: string[][], categories: string[]) {
    let buffer = `Aggregated Scripting Time:\n`;
    let [col1, col2, col3, col4] = this.cols;

    const indent = 2;

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let [category, heading1, heading2, heading3] = row;

      let header;
      let space1;
      let space2;
      let space3;
      let space4;

      if (isHeader(categories, category)) {
        space1 = this.spaceCols(col1 - category.length + indent * 2);
        space2 = this.spaceCols(col2 - heading1.length + indent);
        space3 = this.spaceCols(col3 - heading2.length + indent);
        space4 = this.spaceCols(col4 - heading3.length + indent);
      } else {
        space1 = this.spaceCols(col1 - category.length + indent);
        space2 = this.spaceCols(col2 - heading1.length + indent);
        space3 = this.spaceCols(col3 - heading2.length + indent);
        space4 = this.spaceCols(col4 - heading3.length + indent);
      }

      let rowParts = {
        category,
        heading1,
        heading2,
        heading3,
        space1,
        space2,
        space3,
        space4,
      };

      buffer += this.formatRow(rowParts, categories);
    }
    console.log(buffer);
  }

  private formatRow(row: Row, categories: string[]) {
    let { category, heading1, heading2, heading3, space1, space2, space3, space4 } = row;
    let { width } = this;
    let buffer = '';

    if (categories.includes(category)) {
      category = chalk.inverse(category);
      let header = `\n${category}${space1}${heading1}${space2}${heading2}${space3}${heading3}\n`;
      this.width = header.length;
      buffer += header;
      buffer += `${new Array(this.width).join('=')}\n`;
    } else if (
      category === 'SubTotal' ||
      category === 'Total' ||
      category === 'Dropped' ||
      category === '  Containers' ||
      category === '  Containees'
    ) {
      let header = `${space1}${heading1}${space2}${heading2}${space3}${heading3}\n`;

      if (category === 'SubTotal' || category === 'Dropped') {
        header = `\n${yellow(category)}${header}`;
        buffer += `${new Array(width).join('-')}`;
        buffer += header;
      } else if (category === '  Containers' || category === '  Containees') {
        header = `${white(category)}${header}`;
        buffer += header;
      } else {
        header = `\n${green(category)}${header}`;
        buffer += `\n${new Array(width).join('=')}`;
        header = green(header);
        buffer += header;
        buffer += `${new Array(width).join('=')}`;
      }
    } else {
      buffer += `  ${category}${space1}${heading1}${space2}${heading2}${space3}${heading3}\n`;
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

function toMS(num: number) {
  return num / 1000;
}
