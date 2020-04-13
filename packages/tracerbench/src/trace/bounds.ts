import {
  ITraceEvent,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_METADATA
} from './trace-event';

export default class Bounds {
  public min = 0;
  public max = 0;
  public empty = true;

  public addValue(value: number): void {
    if (this.empty) {
      this.empty = false;
      this.min = this.max = value;
    } else {
      this.max = Math.max(this.max, value);
      this.min = Math.min(this.min, value);
    }
  }

  public addEvent(event: ITraceEvent): void {
    if (event.ph === TRACE_EVENT_PHASE_METADATA) {
      return;
    }
    this.addValue(event.ts);
    if (event.ph === TRACE_EVENT_PHASE_COMPLETE) {
      this.addValue(event.ts + event.dur!);
    }
  }
}
