import Bounds from './bounds';
import { ITraceEvent } from './trace-event';

export default class Thread {
  public bounds: Bounds = new Bounds();
  public events: ITraceEvent[] = [];

  public name?: string;
  public sortIndex?: number;

  public id: number;

  constructor(id: number) {
    this.id = id;
  }

  public addEvent(event: ITraceEvent): void {
    this.bounds.addEvent(event);
    this.events.push(event);
  }
}
