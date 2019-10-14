// tslint:disable:no-console

import debug from 'debug';
import Protocol from 'devtools-protocol';
import * as fs from 'fs';

const debugCallback = debug('tracerbench:trace');

import { IConditions } from './conditions';
import { createBrowser, getTab, emulate, setCookies } from './trace-utils';

const DEVTOOLS_CATEGORIES = [
  '-*',
  'devtools.timeline',
  'v8',
  'v8.execute',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'toplevel',
  'blink.console',
  'blink.user_timing',
  'latencyInfo',
  'disabled-by-default-devtools.timeline.stack',
  'disabled-by-default-v8.cpu_profiler',
  'disabled-by-default-v8.cpu_profiler.hires',
];

export async function liveTrace(
  url: string,
  out: string,
  cookies: Protocol.Network.CookieParam[],
  conditions: IConditions
) {
  const browser = await createBrowser([`--crash-dumps-dir=/tmp`]);
  try {
    const client = await getTab(browser.connection);
    await emulate(client, conditions);
    await setCookies(client, cookies);

    const tree = await client.send('Page.getFrameTree');
    const mainFrameId = tree.frameTree.frame.id;

    debugCallback('frame tree', tree);

    await client.send('Page.enable');

    // these can be leveraged and commented in/out
    client.on('Page.frameStartedLoading', evt => {
      if (mainFrameId === evt.frameId) {
        debugCallback('frameStartedLoading', evt);
      }
    });

    client.on('Page.frameScheduledNavigation', evt => {
      if (mainFrameId === evt.frameId) {
        debugCallback('frameScheduledNavigation', evt);
      }
    });

    client.on('Page.frameNavigated', evt => {
      if (mainFrameId === evt.frame.id) {
        debugCallback('frameNavigated', evt);
      }
    });

    debugCallback(`starting trace`);

    await client.send('Tracing.start', {
      categories: DEVTOOLS_CATEGORIES.join(','),
      transferMode: 'ReturnAsStream',
      streamCompression: 'none',
    });
    await Promise.all([
      client.until('Page.loadEventFired'),
      client.send('Page.navigate', { url }),
    ]);

    const [result] = await Promise.all([
      client.until('Tracing.tracingComplete'),
      client.send('Tracing.end'),
    ]);

    const handle = result.stream as string;
    const file = fs.openSync(out, 'w');
    try {
      let read: Protocol.IO.ReadResponse;
      do {
        read = await client.send('IO.read', { handle });
        fs.writeSync(
          file,
          read.base64Encoded
            ? Buffer.from(read.data, 'base64')
            : Buffer.from(read.data)
        );
      } while (!read.eof);
    } finally {
      fs.closeSync(file);
      await client.send('IO.close', { handle });
    }
  } finally {
    await browser.dispose();
  }
}
