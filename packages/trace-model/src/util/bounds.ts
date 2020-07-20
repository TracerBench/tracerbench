export default class Bounds {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  public extend(start: number, end: number): void {
    this.start = Math.min(this.start, start);
    this.end = Math.max(this.end, end);
  }
}
