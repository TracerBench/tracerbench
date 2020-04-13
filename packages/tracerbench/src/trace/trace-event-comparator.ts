// eslint-disable-next-line filenames/match-exported
import { ITraceEvent, TRACE_EVENT_PHASE_METADATA } from './trace-event';

export default function traceEventComparator(
  a: ITraceEvent,
  b: ITraceEvent
): number {
  let res = 0;
  if (a.ts !== b.ts) {
    res = a.ts - b.ts;
  } else if (a.ph === TRACE_EVENT_PHASE_METADATA) {
    res = -1;
  } else if (b.ph === TRACE_EVENT_PHASE_METADATA) {
    res = 1;
  }
  if (res === 0) {
    res = a.pid - b.pid;
    if (res === 0) {
      res = a.tid - b.tid;
      if (res === 0) {
        res = strcmp(a.ph, b.ph);
        if (res === 0) {
          res = strcmp(a.cat, b.cat);
          if (res === 0) {
            res = strcmp(a.name, b.name);
            // TODO compare id, right now we only complete B/E
            // if we do async events, this should compare ids too
          }
        }
      }
    }
  }
  return res;
}

function strcmp(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
