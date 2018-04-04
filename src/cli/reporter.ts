import { Aggregator, CategoryResult, CategorizedResults} from './aggregator';
import chalk from 'chalk';

export interface Categories {
  [key: string]: string[];
}

export class Reporter {
  aggregator: Aggregator;
  constructor(aggregator: Aggregator) {
    this.aggregator = aggregator;
  }

  categoryReport(methods: string[]) {
    let result = this.aggregator.sumsPerHeuristicCategory(methods);
    this.print(`Aggregated Sum:`, result);
  }

  fullReport(categories: Categories) {
    let { categorized, all } = this.aggregator.sumsAllHeuristicCategories(categories);
    Object.keys(categorized).forEach((category) => {
      this.print(`Aggregated Sum For ${category}:`, categorized[category]);
    });
    this.print(`Total Aggregated Sum:`, all as CategoryResult);
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