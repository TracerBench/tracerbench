// tslint:disable:no-console
import Protocol from 'devtools-protocol';
import { join } from 'path';
import { writeFileSync } from 'fs-extra';
import { spawnChrome } from 'chrome-debugging-client';
import { wait } from './utils';
import { IConditions } from './conditions';
import { emulate, setCookies, getTab } from './trace-utils';
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

export interface ITraceEvents {
  traceEvents: ITraceEvent[];
}

export async function liveTrace(
  url: string,
  tbResultsFolder: string,
  cookies: Protocol.Network.CookieParam[],
  conditions: IConditions
): Promise<ITraceEvents> {
  const chrome = spawnChrome({ headless: true });
  const traceFile = join(tbResultsFolder, 'trace.json');
  const traceEvents: Protocol.Tracing.DataCollectedEvent[] = [];
  const traceObj: ITraceEvents = { traceEvents: [] };
  try {
    const browser = chrome.connection;
    const chromeTab = await getTab(browser);
    // enable Network / Page
    await Promise.all([
      chromeTab.send('Page.enable'),
      chromeTab.send('Network.enable'),
    ]);

    // clear and disable cache
    await chromeTab.send('Network.clearBrowserCache');
    await chromeTab.send('Network.setCacheDisabled', { cacheDisabled: true });

    // emulate and set
    await emulate(chromeTab, conditions);
    await setCookies(chromeTab, cookies);

    // series of dataCollected events
    browser.on('Tracing.dataCollected', event => {
      traceEvents.push(event);
    });

    await browser.send('Tracing.start', {
      traceConfig: {
        includedCategories: DEVTOOLS_CATEGORIES,
      },
    });

    // navigate to a blank page first
    await Promise.all([
      chromeTab.send('Page.navigate', { url: 'about:blank' }),
      wait(1000),
    ]);

    await Promise.all([
      chromeTab.send('Page.navigate', { url }),
      chromeTab.until('Page.loadEventFired'),
    ]);

    await browser.send('Tracing.end');
    await browser.until('Tracing.tracingComplete');

    // merge the buffer trace events
    traceEvents.forEach(i => {
      i.value.forEach((ii: ITraceEvent) => {
        traceObj.traceEvents.push(ii);
      });
    });

    writeFileSync(traceFile, JSON.stringify(traceObj));

    await chrome.close();
  } catch (e) {
    throw new Error(`Live Trace could not be captured. ${e}`);
  } finally {
    if (chrome) {
      await chrome.dispose();
    }
  }

  return traceObj;
}
