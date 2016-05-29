import { Benchmark, BenchmarkParams, BenchmarkMeta, ITab } from "../benchmark";
import {
  TraceEvent,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_END,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_INSTANT,
  TRACE_EVENT_PHASE_MARK
} from "../trace/trace_event";
import * as fs from "fs";

export interface DurationSamples {
  meta: BenchmarkMeta;
  headers: string[];
  samples: number[][];
};

export interface Marker {
  /**
   * window.performance.mark
   */
  start: string;
  /**
   * Label of phase
   */
  label: string;
}

export interface InitialRenderBenchmarkParams extends BenchmarkParams {
  /**
   * URL to measure initial render of.
   */
  url: string;
  markers: Marker[];
}

class Request {
  public send = 0;
  public response = 0;
}

function milliseconds(microseconds) {
  return Math.round(microseconds / 1000) | 0;
}

class InitialRenderMetric {
  private start = 0;
  private lastMarkEvent: TraceEvent = undefined;
  private requests = new Map<string, Request>();
  private seenAllMarks = false;
  private timeToPaint = 0;
  private markerIdx = 0;
  private sampleIdx = 0;
  private samples: number[];
  private jsWall = 0;
  private jsCpu = 0;
  private gcStart = 0;
  private gc = 0;
  private minHeap = 0;
  private maxHeap = 0;
  private net = 0;
  private response = 0;
  private receive = 0;
  private done = false;

  constructor(private length: number, private events: TraceEvent[], private markers: Marker[]) {
    this.samples = new Array(length);
  }

  public measure(): number[] {
    let events = this.events;
    for (let i = 0; i < events.length; i++) {
      if (this.done) break;
      let event = events[i];
      switch (event.ph) {
      case TRACE_EVENT_PHASE_MARK:
        if (!this.seenAllMarks) {
          this.measureMark(event);
        }
        break;
      case TRACE_EVENT_PHASE_COMPLETE:
        this.measureComplete(event);
        break;
      case TRACE_EVENT_PHASE_BEGIN:
        this.measureBegin(event);
        break;
      case TRACE_EVENT_PHASE_END:
        this.measureEnd(event);
        break;
      case TRACE_EVENT_PHASE_INSTANT:
        this.measureInstant(event);
        break;
      }
    }
    return this.samples;
  }

  measureInstant(event: TraceEvent) {
    switch (event.name) {
    case "ResourceSendRequest":
      this.measureResourceSend(event);
      break;
    case "ResourceReceiveResponse":
      this.measureResourceRespond(event);
      break;
    case "ResourceFinish":
      this.measureResourceFinish(event);
      break;
    }
  }

  measureResourceSend(event: TraceEvent) {
    let requestId = <string>event.args["requestId"];
    let request = new Request();
    request.send = event.ts;
    this.requests.set(requestId, request);
  }

  measureResourceRespond(event: TraceEvent) {
    let requestId = <string>event.args["requestId"];
    let request = this.requests.get(requestId);
    request.response = event.ts;
  }

  measureResourceFinish(event: TraceEvent) {
    let requestId = <string>event.args["requestId"];
    let request = this.requests.get(requestId);
    this.net += milliseconds(event.ts - request.send);
    this.response += milliseconds(request.response - request.send);
    this.receive += milliseconds(event.ts - request.response);
  }

  measureBegin(event: TraceEvent) {
    switch (event.name) {
    case "MajorGC":
    case "MinorGC":
      this.measureGCBegin(event);
      break;
    }
  }

  measureEnd(event: TraceEvent) {
    let usedHeapSizeAfter;
    switch (event.name) {
    case "MajorGC":
    case "MinorGC":
      this.measureGCEnd(event);
      break;
    }
  }

  measureGCBegin(event: TraceEvent) {
    this.gcStart = event.ts;
    this.maxHeap = Math.max(event.args["usedHeapSizeBefore"], this.maxHeap);
  }

