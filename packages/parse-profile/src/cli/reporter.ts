import { Aggregations } from './aggregator';
import { Table } from './table';
// tslint:disable:no-console

export function report(aggregations: Aggregations, verbose: boolean) {
  let rows: string[][] = [];
  let aggregateTotal = 0;

  let table = new Table();
  let totalAggregatedTime = 0;

  let row = table.addRow();

  row.addCell('').pad(2, 'left');
  row.addCell('Total').pad(2, 'left');
  row.addCell('Attributed').pad(2, 'left');
  table.addRow('=');

  const sorted = Object.entries(aggregations).sort((a, b) => b[1].attributed - a[1].attributed);
  sorted.forEach( item => {
    const [ methodName, result ] = item;
    totalAggregatedTime += result.attributed;

    let stats = table.addRow();
    let methodCell = stats.addCell(result.name).pad(2, 'left');
    stats.addCell(`${toMS(result.total)}ms`).pad(2, 'left');
    stats.addCell(`${toMS(result.attributed)}ms`).pad(2, 'left');
  });

  table.addRow('-');

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
