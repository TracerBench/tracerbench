// tslint:disable:no-console

import { Categorized } from './aggregator';
import { Table } from './table';

export function report(categorized: Categorized, verbose: boolean) {
  let table = new Table();
  let totalAggregatedTime = 0;

  Object.keys(categorized).forEach(category => {
    categorized[category].forEach(result => {
      totalAggregatedTime += result.attributed;
    });
  });

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
      let methodCell = stats
        .addCell(`${result.moduleName} - ${result.functionName}`)
        .pad(2, 'left');
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
