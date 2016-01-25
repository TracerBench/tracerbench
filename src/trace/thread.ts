import Bounds from "./bounds";
import {
  TraceEvent,
  TRACE_EVENT_PHASE_MARK
} from "./trace_event";

export default class Thread {
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];
  markers: TraceEvent[] = [];

  name: string;
  sortIndex: number;

  id: number;
  constructor(id: number) {
    this.id = id;
  }

  addEvent(event: TraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
    if (event.ph === TRACE_EVENT_PHASE_MARK) {
      this.markers.push(event);
    }
  }
}