import { ITraceEvent, TRACE_EVENT_PHASE } from './trace_event';

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

  addEvent(event: ITraceEvent) {
    if (event.ph === TRACE_EVENT_PHASE.METADATA) {
      return;
    }
    if (event.ts !== undefined) {
      this.addValue(event.ts);
      if (event.dur !== undefined) {
        this.addValue(event.ts + event.dur);
      }
    }
  }
}
