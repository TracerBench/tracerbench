import { TraceEvent, TRACE_EVENT_PHASE_COMPLETE } from "./trace_event";

export default class Bounds {
  min: number = 0;
  max: number = 0;
  empty: boolean = true;

  addValue(value: number) {
    if (this.empty) {
      this.empty = false;
      this.min = this.max = value;
    } else {
      this.max = Math.max(this.max, value);
      this.min = Math.min(this.min, value);
    }
  }

  addEvent(event: TraceEvent) {
    this.addValue(event.ts);
    if (event.ph === TRACE_EVENT_PHASE_COMPLETE) {
      let end = event.ts + event.dur;
      this.addValue(end);
    }
  }
}
