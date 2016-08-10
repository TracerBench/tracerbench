import {
  createSession,
  ISession,
  IBrowserProcess,
  IAPIClient,
  VersionInfo,
  Tab,
  IDebuggingProtocolClient
} from "chrome-debugging-client";
import { Page, Tracing, HeapProfiler, Network } from "./debugging-protocol-domains";
import { Trace } from "./trace";
import * as os from "os";

export interface BenchmarkMeta {
  browserVersion: string;
  cpus: string[];
}

export interface IBenchmark<P extends BenchmarkParams, R> {
  params: P;
  /** run benchmark returning result */
  run(): Promise<R>;
}

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export interface ITab {
  /** The process id of the tab */
  pid: number;
  /** The current frame for the tab */
  frame: Page.Frame;
  /** Navigates to the specified url */
  navigate(url: string, waitForLoad?: boolean): Promise<void>;
  /** Start tracing */
  startTracing(categories: string, options?: string): Promise<ITracing>;
  /** Clear browser cache and memory cache */
  clearBrowserCache(): Promise<void>;
  /** Perform GC */
  collectGarbage(): Promise<void>;
}

export interface ITracing {
  traceComplete: Promise<Trace>;
  /** end early, normally records for duration or until buffer full  */
  end(): Promise<void>;
}

export interface BrowserOptions {
  type: string;
  executablePath?: string;
  chromiumSrcDir?: string;
}

export interface BenchmarkParams {
  name: string;
  browser: BrowserOptions;
  iterations?: number;
}

export abstract class Benchmark<P extends BenchmarkParams, R> implements IBenchmark<P, R> {
  params: P;
  iterations: number;
  browserOptions: BrowserOptions;

  constructor(params: P) {
    this.iterations = params.iterations > 0 ? params.iterations : 1;
    this.browserOptions = params.browser;
    this.params = params;
  }

  // create session, spawn browser, get port
  // connect to API to get version
  run(): Promise<R> {
    return createSession((session: ISession) => {
      return this.perform(session);
    });
  }

  async perform(session: ISession): Promise<R> {
    let browserOptions = this.browserOptions;
    let browser = await session.spawnBrowser(browserOptions.type, browserOptions);
    let apiClient = await session.createAPIClient("localhost", browser.remoteDebuggingPort);
    let version = await apiClient.version();
    let tabs = await apiClient.listTabs();
    // open a blank tab
    let prev = await apiClient.newTab("about:blank");
    for (let i = 0; i < tabs.length; i++) {
      await apiClient.closeTab(tabs[i].id);
    }
    await delay(2000);
    await apiClient.activateTab(prev.id);
    let browserVersion = version["Browser"];
    let cpus = os.cpus().map((cpu) => cpu.model);
    let results = this.createResults({browserVersion, cpus});

    for (let i = 0; i < this.iterations; i++) {
      let tab = await apiClient.newTab("about:blank");
      await apiClient.closeTab(prev.id);
      await apiClient.activateTab(tab.id);

      let client = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
      let page = new Page(client);
      await page.enable();
      let res = await page.getResourceTree();
      let frame = res.frameTree.frame;

      let dsl = new TabDSL(tab.id, client, page, frame);

      await dsl.clearBrowserCache();
      await dsl.collectGarbage();

      await delay(2000);

      await this.performIteration(dsl, results, i);

      await page.disable();
      prev = tab;
    }

    return results;
  }

  abstract createResults(meta: BenchmarkMeta): R;
  abstract performIteration(t: ITab, results: R, index: number): Promise<void>;
}

class TabDSL implements ITab {
  id: string;
  client: IDebuggingProtocolClient;
  page: Page;
  /** The current frame for the tab */
  frame: Page.Frame;
  /** The process id of the tab */
  pid: number;

  tracing: Tracing;
  currentTrace: TracingDSL;
  network: Network;
  heapProfiler: HeapProfiler;

  constructor(id: string, client: IDebuggingProtocolClient, page: Page, frame: Page.Frame) {
    this.client = client;
    this.page = page;
    this.frame = frame;
    this.tracing = new Tracing(client);
    this.network = new Network(client);
    this.heapProfiler = new HeapProfiler(client);
    this.currentTrace = null;
    let pid = this.pid =  parseInt(frame.id.split(".")[0], 10);
    page.frameNavigated = (params) => {
      let frame = params.frame;
      if (this.frame.id = frame.id) {
        this.onNavigated(frame);
      }
    };
  }

  onNavigated(frame: Page.Frame) {
    this.frame = frame;
    // navigating to "about:blank" a signal to end the current trace
    if (this.currentTrace && frame.url === "about:blank") {
      this.currentTrace.end();
    }
  }

  /** Navigates to the specified url */
  async navigate(url: string, waitForLoad?: boolean): Promise<void> {
    let didLoad;

    if (waitForLoad) {
      didLoad = new Promise(resolve => this.page.frameStoppedLoading = resolve);
    }

    if (this.frame.url === url) {
      await this.page.reload({});
    } else {
      await this.page.navigate({ url });
    }

    if (waitForLoad) {
      await didLoad;
    }
  }

  /** Start tracing */
  async startTracing(categories: string, options?: string): Promise<ITracing> {
    if (this.currentTrace) {
      throw new Error("already tracing");
    }
    let tracing = this.tracing;
    await tracing.start({
      categories: categories
    });
    let trace = this.currentTrace = new TracingDSL(tracing, this.pid);
    trace.traceComplete.then(() => {
      this.currentTrace = null;
    });
    return trace;
  }

  /** Clear browser cache and memory cache */
  async clearBrowserCache(): Promise<void> {
    await this.network.enable();
    let res = await this.network.canClearBrowserCache();
    if (!res.result) {
      throw new Error("Cannot clear browser cache");
    }
    await this.network.clearBrowserCache();
    // causes MemoryCache entries to be evicted
    await this.network.setCacheDisabled({cacheDisabled: true});
    await this.network.disable();
  }

  async collectGarbage(): Promise<void> {
    await this.heapProfiler.enable();
    await this.heapProfiler.collectGarbage();
    await this.heapProfiler.disable();
  }
}

class TracingDSL implements ITracing {
  tracing: Tracing;
  isTracing: boolean;
  isComplete: boolean;
  traceComplete: Promise<Trace>;
  endPromise: Promise<void>;

  constructor(tracing: Tracing, pid: number) {
    this.tracing = tracing;
    this.isTracing = true;
    this.isComplete = false;
    let trace = new Trace();
    tracing.dataCollected = (evt) => {
      trace.addEvents(evt.value);
    };
    this.traceComplete = new Promise<Trace>((resolve) => {
      // TODO setTimeout
      tracing.tracingComplete = () => {
        tracing.dataCollected = null;
        tracing.tracingComplete = null;
        this.isTracing = false;
        this.isComplete = true;
        trace.mainProcess = trace.processMap[pid];
        resolve(trace);
      };
    });
  }

  end(): Promise<void> {
    if (!this.endPromise) {
      if (this.isTracing) {
        this.endPromise = this.tracing.end().then(() => {
          this.isTracing = false;
        });
      } else {
        this.endPromise = Promise.resolve();
      }
    }
    return this.endPromise;
  }
}
