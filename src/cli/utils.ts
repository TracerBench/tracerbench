import * as childProcess from 'child_process';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
import { Hash } from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Trace } from '../trace';

// tslint:disable:no-console

export function computeMinMax(trace: Trace, start: string = 'navigationStart', end: string) {
  let min;
  let max;
  if (end) {
    // TODO harden this to find the correct frame
    let startEvent = trace.events.find(e => e.name === start)!;
    let endEvent = trace.events.find(e => e.name === end);

    if (!endEvent) {
      throw new Error(`Could not find "${end}" marker in the trace.`);
    }

    min = startEvent.ts;
    max = endEvent.ts;
  } else {
    min = -1;
    max = -1;
  }

  return { min, max };
}
