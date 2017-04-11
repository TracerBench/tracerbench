import { Benchmark, BenchmarkParams, BenchmarkMeta, ITab, NetworkConditions } from "../benchmark";
import {
  TraceEvent,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_END,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_INSTANT,
  TRACE_EVENT_PHASE_MARK
} from "../trace/trace_event";
import * as fs from "fs";

export type PhaseSample = {
  phase: string;
  self: number;
  cumulative: number;
}

export type GCSample = {
  duration: number;
  usedHeapSizeBefore: number;
  usedHeapSizeAfter: number;
}

export type RuntimeCallStats = {
  [key: string]: {
    count: number[];
    time: number[];
  };
};

export type InterationSample = {
  // during an initial render
  duration: number;
  phaseSamples: PhaseSample[];
  js: number;
  compile: number;
  run: number;
  gc: number;
  gcSamples: GCSample[];
  /** if param.runtimeStats enabled */
  runtimeCallStats?: RuntimeCallStats;
  /** if params.gcStats enabled (adds 10% overhead) */
  gcStats?: {
    /** json string of stats object */
    live: string,
    /** json string of stats object */
    dead: string
  }
}

export type InitialRenderSamples = {
  meta: BenchmarkMeta;
  set: string;
  samples: InterationSample[];
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
  gcStats?: boolean;
  runtimeStats?: boolean;
  cpuThrottleRate?: number;
  networkConditions?: NetworkConditions;
}

class InitialRenderMetric {
  private start = 0;
  private markerIdx = 0;
  private lastMarkEvent: TraceEvent = undefined;
  private seenAllMarks = false;
  private done = false;
  private stack: TraceEvent[] = [];
  private sample: InterationSample = {
    duration: 0,
    phaseSamples: [],
    js: 0,
    compile: 0,
    run: 0,
    gc: 0,
    gcSamples: []
  };

  constructor(private events: TraceEvent[], private markers: Marker[]) {
  }

  public measure(): InterationSample {
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
    return this.sample;
  }

  measureInstant(event: TraceEvent) {
    switch (event.name) {
    }
  }

  measureBegin(begin: TraceEvent) {
    this.stack.push(begin);
  }

  measureEnd(end: TraceEvent) {
    let begin = this.stack.pop();

    let args = {};
    Object.keys(begin.args).forEach(key => args[key] = begin.args[key]);
    Object.keys(end.args).forEach(key => args[key] = end.args[key]);

    this.measureComplete({
      "pid": begin.pid,
      "tid": begin.tid,
      "ts": begin.ts,
      "ph": "X",
      "cat": begin.cat,
      "name": begin.name,
      "args": args,
      "dur": end.ts - begin.ts,
      "tdur": end.tts - begin.tts,
      "tts": begin.tts
    });
  }

  measureComplete(event: TraceEvent) {
    let { args } = event;
    let runtimeCallStats = args && args["runtime-call-stats"];
    if (runtimeCallStats) {
      this.addRuntimeCallStats(runtimeCallStats);
    }
    switch (event.name) {
      // js entry points from browser
      // it is parsing and running a script
      // or it is calling a function on an event
      case "v8.compile":
        this.measureCompile(event);
        break;
      case "v8.run":
      case "v8.callFunction":
        this.measureRun(event);
        break;
      case "MajorGC":
      case "MinorGC":
        this.measureGC(event);
        break;
      case "Paint":
        this.measurePaint(event);
        break;
      case "V8.GC_Objects_Stats":
        this.addGCStats(event);
        break;
    }
  }

  addRuntimeCallStats(runtimeCallStats: {
    [name: string]: [number, number] // count, time
  }) {
    let { sample } = this;
    for (let name in runtimeCallStats) {
      let stat = runtimeCallStats[name];
      let entry = sample.runtimeCallStats[name];
      if (!entry) {
        entry = sample.runtimeCallStats[name] = { count: [], time: [] };
      }
      entry.count.push(stat[0]);
      entry.time.push(stat[1]);
    }
  }

