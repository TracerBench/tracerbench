import { TraceEvent, TRACE_EVENT_PHASE_INSTANT, TRACE_EVENT_PHASE_METADATA } from "./trace_event";

export default function traceEventComparator(a: TraceEvent, b: TraceEvent) {
  let res = 0;
  if (a.ts !== b.ts) {
    res = a.ts - b.ts;
  } else if (a.ph === TRACE_EVENT_PHASE_METADATA) {
    res = -1;
  } else if (b.ph === TRACE_EVENT_PHASE_METADATA) {
    res = 1;
  }
  return res;
}
