import { Archive, Entry, Header } from '@tracerbench/har';
import { SessionConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import { readFileSync } from 'fs';

import { IConditions } from './conditions';
import { createBrowser, emulate, getTab, setCookies } from './trace-utils';
import { getBrowserArgs } from './utils';

export async function recordHARClient(
  url: string,
  cookies: Protocol.Network.CookieParam[],
  marker: string,
  conditions: IConditions,
  altBrowserArgs?: string[]
): Promise<Archive> {
  const tbSemver = JSON.parse(readFileSync('package.json', 'utf8'));
  const networkRequests: Protocol.Network.ResponseReceivedEvent[] = [];
  const archive: Archive = {
    log: {
      version: '0.0.0',
      creator: {
        name: 'TracerBench',
        version: tbSemver.version
      },
      entries: []
    }
  };

  const browserArgs = getBrowserArgs(altBrowserArgs);
  const browser = await createBrowser(browserArgs);

  try {
    const chrome = await getTab(browser.connection);

    chrome.on('Network.requestWillBeSent', (params) => {
      console.log(
        `RECORDING-REQUEST :: ${params.request.method} :: ${params.type} :: ${params.request.url}`
      );
    });

    chrome.on('Network.responseReceived', (params) => {
      networkRequests.push(params);
    });

    // enable Network / Page / Runtime
    await Promise.all([
      chrome.send('Page.enable'),
      chrome.send('Network.enable'),
      chrome.send('Runtime.enable')
    ]); // clear and disable cache
    await chrome.send('Network.clearBrowserCache');
    // disable cache
    await chrome.send('Network.setCacheDisabled', { cacheDisabled: true });

    await emulate(chrome, conditions);

    // set cookies
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
        observer.observe({ entryTypes: ["mark", "navigation"] });
        });`
    });

    // navigate to the url
    await chrome.send('Page.navigate', { url });

    // eval
    const evalPromise = chrome.send('Runtime.evaluate', {
      expression: `__TBMarkerPromise`,
      awaitPromise: true
    });

    let timeoutId: NodeJS.Timeout;
    const timeout = new Promise((reject) => {
      timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject('Promise timed out after waiting for 20 seconds');
      }, 20000);
    });

    await Promise.race([evalPromise, timeout]).then(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    archive.log.entries = await processEntries(networkRequests, chrome);

    await Promise.all([
      chrome.send('Network.disable'),
      chrome.send('Runtime.disable')
    ]);

    await chrome.send('Page.close');
  } catch (e) {
    throw new Error(`Network Request could not be captured. ${e}`);
  } finally {
    if (browser) {
      await browser.dispose();
    }
  }

  return archive;
}

export async function processEntries(
  networkRequests: Protocol.Network.ResponseReceivedEvent[],
  chrome: SessionConnection
): Promise<Entry[]> {
  const entries = [];
  for (let i = 0; i < networkRequests.length; i++) {
    console.log(`BUILDING-HAR-ENTRY-FOR :: ${networkRequests[i].response.url}`);
    const requestId = networkRequests[i].requestId;
    const response = networkRequests[i].response;
    const { body } = await chrome.send('Network.getResponseBody', {
      requestId
    });
    const { url, requestHeaders, status, statusText, headers } = response;

    const entry: Entry = {
      request: {
        url,
        method: '',
        httpVersion: '',
        cookies: [],
        headers: handleHeaders(requestHeaders),
        queryString: [],
        headersSize: 0,
        bodySize: 0
      },
      response: {
        status,
        statusText,
        httpVersion: '',
        cookies: [],
        headers: handleHeaders(headers),
        redirectURL: '',
        headersSize: 0,
        bodySize: 0,
        content: {
          text: body,
          size: 0,
          mimeType: ''
        }
      },
      time: 0,
      cache: {},
      timings: {
        send: 0,
        wait: 0,
        receive: 0
      },
      startedDateTime: ''
    };
    entries.push(entry);
  }

  return entries;
}

export function handleHeaders(headers?: Protocol.Network.Headers): Header[] {
  if (!headers) {
    return [{ name: '', value: '' }];
  }

  return Object.entries(headers).map((e) => {
    return { name: e[0], value: e[1] };
  });
}
