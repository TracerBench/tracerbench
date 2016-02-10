import Trace from "../trace/trace";
import { TraceEvent, TRACE_EVENT_PHASE_ASYNC_BEGIN } from "../trace/trace_event";
import { EventEmitter } from "events";
import * as url from "url";
import { createSession, ISession, IDebuggingProtocolClient, Tab } from "chrome-debugging-client";
import { Page, HeapProfiler, Tracing, IO } from "../generated/protocol-domains";

function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export default class ColdStart extends EventEmitter {
  count: number = 0;
  samples: number[] = [];
  url: url.Url;
  browserType: string;
  browserResolverOptions: any;

  constructor(urlStr: string, browserType: string, browserResolverOptions?: any) {
    super();
    this.url = url.parse(urlStr);
    this.browserType = browserType || "canary";
    this.browserResolverOptions = browserResolverOptions || {};
  }

  run(): Promise<number[]> {
    return createSession<number[]>(async (session) => {
      let process = await session.spawnBrowser(this.browserType, this.browserResolverOptions);
      let client = session.createAPIClient("localhost", process.remoteDebuggingPort);
      let tabs = await client.listTabs();
      let tab = tabs[0];
      console.log("make active window");
      await client.activateTab(tab.id);
      let debuggingProtocol = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
      let page = new Page(debuggingProtocol);
      let heapProfiler = new HeapProfiler(debuggingProtocol);
      let tracing = new Tracing(debuggingProtocol);
      let io = new IO(debuggingProtocol);

      await page.enable();
      console.log("give the browser a second");
      await delay(1000);
      await this.collectGarbage(heapProfiler);

      console.log("starting run...");
      let results: number[] = [];
      for (let i = 0; i < 100; i++) {
        let sample = await this.getSample(i, page, tracing, io);
        results.push(sample);
        console.log("sample", sample / 1000, "ms");

        await this.navigateToPage(page, "about:blank");
        await delay(200);
        await this.collectGarbage(heapProfiler);
        await delay(200);
      }
      await page.disable();
      return results;
    });
  }

  async navigateToPage(page: Page, url: string): Promise<string> {
    let loadEventFired = new Promise(resolve => {
      page.loadEventFired = () => {
        console.log(url, "loaded");
        page.loadEventFired = null;
        resolve();
      };
    });
    console.log("navigate to", url);
    let frame = await page.navigate({url});
    await loadEventFired;
    return frame.frameId;
  }

  async collectGarbage(heapProfiler: HeapProfiler): Promise<void> {
    await heapProfiler.enable();
    console.log("collect garbage");
    await heapProfiler.collectGarbage();
    await heapProfiler.disable();
  }

  async getSample(i: number, page: Page, tracing: Tracing, io: IO): Promise<number> {
    let trace = new Trace();
    tracing.dataCollected = (evt) => {
      trace.addEvents(evt.value);
    };

    let tracingComplete = new Promise<Tracing.tracingComplete_Parameters>((resolve) => {
      tracing.tracingComplete = (evt) => {
        tracing.tracingComplete = null;
        resolve(evt);
      };
    });

    let loadEventFired = new Promise(resolve => {
      page.loadEventFired = (evt) => {
        page.loadEventFired = null;
        resolve();
      };
    });

    await tracing.start({
      categories: "blink.user_timing"
    });

    let navRet = await page.navigate({
      url: this.url.href
    });

    await loadEventFired;

    await tracing.end();

    await tracingComplete;
    tracing.dataCollected = null;

    let pid = parseInt(navRet.frameId.split(".")[0], 10);
	  let process = trace.processMap[pid];
    let thread = process.mainThread;
    let domLoading;
    let initialRenderEnd;
    thread.markers.forEach((event) => {
      if (event.name === "domLoading") {
        domLoading = event.ts;
      } else if (event.name === "appDidRender") {
        initialRenderEnd = event.ts;
      }
    });

    return initialRenderEnd - domLoading;
  }
}
