/* tslint:disable:max-classes-per-file */

class Cell {
  constructor(public content: string) {}
  public pad(size: number, dir: string) {
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

  public size() {
    return this.content.length;
  }

  public toString() {
    return this.content;
  }
}

class Row {
  private cells: Cell[] = [];
  constructor(public divider?: string) {}

  public addCell(content: string) {
    const cell = new Cell(content);
    this.cells.push(cell);
    return cell;
  }

  public size() {
    return this.toString().length;
  }

  public cellSizes() {
    return this.cells.map(c => c.size());
  }

  public fit(maxCellSizes: number[]) {
    const cellSizes = this.cellSizes();

    if (!this.divider) {
      cellSizes.forEach((size, i) => {
        const amount = maxCellSizes[i] - size;
        this.cells[i].pad(amount, 'right');
      });
    }
  }

  public empty() {
    this.addCell('');
  }

  public fill(size: number) {
    const content = new Array(size + 1).join(this.divider);
    this.cells.push(new Cell(content));
  }

  public toString() {
    return this.cells.join('');
  }
}

export class Table {
  private rows: Row[] = [];

  public addRow(divider?: string) {
    const row = new Row(divider);
    this.rows.push(row);
    return row;
  }

  public toString() {
    const { rows } = this;
    const maxCellSizes = this.maxCellSizes();

    rows.forEach(row => {
      if (!row.divider) {
        row.fit(maxCellSizes);
      }
    });

    const rowLength = this.maxRowSize();

    rows.forEach(row => {
      if (row.divider) {
        row.fill(rowLength);
      }
    });

    return rows.join('\n');
  }

  private maxRowSize() {
    let maxRowSize = 0;
    const { rows } = this;

    rows.forEach(row => {
      const len = row.size();
      if (len > maxRowSize) {
        maxRowSize = len;
      }
    });

    return maxRowSize;
  }

  private maxCellSizes() {
    const maxCellSizes: number[] = [];
    const { rows } = this;

    rows.forEach(row => {
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
