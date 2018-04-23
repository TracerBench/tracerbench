import { ITraceEvent, Trace } from './trace';

export * from './trace/index';
export { Reporter } from './cli/reporter';
export { default as CLI } from './cli/cli';
export { liveTrace } from './cli/live_trace';
export { networkConditions } from './cli/conditions';
export { harTrace } from './cli/archive_trace';

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

export { showError } from './cli/error';
