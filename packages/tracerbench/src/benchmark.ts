import {
  Chrome,
  ChromeWithPipeConnection,
  RootConnection,
  SessionConnection,
  spawnChrome,
  SpawnOptions
} from 'chrome-debugging-client';
import * as os from 'os';
import { sleep } from 'race-cancellation';

import { IBenchmark, Runner } from './runner';
import createTab, { ITab } from './tab';

export interface IBenchmarkMeta {
  browserVersion: string;
  cpus: string[];
}

export interface IBenchmarkState<R> {
  process: Chrome;
  browser: RootConnection;
  tab: SessionConnection;
  results: R;
}

export interface IBenchmarkParams {
  name: string;
  browser?: Partial<SpawnOptions>;
  /**
   * Delay between samples.
   */
  delay?: number;
}

export abstract class Benchmark<R>
  implements IBenchmark<IBenchmarkState<R>, R> {
  public name: string;
  private browserOptions?: Partial<SpawnOptions>;
  private delay: number;
  private process: ChromeWithPipeConnection | undefined;

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
  public async setup(): Promise<IBenchmarkState<R>> {
    const browserOptions = this.browserOptions;
    const process = (this.process = spawnChrome(browserOptions));
    const browser = process.connection;

    const { targetId } = await browser.send('Target.createTarget', {
      url: 'about:blank'
    });

    const tab = await browser.attachToTarget(targetId);

    if (!tab) {
      throw Error('failed to attach to target');
    }

    // close other page targets
    const { targetInfos } = await browser.send('Target.getTargets');
    for (const targetInfo of targetInfos) {
      if (targetInfo.type === 'page' && targetInfo.targetId !== targetId) {
        await browser.send('Target.closeTarget', {
          targetId: targetInfo.targetId
        });
      }
    }

    await sleep(1500, tab.raceDetached);

    const browserMeta = await browser.send('Browser.getVersion');
    const browserProduct = browserMeta.product;
    const cpus = os.cpus().map((cpu) => cpu.model);
    const results = this.createResults({
      browserVersion: browserProduct,
      cpus
    });
    const state = { process, browser, tab, results };

    await this.withTab(state, (t) => this.warm(t));

    return state;
  }

  public async perform(
    state: IBenchmarkState<R>,
    iteration: number
  ): Promise<IBenchmarkState<R>> {
    await this.withTab(state, (tab) =>
      this.performIteration(tab, state.results, iteration)
    );
    return state;
  }

  public async finalize(state: IBenchmarkState<R>): Promise<R> {
    const { process: chrome, browser, results } = state;
    if (!chrome.hasExited) {
      await browser.send('Browser.close');
      await chrome.waitForExit();
    }
    return results;
  }

  public async dispose(): Promise<void> {
    const process = this.process;
    if (process !== undefined) {
      await process.dispose();
    }
  }

  protected abstract createResults(meta: IBenchmarkMeta): R;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async warm(_: ITab): Promise<void> {
    // noop
  }

  protected abstract async performIteration(
    t: ITab,
    results: R,
    index: number
  ): Promise<void>;

  private async withTab<T>(
    state: IBenchmarkState<R>,
    callback: (tab: ITab) => Promise<T>
  ): Promise<T> {
    const browser = state.browser;
    const tab = state.tab;
    await tab.send('Page.enable');
    const res = await tab.send('Page.getResourceTree');
    const frame = res.frameTree.frame;

    const dsl = createTab(tab.targetId, browser, tab, frame);

    await dsl.clearBrowserCache();
    await dsl.collectGarbage();

    await browser.send('Target.activateTarget', { targetId: tab.targetId });

    await sleep(this.delay, tab.raceDetached);

    await browser.send('Target.activateTarget', { targetId: tab.targetId });

    const rtn = await callback(dsl);

    state.tab = await browser.attachToTarget(
      await browser.send('Target.createTarget', { url: 'about:blank' })
    );

    await browser.send('Target.closeTarget', { targetId: tab.targetId });

    return rtn;
  }
}
