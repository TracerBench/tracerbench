import { Archive, Entry, Header } from '@tracerbench/har';
import { SessionConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';

import { IConditions } from './conditions';
import {
  createBrowser,
  emulate,
  getBrowserArgs,
  getTab,
  setCookies
} from './utils';
import debug = require('debug');

// run with DEBUG=* eg.`DEBUG=* tracerbench record-har`
// run with DEBUG=tracerbench:archive-trace eg.`DEBUG=tracerbench:archive-trace tracerbench record-har`
const debugCallback = debug('tracerbench:archive-trace');

type NetworkRequestStacks = {
  stackA: Protocol.Network.ResponseReceivedEvent[];
  stackB: Protocol.Network.ResponseReceivedEvent[];
};

const networkRequestStacks: NetworkRequestStacks = {
  stackA: [],
  stackB: []
};

export async function recordHARClient(
  url: string,
  cookies: Protocol.Network.CookieParam[],
  marker: string,
  conditions: IConditions,
  altBrowserArgs?: string[]
): Promise<Archive> {
  const archive: Archive = {
    log: {
      version: '0.0.0',
      creator: {
        name: 'TracerBench',
        version: '0.0.0'
      },
      entries: []
    }
  };
  const browserArgs = getBrowserArgs(altBrowserArgs);
  const browser = await createBrowser(browserArgs);

  try {
    const chrome = await getTab(browser.connection);

    chrome.on('Network.requestWillBeSent', (params) => {
      debugCallback('Network.requestWillBeSent %o', params);
    });

    chrome.on('Network.responseReceived', (params) => {
      const { statusText, status } = params.response;

      if (
        params.type === 'Other' ||
        statusText === 'No Content' ||
        status === 204 ||
        status === 206 ||
        (statusText !== 'OK' && status >= 400)
      ) {
        debugCallback('NOT-INCLUDED %o', params);
        return;
      }

      debugCallback('Network.responseReceived %o', params);
      networkRequestStacks.stackA.push(params);
    });

    // enable Network / Page / Runtime
    await Promise.all([
      chrome.send('Page.enable'),
      chrome.send('Network.enable'),
      chrome.send('Runtime.enable')
    ]);

    // clear and disable cache
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
      debugCallback('evalPromise resolved with marker %o', marker);
    });

    archive.log.entries = await processEntriesLoop(chrome);

    await Promise.all([
      chrome.send('Network.disable'),
      chrome.send('Runtime.disable')
    ]);

    debugCallback('Network.disable');
    debugCallback('Runtime.disable');

    await chrome.send('Page.close');
    debugCallback('Page.close');
  } catch (e) {
    throw new Error(e);
  } finally {
    if (browser) {
      await browser.dispose();
      debugCallback('browser.dispose()');
    }
  }

  return archive;
}

export async function processEntriesLoop(
  chrome: SessionConnection
): Promise<Entry[]> {
  debugCallback(
    'processEntriesLoop() %o',
    `${networkRequestStacks.stackA.length} entries`
  );
  let networkEntries: Entry[] = [];
  // empty A into B
  networkRequestStacks.stackB = networkRequestStacks.stackA;
  networkRequestStacks.stackA = [];

  // process B and empty
  networkEntries = await processEntries(networkRequestStacks.stackB, chrome);
  networkRequestStacks.stackB = [];

  // check A for new entries
  // if empty return
  if (networkRequestStacks.stackA.length > 0) {
    debugCallback(
      'processEntriesLoop() %o',
      `${networkRequestStacks.stackA.length} entries`
    );

    networkEntries = networkEntries.concat(await processEntriesLoop(chrome));
  }

  return networkEntries;
}

export async function processEntries(
  networkRequests: Protocol.Network.ResponseReceivedEvent[],
  chrome: SessionConnection
): Promise<Entry[]> {
  debugCallback('processEntries()');
  const entries = [];
  for (let i = 0; i < networkRequests.length; i++) {
    debugCallback('processEntries.entry %o', networkRequests[i].response.url);

    try {
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
    } catch (e) {
      console.warn(e, networkRequests[i].response);
    }
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
