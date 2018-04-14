import { createSession, IHTTPClient, IAPIClient } from 'chrome-debugging-client';
import { IO, Page, Tracing, Network } from 'chrome-debugging-client/dist/protocol/tot';
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

    let browser = await session.spawnBrowser(browserType, {
      executablePath,
    });

    let tab = await getTab(session.createAPIClient('127.0.0.1', browser.remoteDebuggingPort));

    let client = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl!);

    let page = new Page(client);
    let tracing = new Tracing(client);
    let network = new Network(client);
    let io = new IO(client);

    for (let i = 0; i < cookies.length; i++) {
      await network.setCookie(cookies[i]);
    }

    let tree = await page.getFrameTree();
    let mainFrameId = tree.frameTree.frame.id;
    console.log('frame tree', tree);

    await page.enable();
    let pageLoad = new Promise(resolve => {
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

    let tracingComplete = new Promise<Tracing.TracingCompleteParameters>(resolve => {
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

    let result = await tracingComplete;
    let handle = result.stream as string;
    let file = fs.openSync(out, 'w');
    try {
      let read: IO.ReadReturn;
      do {
        read = await io.read({ handle });
        fs.writeSync(
          file,
          read.base64Encoded ? Buffer.from(read.data, 'base64') : Buffer.from(read.data)
        );
      } while (!read.eof);
    } finally {
      fs.closeSync(file);
      await io.close({ handle });
    }
  });
}

async function getTab(apiClient: IAPIClient) {
  let tabs = await apiClient.listTabs();
  // create one tab at about:blank
  let tab = await apiClient.newTab('about:blank');
  // close other tabs
  for (let i = 0; i < tabs.length; i++) {
    await apiClient.closeTab(tabs[i].id);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  await apiClient.activateTab(tab.id);
  return tab;
}
