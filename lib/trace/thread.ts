import Bounds from "./bounds";
import {
  TraceEvent
} from "./trace_event";

export default class Thread {
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];

  name: string;
  sortIndex: number;

  id: number;
  constructor(id: number) {
    this.id = id;
  }

  addEvent(event: TraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
  }
}