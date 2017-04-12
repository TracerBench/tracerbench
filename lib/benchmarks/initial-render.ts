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
  /**
   * Name of phase as defined by the label property of the marker config.
   */
  phase: string;

  /**
   * The self time of the phase.
   */
  self: number;

  /**
   * The time of this phase and prior phases.
   */
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
  /**
   * Time from start mark until the Paint event after the last mark.
   */
  duration: number;

  /**
   * Samples for phases duration the iteration.
   */
  phaseSamples: PhaseSample[];

  /**
   * Total duration of callFunction, run, parseOnBackground,
   * and compile trace events.
   */
  js: number;

  /**
   * Total for v8.compile trace events.
   */
  compile: number;

  /**
   * Total for v8.callFunction trace events.
   */
  callFunction: number;

  /**
   * Total for v8.run trace events.
   */
  run: number;

  /**
   * Total for v8.parseOnBackground trace events.
   */
  parseOnBackground: number;

  /**
   * Time spent in GC (overlaps JS time).
   */
  gc: number;

  /**
   * Samples of MinorGC/MajorGC during trace.
   */
  gcSamples: GCSample[];

  /**
   * Runtime call stats.
   *
   * Present if param.runtimeStats enabled.
   */
  runtimeCallStats?: RuntimeCallStats;

  /**
   * GC Object stats.
   *
   * Present if params.gcStats enabled (though doesn't seem consistently added).
   */
  gcStats?: Array<{
    /**
     * json string of stats object
     */
    live: string,

    /**
     * json string of stats object
     */
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
   * performance.mark name
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

  /**
   * Performance marks to divide up phases.
   *
   * The last mark until paint will define the duration sample.
   */
  markers: Marker[];

  /**
   * Collect GC stats (experimental). Does not seem to get consistently output
   * in each trace.
   */
  gcStats?: boolean;

  /**
   * Collect runtime call stats.
   *
   * This is a disabled-by-default tracing category so may add some overhead
   * to result.
   */
  runtimeStats?: boolean;

  /**
   * Trace while throttling CPU.
   */
  cpuThrottleRate?: number;

  /**
   * Trace while emulating network conditions.
   */
  networkConditions?: NetworkConditions;

  /**
   * Save trace for first iteration.
   *
   * Useful for double checking you are measuring what you think you are
   * measuring.
   */
  saveFirstTrace?: string;

  /**
   * Save trace for each iteration, useful for debugging outliers in data.
   */
  saveTraces?: (iteration: number) => string;
}

class InitialRenderMetric {
  private sample: InterationSample = {
    duration: 0,
    phaseSamples: [],
    js: 0,
    parseOnBackground: 0,
    compile: 0,
    callFunction: 0,
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
        this.measureCompile(event);
        break;
      case "v8.parseOnBackground":
        this.measureParseOnBackground(event);
        break;
      case "v8.run":
        this.measureRun(event);
        break;
      case "v8.callFunction":
        this.measureCallFunction(event);
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

  measureParseOnBackground(event: TraceEvent) {
    this.sample.js += event.dur;
    this.sample.parseOnBackground += event.dur;
  }

  measureCompile(event: TraceEvent) {
    this.sample.js += event.dur;
    this.sample.compile += event.dur;
  }

  measureCallFunction(event: TraceEvent) {
    this.sample.js += event.dur;
    this.sample.callFunction += event.dur;
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

    if (this.params.saveTraces) {
      fs.writeFileSync(this.params.saveTraces(i), JSON.stringify(trace.events, null, 2));
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
