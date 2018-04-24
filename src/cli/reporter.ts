import { Categorized } from './aggregator';
import { Table } from './table';
// tslint:disable:no-console

export function report(categorized: Categorized, verbose: boolean) {
  let rows: string[][] = [];
  let aggregateTotal = 0;
  let categories: string[] = [];

  let table = new Table();
  let totalAggregatedTime = 0;

  Object.keys(categorized).forEach(category => {
    let row = table.addRow();

    row.addCell(category);
    row.addCell('Total').pad(2, 'left');
    row.addCell('Attributed').pad(2, 'left');
    table.addRow('=');

    let categoryTime = 0;

    categorized[category].forEach(result => {
      let stats = table.addRow();
      let methodCell = stats.addCell(result.name).pad(2, 'left');
      stats.addCell(`${toMS(result.total)}ms`).pad(2, 'left');
      stats.addCell(`${toMS(result.attributed)}ms`).pad(2, 'left');
      categoryTime += result.attributed;
      totalAggregatedTime += result.attributed;
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
