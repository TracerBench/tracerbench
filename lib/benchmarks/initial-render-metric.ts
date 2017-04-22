import binsearch from "array-binsearch";
import {
  IBenchmarkMeta,
} from "../benchmark";
import Trace from "../trace/trace";
import {
  ITraceEvent,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_INSTANT,
  TRACE_EVENT_PHASE_MARK,
} from "../trace/trace_event";
import traceEventComparator from "../trace/trace_event_comparator";

export interface IMarker {
  /**
   * performance.mark name
   */
  start: string;

  /**
   * Label of phase
   */
  label: string;
}

export interface IGCSample {
  duration: number;
  usedHeapSizeBefore: number;
  usedHeapSizeAfter: number;
}

export interface IRuntimeCallStats {
  [key: string]: {
    count: number[];
    time: number[];
  };
}

export interface IInterationSample {
  /**
   * Time from start mark until the Paint event after the last mark.
   */
  duration: number;

  /**
   * Samples for phases duration the iteration.
   */
  phaseSamples: IPhaseSample[];

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
  gcSamples: IGCSample[];

  /**
   * Runtime call stats.
   *
   * Present if param.runtimeStats enabled.
   */
  runtimeCallStats?: IRuntimeCallStats;

  /**
   * GC Object stats.
   *
   * Present if params.gcStats enabled (though doesn't seem consistently added).
   */
  gcStats?: IGCStat[];
}

export interface IGCStat {
  /**
   * json string of stats object
   */
  live: string;

  /**
   * json string of stats object
   */
  dead: string;
}

export interface IInitialRenderSamples {
  meta: IBenchmarkMeta;
  set: string;
  samples: IInterationSample[];
}

export interface IPhaseSample {
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

export type IncrementalMarkingName = "MajorGC";
export type IncrementalMarkingType = "incremental marking";

export type MarkSweepCompactName = "MajorGC";
export type MarkSweepCompactType = "atomic pause";

export type WeakCallbacksName = "MajorGC";
export type WeakCallbacksType = "weak processing";

export type GCType = "Scavenge" | "MarkSweepCompact" | "IncrementalMarking" | "WeakCallbacks";

export default class InitialRenderMetric {
  private sample: IInterationSample = {
    callFunction: 0,
    compile: 0,
    duration: 0,
    gc: 0,
    gcSamples: [],
    js: 0,
    parseOnBackground: 0,
    phaseSamples: [],
    run: 0,
  };

  private markerEvents: ITraceEvent[];
  private paint: ITraceEvent;
  private min: number = 0;
  private max: number = 0;

  constructor(private markers: IMarker[], private includeGCStats: boolean) {
  }

  public measure(trace: Trace): IInterationSample {
    this.findMarkerEvents(trace.mainProcess.mainThread.events);
    this.addPhaseSamples();
    this.addV8Samples(trace.mainProcess.events);
    if (this.includeGCStats) {
      this.addGCStats(trace.mainProcess.events);
    }
    return this.sample;
  }

  public findMarkerEvents(events: ITraceEvent[]) {
    const markers = this.markers;
    const markerEvents = [];
    let eventIdx = 0;
    for (const marker of markers) {
      for (; eventIdx < events.length; eventIdx++) {
        const event = events[eventIdx];
        if (event.ph === TRACE_EVENT_PHASE_MARK &&
            event.name === marker.start) {
          markerEvents.push(event);
          break;
        }
      }
    }
    let paint: ITraceEvent;
    for (; eventIdx < events.length; eventIdx++) {
      const event = events[eventIdx];
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
    const { markers, markerEvents, paint } = this;
    let cumulative = 0;
    for (let i = 0; i < markerEvents.length - 1; i++) {
      const marker = markers[i];
      const begin = markerEvents[i];
      const end = markerEvents[i + 1];
      const self = end.ts - begin.ts;
      cumulative += self;
      this.sample.phaseSamples.push({
        cumulative,
        phase: marker.label,
        self,
      });
    }
    this.sample.duration = cumulative;
  }

  protected addV8Samples(events: ITraceEvent[]) {
    const startIndex = binsearch(events, this.markerEvents[0], traceEventComparator);
    const endIndex = binsearch(events, this.paint, traceEventComparator);
    for (let i = startIndex; i < endIndex; i++) {
      const event = events[i];
      const { args } = event;
      const runtimeCallStats = args && args["runtime-call-stats"];
      if (runtimeCallStats) {
        this.addRuntimeCallStats(runtimeCallStats);
      }

      if (event.ph === TRACE_EVENT_PHASE_COMPLETE) {
        this.addV8Sample(event);
      }
    }
  }

  protected addV8Sample(event: ITraceEvent) {
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

  protected addRuntimeCallStats(runtimeCallStats: {
    [name: string]: [number, number]; // count, time
  }) {
    const { sample } = this;
    for (const name of Object.keys(runtimeCallStats)) {
      const stat = runtimeCallStats[name];
      let stats = sample.runtimeCallStats;
      if (!stats) {
        stats = sample.runtimeCallStats = {};
      }
      let entry = stats[name];
      if (!entry) {
        entry = stats[name] = { count: [], time: [] };
      }
      const [ count, time ] = stat;
      entry.count.push(count);
      entry.time.push(time);
    }
  }

  protected addGCStats(events: ITraceEvent[]) {
    this.sample.gcStats = [];
    for (const event of events) {
      if (event.ph === TRACE_EVENT_PHASE_INSTANT &&
        event.name === "V8.GC_Objects_Stats") {
        if (typeof event.args !== "string") {
          this.sample.gcStats.push(event.args as IGCStat);
        }
      }
    }
  }

  private measureGC(event: ITraceEvent) {
    this.sample.gc += event.dur;
    if (event.args !== "__stripped__") {
      this.sample.gcSamples.push({
        duration: event.dur,
        usedHeapSizeAfter: event.args.usedHeapSizeAfter,
        usedHeapSizeBefore: event.args.usedHeapSizeBefore,
      });
    }
  }

  private measureParseOnBackground(event: ITraceEvent) {
    this.sample.js += event.dur;
    this.sample.parseOnBackground += event.dur;
  }

  private measureCompile(event: ITraceEvent) {
    this.sample.js += event.dur;
    this.sample.compile += event.dur;
  }

  private measureCallFunction(event: ITraceEvent) {
    this.sample.js += event.dur;
    this.sample.callFunction += event.dur;
  }

  private measureRun(event: ITraceEvent) {
    this.sample.js += event.dur;
    this.sample.run += event.dur;
  }
}
