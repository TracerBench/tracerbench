import { Constants, TraceEventArgs } from '@tracerbench/trace-event';

import { BeginEventModel, CompleteEventModel, EndEventModel } from '../types';

export default function mergeEndEvent(
  beginEvent: BeginEventModel,
  endEvent: EndEventModel
): CompleteEventModel {
  return Object.assign(beginEvent, {
    ph: Constants.TRACE_EVENT_PHASE_COMPLETE as const,
    traceEvent: [beginEvent.traceEvent, endEvent.traceEvent],
    end: endEvent.start,
    args: mergeArgs(beginEvent.args, endEvent.args)
  });
}

function mergeArgs(
  a: TraceEventArgs | undefined,
  b: TraceEventArgs | undefined
): TraceEventArgs | undefined {
  if (a === undefined) {
    if (b === undefined) {
      return;
    }
    return b;
  } else if (b === undefined) {
    return a;
  }

  return { ...a, ...b };
}
