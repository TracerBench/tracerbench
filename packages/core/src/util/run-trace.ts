import type { TraceStreamJson } from '@tracerbench/trace-event';
import type { ProtocolConnection } from 'chrome-debugging-client';
import type { Protocol } from 'devtools-protocol';
import { writeFileSync } from 'fs-extra';
import {
  combineRaceCancellation,
  newRaceCancellation,
  oneshot,
  RaceCancellation,
  throwIfCancelled
} from 'race-cancellation';

import readHandle from './read-handle';

export type UsingTracingCallback = (
  raceCancellation: RaceCancellation
) => Promise<void>;

export default async function runTrace(
  page: ProtocolConnection,
  categories: string[],
  raceCancellation: RaceCancellation,
  usingTracing: UsingTracingCallback,
  path?: string
): Promise<TraceStreamJson> {
  const [completed, complete] =
    oneshot<Protocol.Tracing.TracingCompleteEvent>();
  const raceEarlyComplete = newRaceCancellation(
    completed,
    'tracing completed earlier than expected'
  );
  let stream: string;
  page.on('Tracing.tracingComplete', complete);
  try {
    await performTrace(
      page,
      {
        categories: categories.join(','),
        transferMode: 'ReturnAsStream'
      },
      usingTracing,
      combineRaceCancellation(raceEarlyComplete, raceCancellation)
    );
    stream = await waitForTraceStream(completed, raceCancellation);
  } finally {
    page.off('Tracing.tracingComplete', complete);
  }

  return await readTraceStream(page, stream, raceCancellation, path);
}

async function performTrace(
  conn: ProtocolConnection,
  startRequest: Protocol.Tracing.StartRequest,
  usingTracing: UsingTracingCallback,
  raceCancellation: RaceCancellation
): Promise<void> {
  await conn.send('Tracing.start', startRequest);
  try {
    await usingTracing(raceCancellation);
  } finally {
    await conn.send('Tracing.end');
  }
}

async function waitForTraceStream(
  completed: () => Promise<Protocol.Tracing.TracingCompleteEvent>,
  raceCancellation: RaceCancellation
): Promise<Protocol.IO.StreamHandle> {
  const { stream } = throwIfCancelled(await raceCancellation(completed));
  if (stream === undefined) {
    throw new Error('trace missing stream handle');
  }
  return stream;
}

async function readTraceStream(
  conn: ProtocolConnection,
  stream: Protocol.IO.StreamHandle,
  raceCancellation: RaceCancellation,
  path?: string
): Promise<TraceStreamJson> {
  const buffer = await readHandle(conn, stream, raceCancellation);
  if (path) {
    writeFileSync(path, buffer);
  }
  return JSON.parse(buffer.toString());
}
