import { ITraceEvent, Trace } from './trace';

export { Trace } from './trace';
export { default as CpuProfile } from './cpuprofile';
export { Aggregator } from './cli/aggregator';
export { Reporter } from './cli/reporter';

export function loadTrace(events: ITraceEvent[]) {
  let trace = new Trace();
  trace.addEvents(events);
  trace.buildModel();
  return trace;
}
