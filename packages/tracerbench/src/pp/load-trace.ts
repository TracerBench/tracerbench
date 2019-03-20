import Trace from '../trace/trace';
import { ITraceEvent } from '../trace/trace_event';

export interface ITrace {
  metadata: {};
  traceEvents: ITraceEvent[];
}

export function loadTrace(events: ITraceEvent[] | ITrace) {
  const trace = new Trace();
  if (!Array.isArray(events)) {
    events = events.traceEvents;
  }
  trace.addEvents(events);
  trace.buildModel();
  return trace;
}
