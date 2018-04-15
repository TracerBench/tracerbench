// tslint:disable:member-ordering

export interface DiffResult {
  from: string[];
  to: string[];
  changes: Change[];
  levenshteinDistance: number;
}

export interface Change {
  char: string;
  diff: string | { replacedBy: string };
}

export type Matrix = number[][] | number[][][];

export class Diff {
  from: string[];
  to: string[];
  matrix: Matrix;
  constructor(fromStr: string, toStr: string) {
    let splitter = '';
    let from = (this.from = fromStr.split(splitter));
    let to = (this.to = toStr.split(splitter));

    let steps = this.buildSteps(from, to);
    this.matrix = this.buildLevenshtein(steps, from, to);
  }

  private buildSteps(from: string[], to: string[]) {
    let steps: Matrix = [];

    for (let i = 0; i <= from.length; i++) {
      steps[i] = [];
      for (let j = 0; j <= to.length; j++) {
        if (i === 0) {
          steps[i][j] = [j];
        } else if (j === 0) {
          steps[i][j] = i;
        } else {
          steps[i][j] = 0;
        }
      }
    }

    return steps;
  }

  private buildLevenshtein(steps: Matrix, from: string[], to: string[]) {
    let left;
    let diagonal;
    let up;

    for (let i = 1; i <= from.length; i++) {
      for (let j = 1; j <= to.length; j++) {
        left = steps[i][j - 1];
        diagonal = steps[i - 1][j - 1];
        up = steps[i - 1][j];
        if (from[i - 1] === to[j - 1]) {
          steps[i][j] = diagonal;
        } else {
          steps[i][j] = Math.min(unbox(left), unbox(diagonal), unbox(up)) + 1;
        }
      }
    }

    return steps;
  }

  diff(): DiffResult {
    let changes: Change[] = [];
    let { from, to, matrix } = this;
    let i = from.length;
    let j = to.length;
    let left;
    let diagonal;
    let up;
    let source;
    let char = '';
    let diff: string | { replacedBy: string } = '';

    while (i > 0 || j > 0) {
      if (from[i - 1] === to[j - 1]) {
        char = from[i - 1];
        diff = '=';
        i--;
        j--;
      } else {
        if (i - 1 < 0) {
          up = Number.MAX_SAFE_INTEGER;
        } else {
          up = matrix[i - 1][j];
        }

        if (j - 1 < 0) {
          left = Number.MAX_SAFE_INTEGER;
        } else {
          left = matrix[i][j - 1];
        }

        if (i - 1 < 0 || j - 1 < 0) {
          diagonal = Number.MAX_SAFE_INTEGER;
        } else {
          diagonal = matrix[i - 1][j - 1];
        }

        source = Math.min(unbox(left), unbox(up), unbox(diagonal));

        if (source === left) {
          char = to[j - 1];
          diff = '+';
          j--;
        } else if (source === up) {
          char = from[i - 1];
          diff = '-';
          i--;
        } else if (source === diagonal) {
          char = from[i - 1];
          diff = { replacedBy: to[j - 1] };
          i--;
          j--;
        }
      }

      changes.push({ char, diff });
    }

    changes.reverse();
    return {
      from,
      to,
      changes,
      levenshteinDistance: matrix[from.length][to.length] as number,
    };
  }
}

function unbox(n: number | number[]) {
  if (Array.isArray(n)) {
    return n[0];
  }

  return n;
}
