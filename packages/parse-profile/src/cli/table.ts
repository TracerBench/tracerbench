class Cell {
  constructor(public content: string) {}
  pad(size: number, dir: string) {
    let { content } = this;
    switch (dir) {
      case 'left':
        this.content = `${new Array(size + 1).join(' ')}${content}`;
        break;
      case 'right':
        this.content = `${content}${new Array(size + 1).join(' ')}`;
        break;
    }
  }

  size() {
    return this.content.length;
  }

  toString() {
    return this.content;
  }
}

class Row {
  private cells: Cell[] = [];
  constructor(public divider?: string) {}

  addCell(content: string) {
    let cell = new Cell(content);
    this.cells.push(cell);
    return cell;
  }

  size() {
    return this.toString().length;
  }

  cellSizes() {
    return this.cells.map(c => c.size());
  }

  fit(maxCellSizes: number[]) {
    let cellSizes = this.cellSizes();

    if (!this.divider) {
      cellSizes.forEach((size, i) => {
        let amount = maxCellSizes[i] - size;
        this.cells[i].pad(amount, 'right');
      });
    }
  }

  empty() {
    this.addCell('');
  }

  fill(size: number) {
    let content = new Array(size + 1).join(this.divider);
    this.cells.push(new Cell(content));
  }

  toString() {
    return this.cells.join('');
  }
}

export class Table {
  private rows: Row[] = [];

  addRow(divider?: string) {
    let row = new Row(divider);
    this.rows.push(row);
    return row;
  }

  toString() {
    let { rows } = this;
    let maxCellSizes = this.maxCellSizes();

    rows.forEach(row => {
      if (!row.divider) {
        row.fit(maxCellSizes);
      }
    });

    let rowLength = this.maxRowSize();

    rows.forEach(row => {
      if (row.divider) {
        row.fill(rowLength);
      }
    });

    return rows.join('\n');
  }

  private maxRowSize() {
    let maxRowSize = 0;
    let { rows } = this;

    rows.forEach(row => {
      let len = row.size();
      if (len > maxRowSize) {
        maxRowSize = len;
      }
    });

    return maxRowSize;
  }

  private maxCellSizes() {
    let maxCellSizes: number[] = [];
    let { rows } = this;

    rows.forEach(row => {
      let cellSizes = row.cellSizes();
      cellSizes.forEach((col, i) => {
        if (!maxCellSizes[i] || col > maxCellSizes[i]) {
          maxCellSizes[i] = col;
        }
      });
    });

    return maxCellSizes;
  }
}
