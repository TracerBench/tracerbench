import Bounds from './bounds';
import { ITraceEvent } from './trace_event';

export default class Thread {
  bounds: Bounds = new Bounds();
  events: ITraceEvent[] = [];

  name?: string;
  sortIndex?: number;

  id: number;

  constructor(id: number) {
    this.id = id;
  }

  addEvent(event: ITraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
  }
}
