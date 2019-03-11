// tslint:disable:no-console

const fs = require('fs-extra');
import { removeFilename } from '../cli/utils';
import { Categorized } from './aggregator';
import { ANALYSIS_WRITE_MSG } from './constants';
import { Table } from './table';
import { AUTO_ADD_CAT } from './utils';

export interface OutputStats {
  [key: string]: CatStats;
}

export interface CatStats {
  catStats: PerCatStats;
  methodStats: PerMethodStats;
}

export interface PerCatStats {
  total: number;
}

export interface PerMethodStats {
  [key: string]: StatsResult;
}

export interface StatsResult {
  total: number;
  self: number;
  attributed: number;
  functionName: string;
  moduleName: string;
  percentage: number;
}

export interface RenderOutputStats {
  [index: string]: OutputStats;
}

function findTotalAttrTime(categorized: Categorized) {
  let totalAggregatedTime = 0;
  Object.keys(categorized).forEach(category => {
    categorized[category].forEach(result => {
      totalAggregatedTime += result.attributed;
    });
  });
  return totalAggregatedTime;
}

function filterZeroTotalCats(categorized: Categorized) {
  return Object.keys(categorized).reduce((map, category) => {
    const filtered = categorized[category].filter(result => {
      return result.total > 0;
    });
    if (filtered.length > 0) map[category] = filtered;
    return map;
  }, {} as Categorized);
}

export function toJsonOut(categorized: Categorized, filepath: string, shouldWrite: boolean) {
  let totalAggregatedTime = findTotalAttrTime(categorized);
  categorized = filterZeroTotalCats(categorized);
  const output: OutputStats = {};
  Object.keys(categorized).forEach(category => {
    let categoryTime = 0;
    const perCat: PerMethodStats = {};
    categorized[category].forEach(result => {
      const perMethod: StatsResult = {
        total: result.total,
        self: result.self,
        attributed: result.attributed,
        functionName: result.functionName,
        moduleName: result.moduleName,
        percentage: (result.attributed / totalAggregatedTime) * 100
      };
      perCat[`${result.moduleName}-${result.functionName}`] = perMethod;
      categoryTime += result.attributed;
    });
    output[category] = {
      catStats: {total: categoryTime},
      methodStats: perCat
    };
  });

  if (shouldWrite) {
    fs.ensureDirSync(removeFilename(filepath));
    fs.writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`${ANALYSIS_WRITE_MSG} ${filepath}`);
  }
  return output;
}

export function report(categorized: Categorized) {
  let table = new Table();
  let totalAggregatedTime = findTotalAttrTime(categorized);
  categorized = filterZeroTotalCats(categorized);

  Object.keys(categorized).forEach(category => {
    let row = table.addRow();

    row.addCell(category);
    row.addCell('Total').pad(2, 'left');
    row.addCell('Attributed').pad(2, 'left');
    row.addCell('% Attributed').pad(2, 'left');
    table.addRow('=');

    let categoryTime = 0;

    const entries = categorized[category];
    const sorted = entries.sort((a, b) => b.attributed - a.attributed);
    sorted.forEach(result => {
      let stats = table.addRow();
      if (category === AUTO_ADD_CAT) {
        stats.addCell(`${result.moduleName}`).pad(2, 'left');
      } else {
        stats.addCell(`${result.moduleName} - ${result.functionName}`).pad(2, 'left');
      }
      stats.addCell(`${toMS(result.total)}ms`).pad(2, 'left');
      stats.addCell(`${toMS(result.attributed)}ms`).pad(2, 'left');
      stats
        .addCell(`${((result.attributed / totalAggregatedTime) * 100).toFixed(2)}%`)
        .pad(2, 'left');
      categoryTime += result.attributed;
    });

    table.addRow('-');

    let subtotal = table.addRow();
    subtotal.addCell('Subtotal');
    subtotal.empty();
    subtotal.addCell(`${toMS(categoryTime)}ms`).pad(2, 'left');
    table.addRow('=');
    table.addRow().empty();
  });

  let totalRow = table.addRow();
  totalRow.addCell('Total');
  totalRow.empty();
  totalRow.addCell(`${toMS(totalAggregatedTime)}`).pad(2, 'left');

  console.log(table.toString());
}

function round(num: number) {
  return Math.round(num * 100) / 100;
}

function toMS(num: number) {
  return round(num / 1000);
}
