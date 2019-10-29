// tslint:disable:no-console
import Protocol from 'devtools-protocol';
import { join, resolve } from 'path';
import { openSync, readJSONSync, writeSync, closeSync } from 'fs-extra';

import { IConditions } from './conditions';
import { createBrowser, getTab, emulate, setCookies } from './trace-utils';
import { getBrowserArgs } from './utils';
import { ITraceEvent } from '../trace';
const DEVTOOLS_CATEGORIES = [
  '-*',
  'devtools.timeline',
  'viz',
  'benchmark',
  'blink',
  'cc',
  'gpu',
  'v8',
  'v8.execute',
  'disabled-by-default-devtools.timeline',
  'disabled-by-default-devtools.timeline.frame',
  'toplevel',
  'blink.console',
  'blink.user_timing',
  'latencyInfo',
  'disabled-by-default-v8.cpu_profiler',
  'disabled-by-default-v8.cpu_profiler',
  'disabled-by-default.cpu_profiler',
  'disabled-by-default.cpu_profiler.debug',
  'renderer',
  'cpu_profiler',
];

interface ITraceEvents {
  traceEvents: ITraceEvent[];
}

export async function liveTrace(
  url: string,
  tbResultsFolder: string,
  cookies: Protocol.Network.CookieParam[],
  conditions: IConditions,
  marker: string
): Promise<ITraceEvents> {
  const browserArgs = getBrowserArgs();
  const browser = await createBrowser(browserArgs);
  const traceFile = join(tbResultsFolder, 'trace.json');
  let traceJSON;
  try {
    const chrome = await getTab(browser.connection);

    // enable Network / Page / Runtime
    await Promise.all([
      chrome.send('Page.enable'),
      chrome.send('Network.enable'),
      chrome.send('Runtime.enable'),
    ]);
    // clear and disable cache
    await chrome.send('Network.clearBrowserCache');

    // disable cache
    await chrome.send('Network.setCacheDisabled', { cacheDisabled: true });

    await emulate(chrome, conditions);
    await setCookies(chrome, cookies);

    // add performance observer script to eval
    await chrome.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
            self.__TBMarkerPromise = new Promise(resolve => {
              const observer = new PerformanceObserver((list) => {
                if (list.getEntriesByName('${marker}').length > 0) {
                  resolve();
                }
            });
            observer.observe({ entryTypes: ["mark"] });
            });`,
    });

    await chrome.send('Tracing.start', {
      transferMode: 'ReturnAsStream',
      streamCompression: 'none',
      traceConfig: {
        includedCategories: DEVTOOLS_CATEGORIES,
        recordMode: 'recordUntilFull',
      },
    });

    await chrome.send('Page.navigate', { url });

    // eval
    const evalPromise = chrome.send('Runtime.evaluate', {
      expression: `__TBMarkerPromise`,
      awaitPromise: true,
    });

    let timeoutId: NodeJS.Timeout;
    const timeout = new Promise(reject => {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject('Promise timed out after waiting for 15 seconds');
      }, 15000);
    });

    await Promise.race([evalPromise, timeout]).then(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    const [result] = await Promise.all([
      chrome.until('Tracing.tracingComplete'),
      chrome.send('Tracing.end'),
    ]);

    const handle = result.stream as string;
    const file = openSync(traceFile, 'w');

    try {
      let read: Protocol.IO.ReadResponse;
      do {
        read = await chrome.send('IO.read', { handle });
        writeSync(
          file,
          read.base64Encoded
            ? Buffer.from(read.data, 'base64')
            : Buffer.from(read.data)
        );
      } while (!read.eof);
    } finally {
      closeSync(file);
      await chrome.send('IO.close', { handle });
      traceJSON = readJSONSync(resolve(traceFile));
      await chrome.send('Page.close');
    }
  } catch (e) {
    throw new Error(`Live Trace could not be captured. ${e}`);
  } finally {
    if (browser) {
      await browser.dispose();
    }
  }

  return traceJSON;
}
