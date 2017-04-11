import {
  createSession,
  ISession,
  IBrowserProcess,
  SpawnOptions,
  ResolveOptions,
  IAPIClient,
  VersionInfo,
  Tab,
  IDebuggingProtocolClient
} from "chrome-debugging-client";
import { Page, Tracing, HeapProfiler, Network, Emulation } from "./debugging-protocol-domains";
import { Trace } from "./trace";
import * as os from "os";

export interface BenchmarkMeta {
  browserVersion: string;
  cpus: string[];
}

export interface IBenchmark<State, Result> {
  name: string;

  /** convenience to run the benchmark, returning result */
  run(iterations: number): Promise<Result>;

  /** alternatively, the following can be invoked manually in order */

  /** setup the benchmark */
  setup(session: ISession): Promise<State>;

  /** run a single iteration of the benchmark */
  perform(session: ISession, state: State, iteration: number): Promise<State>;

  /** finalize the benchmark, returning result */
  finalize(session: ISession, state: State): Promise<Result>;
}

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export interface ITab {
  /** The process id of the tab */
  pid: number;
  /** The current frame for the tab */
  frame: Page.Frame;
  /** Add a script to execute on load */
  addScriptToEvaluateOnLoad(source: string): Promise<Page.ScriptIdentifier>;
  /** Remove a previously added script */
  removeScriptToEvaluateOnLoad(identifier: Page.ScriptIdentifier): Promise<void>;
  /** Navigates to the specified url */
  navigate(url: string, waitForLoad?: boolean): Promise<void>;
  /** Start tracing */
  startTracing(categories: string, options?: string): Promise<ITracing>;
  /** Clear browser cache and memory cache */
  clearBrowserCache(): Promise<void>;
  /** Perform GC */
  collectGarbage(): Promise<void>;

  setCPUThrottlingRate(rate: number): Promise<void>;
  emulateNetworkConditions(conditions: NetworkConditions): Promise<void>;
  disableNetworkEmulation();
}

export interface ITracing {
  traceComplete: Promise<Trace>;
  /** end early, normally records for duration or until buffer full  */
  end(): Promise<void>;
}

export type BrowserOptions = {
  type: string;
} & ResolveOptions & SpawnOptions;

function createSessions<T>(count: number, callback: (sessions: ISession[]) => T | PromiseLike<T>): Promise<T> {
  if (count === 1) {
    return createSession(session => callback([session]));
  } else {
    return createSessions(count - 1, (sessions) => createSession(session => callback([session].concat(sessions))));
  }
}

export class Runner<R> {
  private benchmarks: IBenchmark<any, R>[];

  constructor(benchmarks: IBenchmark<any, R>[]) {
    this.benchmarks = benchmarks;
  }

  async run(iterations: number): Promise<R[]> {
    let benchmarks = this.benchmarks;

    return createSessions(benchmarks.length, async (sessions) => {
      let states = await this.inSequence((benchmark, i) => benchmark.setup(sessions[i]));

      for (let iteration = 0; iteration < iterations; iteration++) {
        states = await this.inSequence((benchmark, i) => benchmark.perform(sessions[i], states[i], iteration));
      }

      return this.inSequence((benchmark, i) => benchmark.finalize(sessions[i], states[i]));
    });
  }

  private async inSequence<T>(callback: (benchmark: IBenchmark<any, R>, i: number) => Promise<T>): Promise<T[]> {
    let benchmarks = this.benchmarks;
    let results = [];

    for (let i = 0; i < benchmarks.length; i++) {
      results.push(await callback(benchmarks[i], i));
    }

    return results;
  }
}

export interface BenchmarkParams {
  name: string;
  browser: BrowserOptions;
}

export interface BenchmarkState<R> {
  apiClient: IAPIClient;
  tab: Tab;
  results: R;
}

export abstract class Benchmark<R> implements IBenchmark<BenchmarkState<R>, R> {
  public name: string;
  private browserOptions: BrowserOptions;

  constructor(params: BenchmarkParams) {
    this.name = params.name;
    this.browserOptions = params.browser;
  }

  protected abstract createResults(meta: BenchmarkMeta): R;
  protected async warm(t: ITab) {};
  protected abstract async performIteration(t: ITab, results: R, index: number): Promise<void>;

