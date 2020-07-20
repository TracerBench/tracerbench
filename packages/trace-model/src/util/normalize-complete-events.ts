import { Constants } from '@tracerbench/trace-event';

import { BeginEventModel, EndEventModel, EventModel } from '../types';
import mergeEndEvent from './merge-end-event';

/**
 * Assumes events are already sorted
 */
export default function normalizeCompleteEvents(
  sortedEvents: EventModel[],
  start: number,
  end: number
): void {
  const begins: BeginEventModel[] = [];
  const ends: EndEventModel[] = [];
  let pos = 0;
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    if (event.isEnd()) {
      const begin = findMatchingBegin(begins, event);
      if (begin === undefined) {
        ends.push(event);
      } else {
        mergeEndEvent(begin, event);
      }
      // filter end events
      continue;
    }
    if (event.isBegin()) {
      begins.push(event);
    }
    sortedEvents[pos++] = event;
  }
  sortedEvents.length = pos;
  if (begins.length > 0) {
    for (const begin of begins) {
      Object.assign(begin, {
        ph: Constants.TRACE_EVENT_PHASE_COMPLETE,
        end
      });
    }
  }
  if (ends.length > 0) {
    for (const end of ends) {
      Object.assign(end, {
        ph: Constants.TRACE_EVENT_PHASE_COMPLETE,
        start
      });
    }
    sortedEvents.unshift(...ends);
  }
}

function findMatchingBegin(
  begins: BeginEventModel[],
  end: EndEventModel
): BeginEventModel | undefined {
  for (let i = begins.length - 1; i >= 0; i--) {
    const begin = begins[i];
    if (begin.pid === end.pid && begin.tid === end.tid) {
      void begins.splice(i, 1);
      return begin;
    }
  }
}
