import {
  ITraceEvent,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_INSTANT,
  TRACE_EVENT_PHASE_METADATA,
} from './trace_event';

export default class Bounds {
  public min: number = 0;
  public max: number = 0;
  public empty: boolean = true;

  public addValue(value: number) {
    if (this.empty) {
      this.empty = false;
      this.min = this.max = value;
    } else {
      this.max = Math.max(this.max, value);
      this.min = Math.min(this.min, value);
    }
  }

  public addEvent(event: ITraceEvent) {
    if (event.ph === TRACE_EVENT_PHASE_METADATA) {
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
