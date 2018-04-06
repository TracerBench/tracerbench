import { ITraceEvent, Trace } from './trace';

export { Trace } from './trace';
export { default as CpuProfile } from './cpuprofile';
export { Aggregator } from './cli/aggregator';
export { Reporter } from './cli/reporter';
export { default as CLI } from './cli/cli';
export { liveTrace } from './live_trace';

export interface ITrace {
  metadata: {};
  traceEvents: ITraceEvent[];
}

export function loadTrace(events: ITraceEvent[] | ITrace) {
  let trace = new Trace();
  if (!Array.isArray(events)) {
    events = events.traceEvents;
  }
  trace.addEvents(events);
  trace.buildModel();
  return trace;
}
