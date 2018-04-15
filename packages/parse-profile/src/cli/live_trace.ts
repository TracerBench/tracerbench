import { createSession, IAPIClient, IHTTPClient } from 'chrome-debugging-client';
import { IO, Network, Page, Tracing } from 'chrome-debugging-client/dist/protocol/tot';
import * as fs from 'fs';

interface ICookie {
  url: string;
  name: string;
  value: string;
  domain: string;
}

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

// tslint:disable:no-console

export async function liveTrace(url: string, out: string, cookies: ICookie[]) {
  return await createSession(async session => {
    let browserType;
    let executablePath;
    if (process.env.CHROME_BIN) {
      executablePath = process.env.CHROME_BIN;
      browserType = 'exact';
    } else {
      browserType = 'system';
    }

    const browser = await session.spawnBrowser(browserType, {
      executablePath,
    });

    const tab = await getTab(session.createAPIClient('127.0.0.1', browser.remoteDebuggingPort));

    const client = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl!);

    const page = new Page(client);
    const tracing = new Tracing(client);
    const network = new Network(client);
    const io = new IO(client);

    for (let i = 0; i < cookies.length; i++) {
      await network.setCookie(cookies[i]);
    }

    const tree = await page.getFrameTree();
    const mainFrameId = tree.frameTree.frame.id;
    console.log('frame tree', tree);

    await page.enable();
    const pageLoad = new Promise(resolve => {
      page.loadEventFired = evt => {
        console.log(evt);
        resolve();
      };
    });

    page.frameStartedLoading = evt => {
      if (mainFrameId === evt.frameId) console.log('frameStartedLoading', evt);
    };

    page.frameScheduledNavigation = evt => {
      if (mainFrameId === evt.frameId) console.log('frameScheduledNavigation', evt);
    };

    page.frameNavigated = evt => {
      if (mainFrameId === evt.frame.id) console.log('frameNavigated', evt);
    };

    const tracingComplete = new Promise<Tracing.TracingCompleteParameters>(resolve => {
      tracing.tracingComplete = resolve;
    });

    console.log(`starting trace`);
    await tracing.start({
      categories: DEVTOOLS_CATEGORIES.join(','),
      transferMode: 'ReturnAsStream',
      streamCompression: 'none',
    });
    console.log(`navigating to ${url}`);
    await page.navigate({
      url,
    });

    console.log(`waiting for load event`);
    await pageLoad;

    console.log(`stopping trace`);
    await tracing.end();

    const result = await tracingComplete;
    const handle = result.stream as string;
    const file = fs.openSync(out, 'w');
    try {
      let read: IO.ReadReturn;
      do {
        read = await io.read({ handle });
        fs.writeSync(
          file,
          read.base64Encoded ? Buffer.from(read.data, 'base64') : Buffer.from(read.data),
        );
      } while (!read.eof);
    } finally {
      fs.closeSync(file);
      await io.close({ handle });
    }
  });
}

async function getTab(apiClient: IAPIClient) {
  const tabs = await apiClient.listTabs();
  // create one tab at about:blank
  const tab = await apiClient.newTab('about:blank');
  // close other tabs
  for (let i = 0; i < tabs.length; i++) {
    await apiClient.closeTab(tabs[i].id);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  await apiClient.activateTab(tab.id);
  return tab;
}
