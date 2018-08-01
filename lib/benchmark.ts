import {
  IAPIClient,
  IResolveOptions,
  ISession,
  ISpawnOptions,
  ITabResponse
} from "chrome-debugging-client";
import { Page } from "chrome-debugging-client/dist/protocol/tot";
import * as os from "os";
import { IBenchmark, Runner } from "./runner";
import createTab, { ITab } from "./tab";

export interface IBenchmarkMeta {
  browserVersion: string;
  cpus: string[];
}

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export interface IBenchmarkState<R> {
  apiClient: IAPIClient;
  tab: ITabResponse;
  results: R;
}

export type BrowserOptions = IResolveOptions & ISpawnOptions;

export interface IBenchmarkParams {
  name: string;
  browser: BrowserOptions;
  /**
   * Delay between samples.
   */
  delay?: number;
}

export abstract class Benchmark<R>
  implements IBenchmark<IBenchmarkState<R>, R> {
  public name: string;
  private browserOptions: BrowserOptions;
  private delay: number;

  constructor(params: IBenchmarkParams) {
    this.name = params.name;
    this.browserOptions = params.browser;
    this.delay = params.delay === undefined ? 800 : params.delay;
  }

  public async run(iterations: number): Promise<R> {
    const benchmarks = [this];
    const runner = new Runner(benchmarks);
    const result = await runner.run(iterations);
    return result[0];
  }

  // create session, spawn browser, get port connect to API to get version
  public async setup(session: ISession): Promise<IBenchmarkState<R>> {
    const browserOptions = this.browserOptions;
    const browser = await session.spawnBrowser(browserOptions);
    const apiClient = await session.createAPIClient(
      "127.0.0.1",
      browser.remoteDebuggingPort
    );
    const version = await apiClient.version();
    const existingTabs = await apiClient.listTabs();
    // open a blank tab
    const tab = await apiClient.newTab("about:blank");
    for (const existingTab of existingTabs) {
      await apiClient.closeTab(existingTab.id);
    }

    await delay(1500);

    const browserVersion = version.Browser;
    const cpus = os.cpus().map(cpu => cpu.model);
    const results = this.createResults({ browserVersion, cpus });
    const state = { apiClient, tab, results };

    await this.withTab(session, state, t => this.warm(t));

    return state;
  }

  public async perform(
    session: ISession,
    state: IBenchmarkState<R>,
    iteration: number
  ): Promise<IBenchmarkState<R>> {
    await this.withTab(session, state, tab =>
      this.performIteration(tab, state.results, iteration)
    );
    return state;
  }

  public async finalize(_: ISession, state: IBenchmarkState<R>): Promise<R> {
    return state.results;
  }

  protected abstract createResults(meta: IBenchmarkMeta): R;

  protected async warm(_: ITab) {
    // noop
  }

  protected abstract async performIteration(
    t: ITab,
    results: R,
    index: number
  ): Promise<void>;

  private async withTab<T>(
    session: ISession,
    state: IBenchmarkState<R>,
    callback: (tab: ITab) => Promise<T>
  ): Promise<T> {
    const apiClient = state.apiClient;
    const tab = state.tab;

    if (!tab.webSocketDebuggerUrl) {
      throw new Error("tab is missing a web socket url");
    }

    const client = await session.openDebuggingProtocol(
      tab.webSocketDebuggerUrl
    );
    const page = new Page(client);
    await page.enable();
    const res = await page.getResourceTree();
    const frame = res.frameTree.frame;

    const dsl = createTab(tab.id, client, page, frame);

    await dsl.clearBrowserCache();
    await dsl.collectGarbage();

    await apiClient.activateTab(tab.id);

    await delay(this.delay);

    await apiClient.activateTab(tab.id);

    const rtn = await callback(dsl);

    state.tab = await apiClient.newTab("about:blank");

    await client.dispose();

    await apiClient.closeTab(tab.id);

    return rtn;
  }
}
