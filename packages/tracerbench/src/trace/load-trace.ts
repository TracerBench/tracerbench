import Trace from './trace';
import { ITraceEvent } from './trace-event';
export interface ITrace {
  metadata: {};
  traceEvents: ITraceEvent[];
}

export function loadTrace(events: ITraceEvent[] | ITrace): Trace {
  const trace = new Trace();
  if (!Array.isArray(events)) {
    events = events.traceEvents;
  }
  trace.addEvents(events);
  trace.buildModel();
  return trace;
}
