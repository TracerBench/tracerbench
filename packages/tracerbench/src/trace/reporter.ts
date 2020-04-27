import { ICategorized } from './aggregator';
import { AUTO_ADD_CAT } from './utils';

function findTotalAttrTime(categorized: ICategorized): number {
  let totalAggregatedTime = 0;
  Object.keys(categorized).forEach((category) => {
    categorized[category].forEach((result) => {
      totalAggregatedTime += result.attributed;
    });
  });
  return totalAggregatedTime;
}

function filterZeroTotalCats(categorized: ICategorized): ICategorized {
  return Object.keys(categorized).reduce((map, category) => {
    const filtered = categorized[category].filter((result) => {
      return result.total > 0;
    });
    if (filtered.length > 0) {
      map[category] = filtered;
    }
    return map;
  }, {} as ICategorized);
}

class Cell {
  constructor(public content: string) {}
  public pad(size: number, dir: string): void {
    const { content } = this;
    switch (dir) {
      case 'left':
        this.content = `${new Array(size + 1).join(' ')}${content}`;
        break;
      case 'right':
        this.content = `${content}${new Array(size + 1).join(' ')}`;
        break;
    }
  }

  public size(): number {
    return this.content.length;
  }

  public toString(): string {
    return this.content;
  }
}

class Row {
  private cells: Cell[] = [];
  constructor(public divider?: string) {}

  public addCell(content: string): Cell {
    const cell = new Cell(content);
    this.cells.push(cell);
    return cell;
  }

  public size(): number {
    return this.toString().length;
  }

  public cellSizes(): number[] {
    return this.cells.map((c) => c.size());
  }

  public fit(maxCellSizes: number[]): void {
    const cellSizes = this.cellSizes();

    if (!this.divider) {
      cellSizes.forEach((size, i) => {
        const amount = maxCellSizes[i] - size;
        this.cells[i].pad(amount, 'right');
      });
    }
  }

  public empty(): void {
    this.addCell('');
  }

  public fill(size: number): void {
    const content = new Array(size + 1).join(this.divider);
    this.cells.push(new Cell(content));
  }

  public toString(): string {
    return this.cells.join('');
  }
}

class Table {
  private rows: Row[] = [];

  public addRow(divider?: string): Row {
    const row = new Row(divider);
    this.rows.push(row);
    return row;
  }

  public toString(): string {
    const { rows } = this;
    const maxCellSizes = this.maxCellSizes();

    rows.forEach((row) => {
      if (!row.divider) {
        row.fit(maxCellSizes);
      }
    });

    const rowLength = this.maxRowSize();

    rows.forEach((row) => {
      if (row.divider) {
        row.fill(rowLength);
      }
    });

    return rows.join('\n');
  }

  private maxRowSize(): number {
    let maxRowSize = 0;
    const { rows } = this;

    rows.forEach((row) => {
      const len = row.size();
      if (len > maxRowSize) {
        maxRowSize = len;
      }
    });

    return maxRowSize;
  }

  private maxCellSizes(): number[] {
    const maxCellSizes: number[] = [];
    const { rows } = this;

    rows.forEach((row) => {
      const cellSizes = row.cellSizes();
      cellSizes.forEach((col, i) => {
        if (!maxCellSizes[i] || col > maxCellSizes[i]) {
          maxCellSizes[i] = col;
        }
      });
    });

    return maxCellSizes;
  }
}

export default function reporter(categorized: ICategorized): string {
  const table = new Table();
  const totalAggregatedTime = findTotalAttrTime(categorized);
  categorized = filterZeroTotalCats(categorized);

  Object.keys(categorized).forEach((category) => {
    const row = table.addRow();

    row.addCell(category);
    row.addCell('Total').pad(2, 'left');
    row.addCell('Attributed').pad(2, 'left');
    row.addCell('% Attributed').pad(2, 'left');
    table.addRow('=');

    let categoryTime = 0;

    const entries = categorized[category];
    const sorted = entries.sort((a, b) => b.attributed - a.attributed);
    sorted.forEach((result) => {
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

  return `${table.toString()} \n\n`;
}

function round(num: number): number {
  return Math.round(num * 100) / 100;
}

function toMS(num: number): number {
  return round(num / 1000);
}
