/* eslint-disable filenames/match-exported */
import { RootConnection, SessionConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';

import Trace from './trace/trace';
export interface ITab {
  isTracing: boolean;

  /** The current frame for the tab */
  frame: Protocol.Page.Frame;
  onNavigate: (() => void) | undefined;
  /** Add a script to execute on load */
  addScriptToEvaluateOnLoad(
    source: string
  ): Promise<Protocol.Page.ScriptIdentifier>;
  /** Remove a previously added script */
  removeScriptToEvaluateOnLoad(
    identifier: Protocol.Page.ScriptIdentifier
  ): Promise<void>;
  /** Navigates to the specified url */
  navigate(url: string, waitForLoad?: boolean): Promise<void>;
  /** Start tracing */
  startTracing(categories: string, options?: string): Promise<ITracing>;

  /** Clear browser cache and memory cache */
  clearBrowserCache(): Promise<void>;
  /** Perform GC */
  collectGarbage(): Promise<void>;

  setCPUThrottlingRate(rate: number): Promise<void>;
  emulateNetworkConditions(
    conditions: Protocol.Network.EmulateNetworkConditionsRequest
  ): Promise<void>;
  disableNetworkEmulation(): Promise<void>;

  /** Configure tab to take on the device emulation settings */
  emulateDevice(
    deviceSettings: Protocol.Emulation.SetDeviceMetricsOverrideRequest
  ): Promise<void>;

  /** Cofigure tabe to send the specified user agent */
  setUserAgent(
    userAgentSettings: Protocol.Emulation.SetUserAgentOverrideRequest
  ): Promise<void>;
}

export interface ITracing {
  traceComplete: Promise<Trace>;
  end(): Promise<void>;
}

class Tab implements ITab {
  public isTracing = false;
  public tracingComplete: Promise<Trace> | undefined;

  /**
   * The current frame for the tab
   */
  public frame: Protocol.Page.Frame;

  /**
   * Called when the frame navigates
   */
  public onNavigate: (() => void) | undefined = undefined;

  public id: string;
  public browser: RootConnection;

  private page: SessionConnection;

  constructor(
    id: string,
    browser: RootConnection,
    page: SessionConnection,
    frame: Protocol.Page.Frame
  ) {
    this.id = id;
    this.browser = browser;
    this.page = page;
    this.frame = frame;

    page.on('Page.frameNavigated', (params) => {
      const newFrame = params.frame;
      if (!newFrame.parentId) {
        this.frame = newFrame;
        if (this.onNavigate) {
          this.onNavigate();
        }
      }
    });
  }

  /**
   * Navigates to the specified url
   */
  public async navigate(
    url: string,
    shouldWaitForLoad?: boolean
  ): Promise<void> {
    const { frame, page } = this;

    await Promise.all([maybeWaitForLoad(), load()]);

    async function maybeWaitForLoad(): Promise<void> {
      if (shouldWaitForLoad) {
        await page.until(
          'Page.frameStoppedLoading',
          ({ frameId }) => frameId === frame.id
        );
      }
    }

    async function load(): Promise<void> {
      if (frame.url === url) {
        await page.send('Page.reload', {});
      } else {
        await page.send('Page.navigate', { url });
      }
    }
  }

  public async addScriptToEvaluateOnLoad(
    scriptSource: string
  ): Promise<Protocol.Page.ScriptIdentifier> {
    const result = await this.page.send('Page.addScriptToEvaluateOnLoad', {
      scriptSource
    });
    return result.identifier;
  }

  public async removeScriptToEvaluateOnLoad(
    identifier: Protocol.Page.ScriptIdentifier
  ): Promise<void> {
    await this.page.send('Page.removeScriptToEvaluateOnLoad', { identifier });
  }

  /** Start tracing */
  public async startTracing(
    categories: string,
    options?: string
  ): Promise<ITracing> {
    if (this.isTracing) {
      throw new Error('already tracing');
    }

    this.isTracing = true;

    const { page } = this;

    const traceComplete = (async () => {
      const trace = new Trace();

      const onDataCollected = ({
        value
      }: Protocol.Tracing.DataCollectedEvent): void => {
        trace.addEvents(value);
      };

      page.on('Tracing.dataCollected', onDataCollected);

      await page.until('Tracing.tracingComplete');

      this.isTracing = false;

      page.removeListener('Tracing.dataCollected', onDataCollected);

      trace.buildModel();

      /*
        Chrome creates a new Renderer with a new PID each time we open a new tab,
        but the old PID and Renderer processes continues to hang around. Checking
        the length of the events array helps us to ensure we find the active tab's
        Renderer process.
      */
      trace.mainProcess = trace.processes
        .filter((p) => p.name === 'Renderer')
        .reduce((c, v) => (v.events.length > c.events.length ? v : c));

      return trace;
    })();

    const end = async (): Promise<void> => {
      if (this.isTracing) {
        await page.send('Tracing.end');
      }
    };

    await page.send('Tracing.start', { categories, options });

    return { end, traceComplete };
  }

  /** Clear browser cache and memory cache */
  public async clearBrowserCache(): Promise<void> {
    const { page } = this;
    await page.send('Network.enable', { maxTotalBufferSize: 0 });
    const res = await page.send('Network.canClearBrowserCache');
    if (!res.result) {
      throw new Error('Cannot clear browser cache');
    }
    await page.send('Network.clearBrowserCache');
    // causes MemoryCache entries to be evicted
    await page.send('Network.setCacheDisabled', { cacheDisabled: true });
    // await page.send('Network.disable');
  }

  public async setCPUThrottlingRate(rate: number): Promise<void> {
    await this.page.send('Emulation.setCPUThrottlingRate', { rate });
  }

  public async emulateNetworkConditions(
    conditions: Protocol.Network.EmulateNetworkConditionsRequest
  ): Promise<void> {
    await this.page.send('Network.enable', {
      maxResourceBufferSize: 0,
      maxTotalBufferSize: 0
    });
    await this.page.send('Network.emulateNetworkConditions', conditions);
  }

  public async disableNetworkEmulation(): Promise<void> {
    await this.page.send('Network.emulateNetworkConditions', {
      downloadThroughput: 0,
      latency: 0,
      offline: false,
      uploadThroughput: 0
    });
    await this.page.send('Network.disable');
  }

  public async collectGarbage(): Promise<void> {
    const { page } = this;
    await page.send('HeapProfiler.enable');
    await page.send('HeapProfiler.collectGarbage');
    await page.send('HeapProfiler.disable');
  }

  public async emulateDevice(
    deviceSettings: Protocol.Emulation.SetDeviceMetricsOverrideRequest
  ): Promise<void> {
    await this.page.send('Emulation.setDeviceMetricsOverride', deviceSettings);
  }

  public async setUserAgent(
    userAgentSettings: Protocol.Emulation.SetUserAgentOverrideRequest
  ): Promise<void> {
    await this.page.send('Emulation.setUserAgentOverride', userAgentSettings);
  }
}

export default function createTab(
  id: string,
  browser: RootConnection,
  tab: SessionConnection,
  frame: Protocol.Page.Frame
): ITab {
  return new Tab(id, browser, tab, frame);
}
