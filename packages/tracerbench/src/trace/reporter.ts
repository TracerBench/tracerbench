// tslint:disable:no-console

import { ICategorized } from './aggregator';
import { Table } from './table';
import { AUTO_ADD_CAT } from './utils';

function findTotalAttrTime(categorized: ICategorized) {
  let totalAggregatedTime = 0;
  Object.keys(categorized).forEach(category => {
    categorized[category].forEach(result => {
      totalAggregatedTime += result.attributed;
    });
  });
  return totalAggregatedTime;
}

function filterZeroTotalCats(categorized: ICategorized) {
  return Object.keys(categorized).reduce(
    (map, category) => {
      const filtered = categorized[category].filter(result => {
        return result.total > 0;
      });
      if (filtered.length > 0) {
        map[category] = filtered;
      }
      return map;
    },
    {} as ICategorized
  );
}

export function report(categorized: ICategorized) {
  const table = new Table();
  const totalAggregatedTime = findTotalAttrTime(categorized);
  categorized = filterZeroTotalCats(categorized);

  Object.keys(categorized).forEach(category => {
    const row = table.addRow();

    row.addCell(category);
    row.addCell('Total').pad(2, 'left');
    row.addCell('Attributed').pad(2, 'left');
    row.addCell('% Attributed').pad(2, 'left');
    table.addRow('=');

    let categoryTime = 0;

    const entries = categorized[category];
    const sorted = entries.sort((a, b) => b.attributed - a.attributed);
    sorted.forEach(result => {
      const stats = table.addRow();
      if (category === AUTO_ADD_CAT) {
        stats.addCell(`${result.moduleName}`).pad(2, 'left');
      } else {
        stats
          .addCell(`${result.moduleName} - ${result.functionName}`)
          .pad(2, 'left');
      }
      stats.addCell(`${toMS(result.total)}ms`).pad(2, 'left');
      stats.addCell(`${toMS(result.attributed)}ms`).pad(2, 'left');
      stats
        .addCell(
          `${((result.attributed / totalAggregatedTime) * 100).toFixed(2)}%`
        )
        .pad(2, 'left');
      categoryTime += result.attributed;
    });

    table.addRow('-');

    const subtotal = table.addRow();
    subtotal.addCell('Subtotal');
    subtotal.empty();
    subtotal.addCell(`${toMS(categoryTime)}ms`).pad(2, 'left');
    table.addRow('=');
    table.addRow().empty();
  });

  const totalRow = table.addRow();
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
