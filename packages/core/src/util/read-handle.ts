import { ProtocolConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import type { RaceCancellation } from 'race-cancellation';

export default async function readHandle(
  conn: ProtocolConnection,
  handle: Protocol.IO.StreamHandle,
  raceCancellation: RaceCancellation
): Promise<Buffer> {
  let totalLength = 0;
  const buffers: Buffer[] = [];
  try {
    let read: Protocol.IO.ReadResponse;
    do {
      read = await conn.send(
        'IO.read',
        {
          handle
        },
        raceCancellation
      );
      const encoding = read.base64Encoded ? 'base64' : 'utf8';
      const buffer = Buffer.from(read.data, encoding);
      if (buffer.length > 0) {
        buffers.push(buffer);
        totalLength += buffer.byteLength;
      }
    } while (!read.eof);
  } finally {
    await conn.send('IO.close', { handle });
  }
  return concat(buffers, totalLength);
}

function concat(buffers: Buffer[], totalLength: number): Buffer {
  return buffers.length === 1
    ? buffers[0]
    : Buffer.concat(buffers, totalLength);
}