  public async run(iterations: number): Promise<R> {
    return new Runner([this]).run(iterations)[0];
  }

  // create session, spawn browser, get port connect to API to get version
  public async setup(session: ISession): Promise<BenchmarkState<R>> {
    let browserOptions = this.browserOptions;
    let browser = await session.spawnBrowser(browserOptions.type, browserOptions);
    let apiClient = await session.createAPIClient("localhost", browser.remoteDebuggingPort);
    let version = await apiClient.version();
    let tabs = await apiClient.listTabs();
    // open a blank tab
    let tab = await apiClient.newTab("about:blank");
    for (let i = 0; i < tabs.length; i++) {
      await apiClient.closeTab(tabs[i].id);
    }

    await delay(1500);

    let browserVersion = version["Browser"];
    let cpus = os.cpus().map((cpu) => cpu.model);
    let results = this.createResults({browserVersion, cpus});
    let state = { apiClient, tab, results };

    await this.withTab(session, state, tab => this.warm(tab));

    return state;
  }

  public async perform(session: ISession, state: BenchmarkState<R>, iteration: number): Promise<BenchmarkState<R>> {
    await this.withTab(session, state, tab => this.performIteration(tab, state.results, iteration));
    return state;
  }

  public async finalize(session: ISession, state: BenchmarkState<R>): Promise<R> {
    return state.results;
  }

  private async withTab<T>(session: ISession, state: BenchmarkState<R>, callback: (TabDSL) => Promise<T>): Promise<T> {
    let apiClient = state.apiClient;
    let tab = state.tab;

    let client = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
    let page = new Page(client);
    await page.enable();
    let res = await page.getResourceTree();
    let frame = res.frameTree.frame;

    let dsl = new TabDSL(tab.id, client, page, frame);

    await dsl.clearBrowserCache();
    await dsl.collectGarbage();

    await apiClient.activateTab(tab.id);

    await delay(500);

    await apiClient.activateTab(tab.id);

    let rtn = await callback(dsl);

    state.tab = await apiClient.newTab("about:blank");

    await apiClient.closeTab(tab.id);

    return rtn;
  }
}

export type NetworkConditions = Network.emulateNetworkConditions_Parameters;

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
  emulation: Emulation;
  network: Network;
  heapProfiler: HeapProfiler;

  constructor(id: string, client: IDebuggingProtocolClient, page: Page, frame: Page.Frame) {
    this.client = client;
    this.page = page;
    this.frame = frame;
    this.tracing = new Tracing(client);
    this.network = new Network(client);
    this.emulation = new Emulation(client);
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
    if (!frame.parentId) {
      this.frame = frame;
      // navigating to "about:blank" a signal to end the current trace
      if (this.currentTrace && frame.url === "about:blank") {
        this.currentTrace.end();
      }
    }
  }

  /** Navigates to the specified url */
  async navigate(url: string, waitForLoad?: boolean): Promise<void> {
    let didLoad;

    if (waitForLoad) {
      didLoad = new Promise(resolve => {
        this.page.frameStoppedLoading = params => {
          if (params.frameId === this.frame.id) {
            this.page.frameStoppedLoading = null;
            resolve();
          }
        };
      });
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

  async addScriptToEvaluateOnLoad(source: string): Promise<Page.ScriptIdentifier> {
    let result = await this.page.addScriptToEvaluateOnLoad({scriptSource: source});
    return result.identifier;
  }

  async removeScriptToEvaluateOnLoad(identifier: Page.ScriptIdentifier): Promise<void> {
    await this.page.removeScriptToEvaluateOnLoad({identifier});
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
    await this.network.enable({maxTotalBufferSize: 0});
    let res = await this.network.canClearBrowserCache();
    if (!res.result) {
      throw new Error("Cannot clear browser cache");
    }
    await this.network.clearBrowserCache();
    // causes MemoryCache entries to be evicted
    await this.network.setCacheDisabled({cacheDisabled: true});
    await this.network.disable();
  }

  async setCPUThrottlingRate(rate: number) {
    await this.emulation.setCPUThrottlingRate({ rate });
  }

  async emulateNetworkConditions(conditions: NetworkConditions) {
    await this.network.emulateNetworkConditions(conditions);
  }

  async disableNetworkEmulation() {
    await this.network.emulateNetworkConditions({
      offline: false,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    });
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