  addGCStats(event: TraceEvent) {
    // these are largs strings of json, parse after testing
    this.sample.gcStats = {
      live: event.args["live"],
      dead: event.args["dead"]
    };
  }

  measureGC(event: TraceEvent) {
    this.sample.gc += event.dur;
    this.sample.gcSamples.push({
      duration: event.dur,
      usedHeapSizeBefore: <number>event.args["usedHeapSizeBefore"],
      usedHeapSizeAfter: <number>event.args["usedHeapSizeAfter"]
    });
  }

  measureCompile(event: TraceEvent) {
    this.sample.js += event.dur;
    this.sample.compile += event.dur;
  }

  measureRun(event: TraceEvent) {
    this.sample.js += event.dur;
    this.sample.run += event.dur;
  }

  measurePaint(event: TraceEvent) {
    if (this.seenAllMarks) {
      let marker = this.markers[this.markerIdx - 1];

      this.sample.phaseSamples.push({
        phase: marker.label,
        self: event.ts - this.lastMarkEvent.ts,
        cumulative: event.ts - this.start
      }, {
        phase: "paint",
        self: event.dur,
        cumulative: event.ts - this.start + event.dur
      });
      this.sample.duration = event.ts - this.start + event.dur;
      this.done = true;
    }
  }

  measureMark(event: TraceEvent) {
    let marker = this.markers[this.markerIdx];
    if (marker.start !== event.name) {
      return;
    }

    if (this.lastMarkEvent) {
      let lastMarker = this.markers[this.markerIdx - 1];
      let sample = event.ts - this.lastMarkEvent.ts;
      this.sample.phaseSamples.push({
        phase: lastMarker.label,
        self: event.ts - this.lastMarkEvent.ts,
        cumulative: event.ts - this.start
      });
    } else {
      this.start = event.ts;
    }

    this.lastMarkEvent = event;
    if (++this.markerIdx === this.markers.length) {
      this.seenAllMarks = true;
    }
  }
}

export class InitialRenderBenchmark extends Benchmark<InitialRenderSamples> {
  protected params: InitialRenderBenchmarkParams;

  constructor(params: InitialRenderBenchmarkParams) {
    validateParams(params);
    super(params);
    this.params = params;
  }

  createResults(meta: BenchmarkMeta): InitialRenderSamples {
    return {
      meta: meta,
      set: this.name,
      samples: []
    };
  }

  async performIteration(t: ITab, results: InitialRenderSamples, i: number): Promise<void> {
    let url = this.params.url;
    let markers = this.params.markers;

    let categories = "blink.user_timing,benchmark,toplevel,devtools.timeline,v8,v8.execute";

    if (this.params.gcStats) {
      categories += ",disabled-by-default-v8.gc_stats";
    }

    if (this.params.runtimeStats) {
      categories += ",disabled-by-default-v8.runtime_stats";
    }

    if (this.params.cpuThrottleRate !== undefined) {
      t.setCPUThrottlingRate(this.params.cpuThrottleRate);
    }

    if (this.params.networkConditions !== undefined) {
      t.emulateNetworkConditions(this.params.networkConditions)
    }

    let tracing = await t.startTracing(categories);

    await t.navigate(url);

    let trace = await tracing.traceComplete;

    if (!trace.mainProcess || !trace.mainProcess.mainThread) {
      return;
    }

    if (this.params.cpuThrottleRate !== undefined) {
      t.setCPUThrottlingRate(1);
    }

    if (this.params.networkConditions !== undefined) {
      t.disableNetworkEmulation();
    }

    let mainThread = trace.mainProcess.mainThread;

    mainThread.events.sort((a, b) => a.ts - b.ts);

    // if (i === 0) {
    //   fs.writeFileSync("trace.json", JSON.stringify(mainThread.events, null, 2));
    // }

    let metric = new InitialRenderMetric(mainThread.events, markers);
    let sample = metric.measure();

    // log progress to stderr
    // TODO make some events or logger
    console.error(this.name, sample.duration, "µs");

    results.samples.push(sample);
  }
}

function validateParams(params: InitialRenderBenchmarkParams) {
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
