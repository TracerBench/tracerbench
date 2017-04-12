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
import binsearch from "array-binsearch";
import traceEventComparator from "../trace/trace_event_comparator";
import Trace from "../trace/trace";

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
  gcStats?: Array<{
    /** json string of stats object */
    live: string,
    /** json string of stats object */
    dead: string
  }>;
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
  saveFirstTrace?: string;
}

class InitialRenderMetric {
  private sample: InterationSample = {
    duration: 0,
    phaseSamples: [],
    js: 0,
    compile: 0,
    run: 0,
    gc: 0,
    gcSamples: []
  };

  markerEvents: TraceEvent[];
  paint: TraceEvent;
  min: number = 0;
  max: number = 0;

  constructor(private markers: Marker[], private includeGCStats: boolean) {
  }

  public measure(trace: Trace): InterationSample {
    this.findMarkerEvents(trace.mainProcess.mainThread.events);
    this.addPhaseSamples();
    this.addV8Samples(trace.mainProcess.events);
    if (this.includeGCStats) {
      this.addGCStats(trace.mainProcess.events);
    }
    return this.sample;
  }

  public findMarkerEvents(events: TraceEvent[]) {
    let markers = this.markers;
    let markerEvents = [];
    let eventIdx = 0;
    for (let markerIdx = 0; markerIdx < markers.length; markerIdx++) {
      let marker = markers[markerIdx];
      for (; eventIdx < events.length; eventIdx++) {
        let event = events[eventIdx];
        if (event.ph === TRACE_EVENT_PHASE_MARK &&
            event.name === marker.start) {
          markerEvents.push(event);
          break;
        }
      }
    }
    let paint: TraceEvent;
    for (; eventIdx < events.length; eventIdx++) {
      let event = events[eventIdx];
      if (event.ph === TRACE_EVENT_PHASE_COMPLETE &&
          event.name === "Paint") {
        markerEvents.push(event);
        paint = event;
        break;
      }
    }
    this.markerEvents = markerEvents;
    this.paint = paint;
    this.min = markerEvents[0].ts;
    this.max = paint.ts;
  }

  public addPhaseSamples() {
    let { markers, markerEvents, paint } = this;

    let cumulative = 0;
    for (let i = 0; i < markerEvents.length - 1; i++) {
      let marker = markers[i];
      let begin = markerEvents[i];
      let end = markerEvents[i + 1];
      let dur = end.ts - begin.ts;
      cumulative += dur;
      this.sample.phaseSamples.push({
        phase: marker.label,
        self: dur,
        cumulative: cumulative
      });
    }
    this.sample.duration = cumulative;
  }

  addV8Samples(events: TraceEvent[]) {
    let startIndex = binsearch(events, this.markerEvents[0], traceEventComparator);
    let endIndex = binsearch(events, this.paint, traceEventComparator);
    for (let i = startIndex; i < endIndex; i++) {
      let event = events[i];

      let { args } = event;
      let runtimeCallStats = args && args["runtime-call-stats"];
      if (runtimeCallStats) {
        this.addRuntimeCallStats(runtimeCallStats);
      }

      if (event.ph === TRACE_EVENT_PHASE_COMPLETE) {
        this.addV8Sample(event);
      }
    }
  }

  addV8Sample(event: TraceEvent) {
    switch (event.name) {
      // js entry points from browser
      // it is parsing and running a script
      // or it is calling a function on an event
      case "v8.compile":
      case "v8.parseOnBackground":
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
    }
  }

  addRuntimeCallStats(runtimeCallStats: {
    [name: string]: [number, number] // count, time
  }) {
    let { sample } = this;
    for (let name in runtimeCallStats) {
      let stat = runtimeCallStats[name];
      let stats = sample.runtimeCallStats;
      if (!stats) {
        stats = sample.runtimeCallStats = {};
      }
      let entry = stats[name];
      if (!entry) {
        entry = stats[name] = { count: [], time: [] };
      }
      entry.count.push(stat[0]);
      entry.time.push(stat[1]);
    }
  }

  addGCStats(events: TraceEvent[]) {
    this.sample.gcStats = [];
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      if (event.ph === TRACE_EVENT_PHASE_INSTANT &&
        event.name === "V8.GC_Objects_Stats") {
        this.sample.gcStats.push({
          live: event.args["live"],
          dead: event.args["dead"]
        });
      }
    }
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
      console.warn("unable to find main process")
      return;
    }

    if (this.params.cpuThrottleRate !== undefined) {
      t.setCPUThrottlingRate(1);
    }

    if (this.params.networkConditions !== undefined) {
      t.disableNetworkEmulation();
    }

    if (i === 0 && this.params.saveFirstTrace) {
      fs.writeFileSync(this.params.saveFirstTrace, JSON.stringify(trace.events, null, 2));
    }

    let metric = new InitialRenderMetric(markers, this.params.gcStats);
    let sample = metric.measure(trace);

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
