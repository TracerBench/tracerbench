import Trace from "../trace/trace";
import { TraceEvent, TRACE_EVENT_PHASE_ASYNC_BEGIN } from "../trace/trace_event";
import { EventEmitter } from "events";
import * as url from "url";
import { createSession, Session, Tab } from "chrome-debugging-client";
import protocol from "../generated/protocol";
import { default as ProtocolDomains, Page } from "../generated/protocol-domains";

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
      let process = await session.spawn(this.browserType, this.browserResolverOptions);
      let client = session.createAPIClient("localhost", process.remoteDebuggingPort);
      let tabs = await client.listTabs();
      let tab = tabs[0];
      console.log("make active window");
      await client.activateTab(tab.id);
      let debugging = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
      let domains: ProtocolDomains = debugging.domains(protocol);
      let Page = domains.Page;
      let HeapProfiler = domains.HeapProfiler;
      await Page.enable();
      console.log("give the browser a second");
      await delay(1000);
      await this.collectGarbage(domains);

      console.log("starting run...");
      let results: number[] = [];
      for (let i = 0; i < 50; i++) {
        let sample = await this.getSample(domains);
        results.push(sample);
        console.log("sample", sample / 1000, "ms");

        await this.navigateToPage(domains, "about:blank");
        await this.collectGarbage(domains);
      }
      await Page.disable();
      return results;
    });
  }

  async navigateToPage(domains: ProtocolDomains, url: string): Promise<void> {
    let Page = domains.Page;
    let loadEventFired = new Promise(resolve => {
      Page.loadEventFired = () => {
        console.log(url, "loaded");
        Page.loadEventFired = null;
        resolve();
      };
    });
    console.log("navigate to", url);
    await Page.navigate({url});
    await loadEventFired;
  }

  async collectGarbage(domains: ProtocolDomains): Promise<void> {
    let HeapProfiler = domains.HeapProfiler;
    await HeapProfiler.enable();
    console.log("collect garbage");
    await HeapProfiler.collectGarbage();
    await HeapProfiler.disable();
  }

  async getSample(domains: ProtocolDomains): Promise<number> {
    let Tracing = domains.Tracing;
    let Page = domains.Page;

    let trace = new Trace();
    Tracing.dataCollected = (evt) => {
      trace.addEvents(evt.value);
    };

    let tracingComplete = new Promise((resolve) => {
      Tracing.tracingComplete = () => {
        Tracing.tracingComplete = null;
        resolve();
      };
    });

    let loadEventFired = new Promise(resolve => {
      Page.loadEventFired = () => {
        Page.loadEventFired = null;
        resolve();
      };
    });

    await Tracing.start({
      categories: "blink.user_timing,blink.net"
    });

    await Page.navigate({
      url: this.url.href
    });

    await loadEventFired;

    await Tracing.end();

    await tracingComplete;

    Tracing.dataCollected = null;

    let resourceEvent = trace.events.find((event) => {
      return event.ph === TRACE_EVENT_PHASE_ASYNC_BEGIN &&
              event.cat === "blink.net" &&
              event.name === "Resource" &&
              event.args["url"] === this.url.href;
    });

    let process = trace.processMap[resourceEvent.pid];
    let thread = process.threadMap[resourceEvent.tid];
    let navigationStart;
    let firstTextPaint;
    thread.markers.forEach((event) => {
      if (event.name === "navigationStart") {
        navigationStart = event.ts;
      } else if (event.name === "firstTextPaint") {
        firstTextPaint = event.ts;
      }
    });
    return firstTextPaint - navigationStart;
  }
}