  measureGCEnd(event: TraceEvent) {
    let usedHeapSizeAfter = event.args["usedHeapSizeAfter"];
    if (this.minHeap) {
      this.minHeap = Math.min(usedHeapSizeAfter, this.minHeap);
    } else {
      this.minHeap = usedHeapSizeAfter;
    }
    this.gc += event.ts - this.gcStart;
  }

  measureComplete(event: TraceEvent) {
    switch (event.name) {
    case "EvaluateScript":
    case "FunctionCall":
      this.measureJS(event);
      break;
    case "Paint":
      this.measurePaint(event);
      break;
    }
  }

  measureJS(event: TraceEvent) {
    this.jsWall += event.dur;
    this.jsCpu  += event.tdur;
  }

  measurePaint(event: TraceEvent) {
    if (this.seenAllMarks) {
      let sample = event.ts - this.lastMarkEvent.ts;
      this.samples[this.sampleIdx++] = milliseconds(sample);
      this.samples[this.sampleIdx++] = milliseconds(event.dur);
      this.samples[this.sampleIdx++] = milliseconds(event.ts - this.start);
      this.samples[this.sampleIdx++] = milliseconds(this.jsWall);
      this.samples[this.sampleIdx++] = milliseconds(this.jsCpu);
      this.samples[this.sampleIdx++] = milliseconds(this.gc);
      this.samples[this.sampleIdx++] = this.minHeap;
      this.samples[this.sampleIdx++] = this.maxHeap;
      this.samples[this.sampleIdx++] = this.net;
      this.samples[this.sampleIdx++] = this.response;
      this.samples[this.sampleIdx++] = this.receive;
      this.done = true;
    }
  }

  measureMark(event: TraceEvent) {
    let marker = this.markers[this.markerIdx];
    if (marker.start !== event.name) {
      return;
    }

    if (this.lastMarkEvent) {
      let sample = event.ts - this.lastMarkEvent.ts;
      this.samples[this.sampleIdx++] = milliseconds(sample);
    } else {
      this.start = event.ts;
    }

    this.lastMarkEvent = event;
    if (++this.markerIdx === this.markers.length) {
      this.seenAllMarks = true;
    }
  }
}

export class InitialRenderBenchmark extends Benchmark<InitialRenderBenchmarkParams, DurationSamples> {
  constructor(params: InitialRenderBenchmarkParams) {
    validateParams(params);
    super(params);
  }

  createResults(meta: BenchmarkMeta): DurationSamples {
    let markers = this.params.markers;
    let headers = markers.map(marker => marker.label);
    headers.push("paint", "timeToPaint", "jsWall", "jsCpu", "gc", "minHeap", "maxHeap", "response", "receive", "net");
    console.log(headers.join(","));
    return { meta, headers, samples: [] };
  }

  async performIteration(t: ITab, results: DurationSamples, i: number): Promise<void> {
    let url = this.params.url;
    let markers = this.params.markers;

    let tracing = await t.startTracing("blink.user_timing,devtools.timeline");

    await t.navigate(url);

    let trace = await tracing.traceComplete;

    if (!trace.mainProcess || !trace.mainProcess.mainThread) {
      return;
    }

    let mainThread = trace.mainProcess.mainThread;

    mainThread.events.sort((a, b) => a.ts - b.ts);

    // if (i === 0) {
    //   fs.writeFileSync("/Users/kselden/src/krisselden/chrome-tracing/trace.json", JSON.stringify(mainThread.events, null, 2));
    // }

    let metric = new InitialRenderMetric(results.headers.length, mainThread.events, markers);
    let samples = metric.measure();
    results.samples.push(samples);
    console.log(samples.join(","));
  }
}

function validateParams(params: InitialRenderBenchmarkParams) {
  if (!params.iterations) {
    params.iterations = 30;
  }
  if (!params.markers || params.markers.length === 0) {
    params.markers = [{
      start: "fetchStart",
      label: "render"
    }];
  }
  if (!params.url) {
    throw new Error("url is required");
  }
}
