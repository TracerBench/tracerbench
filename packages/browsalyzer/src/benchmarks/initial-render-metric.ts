import { IBenchmarkMeta } from "../benchmark";
import Trace from "../trace/trace";
import {
  ITraceEvent,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_INSTANT,
  TRACE_EVENT_PHASE_MARK
} from "../trace/trace_event";
import { runtimeCallStatGroup } from "../util";

// going to count blink_gc time as js time since it is wrappers
// that support js like dom nodes.
const IS_V8_CAT = /(?:^|,)(?:disabled-by-default-)?v8(?:[,.]|$)/;
const IS_BLINK_GC_CAT = /(?:^|,)(?:disabled-by-default-)?blink_gc(?:[,.]|$)/;

// disable sort keys because I want samples to have a different order.
/* tslint:disable:object-literal-sort-keys */

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

export type V8GCKind = "MinorGC" | "MajorGC";

export type V8GCType =
  | "scavenge"
  | "incremental marking"
  | "atomic pause"
  | "weak processing";

export interface IV8GCSample {
  kind: V8GCKind;
  type: V8GCType;
  start: number;
  duration: number;
  usedHeapSizeBefore: number;
  usedHeapSizeAfter: number;
}

export interface IBlinkGCSample {
  start: number;
  duration: number;
}

export interface IRuntimeCallStats {
  [group: string]: IRuntimeCallStatGroup | undefined;
}

export interface IRuntimeCallStatGroup {
  [stat: string]: IRuntimeCallStat | undefined;
}

export interface IRuntimeCallStat {
  /**
   * count of stat
   */
  count: number;

  /**
   * time in microseconds
   */
  time: number;
}

export interface IIterationSample {
  /**
   * Microseconds from start mark until the start of the first Paint event after the last mark.
   */
  duration: number;

  /**
   * Non overlapping microseconds spent in a V8 event or blink_gc during
   * the duration period.
   */
  js: number;

  /**
   * Samples for phases duration the iteration.
   */
  phases: IPhaseSample[];

  /**
   * Samples of V8 GC during trace.
   */
  gc: IV8GCSample[];

  /**
   * Samples of Blink GC during trace.
   */
  blinkGC: IBlinkGCSample[];

  /**
   * Runtime call stats.
   *
   * Present if param.runtimeStats enabled.
   */
  runtimeCallStats?: IRuntimeCallStats;
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
  samples: IIterationSample[];
}

export interface IPhaseSample {
  /**
   * Name of phase as defined by the label property of the marker config.
   */
  phase: string;

  /**
   * The start of the phase.
   */
  start: number;

  /**
   * The duration in microseconds of the phase.
   */
  duration: number;
}

export default class InitialRenderMetric {
  protected phaseEvents: ITraceEvent[] = [];
  protected firstEvent: ITraceEvent | undefined = undefined;
  protected paintEvent: ITraceEvent | undefined = undefined;
  protected lastEnd: number = 0;
  protected start: number = 0;
  protected end: number = 0;

  protected duration: number = 0;
  protected js: number = 0;
  protected phases: IPhaseSample[] = [];
  protected gc: IV8GCSample[] = [];
  protected blinkGC: IBlinkGCSample[] = [];
  protected runtimeCallStats: IRuntimeCallStats | undefined = undefined;

  constructor(
    private markers: IMarker[],
    params: {
      runtimeStats?: boolean;
    }
  ) {
    if (params.runtimeStats) {
      this.runtimeCallStats = {};
    }
  }

  public measure(trace: Trace): IIterationSample {
    const { mainProcess } = trace;
    if (!mainProcess) {
      throw new Error("unable to determine main process for trace");
    }
    const { mainThread } = mainProcess;
    if (!mainThread) {
      throw new Error("unable to determine main thread for process");
    }
    this.findMarkerEvents(mainThread.events);
    this.addPhaseSamples();
    this.addV8Samples(mainProcess.events);
    return {
      duration: this.duration,
      js: this.js,
      phases: this.phases,
      gc: this.gc,
      blinkGC: this.blinkGC,
      runtimeCallStats: this.runtimeCallStats
    };
  }

  public findMarkerEvents(events: ITraceEvent[]) {
    const markers = this.markers;
    const phaseEvents: ITraceEvent[] = [];
    let eventIdx = 0;
    for (const marker of markers) {
      let markEvent: ITraceEvent | undefined;
      for (; eventIdx < events.length; eventIdx++) {
        const event = events[eventIdx];
        if (
          event.ph === TRACE_EVENT_PHASE_MARK &&
          event.name === marker.start
        ) {
          markEvent = event;
          break;
        }
      }
      if (markEvent === undefined) {
        throw new Error(`Could not find mark "${marker.start}" in trace`);
      } else {
        phaseEvents.push(markEvent);
      }
    }
    const firstEvent = phaseEvents[0];
    let paintEvent: ITraceEvent | undefined;
    for (; eventIdx < events.length; eventIdx++) {
      const event = events[eventIdx];
      if (event.ph === TRACE_EVENT_PHASE_COMPLETE && event.name === "Paint") {
        paintEvent = event;
        break;
      }
    }
    if (!paintEvent) {
      throw new Error(`Could not find Paint after last mark`);
    }
    phaseEvents.push(paintEvent);
    this.firstEvent = phaseEvents[0];
    this.phaseEvents = phaseEvents;
    this.paintEvent = paintEvent;
    this.start = firstEvent.ts;
    this.end = paintEvent.ts;
    this.duration = paintEvent.ts - firstEvent.ts;
  }

  public addPhaseSamples() {
    const { markers, phaseEvents, start } = this;
    for (let i = 0; i < phaseEvents.length - 1; i++) {
      const marker = markers[i];
      const beginEvent = phaseEvents[i];
      const endEvent = phaseEvents[i + 1];
      this.phases.push({
        phase: marker.label,
        start: beginEvent.ts - start,
        duration: endEvent.ts - beginEvent.ts
      });
    }
  }

  protected addV8Samples(events: ITraceEvent[]) {
    const { start, end } = this;
    this.lastEnd = start;
    for (const event of events) {
      const { ts, dur } = event;
      const eventStart = ts;
      const eventEnd = ts + (dur === undefined ? 0 : dur);
      if (start > eventEnd) {
        continue;
      }
      if (eventStart >= end) {
        break;
      }

      if (isV8(event)) {
        this.addV8Sample(event);
      } else if (isBlinkGC(event)) {
        this.addBlinkGC(event);
      }
    }
  }

  protected addV8Sample(event: IV8Event) {
    this.addRuntimeCallStats(event);
    this.addGCSample(event);
    this.addJSTime(event);
  }

  protected addJSTime(event: IBlinkGCEvent | IV8Event) {
    // js sample is all v8 or blink gc events with duration
    // during the duration sample period (clipped if overlap)
    // on any thread for the process (main, web workers, service worker)
    // the idea is to give an idea of the portion of the duration sample
    // that is js related
    if (!isCompleteEvent(event)) {
      return;
    }

    const { lastEnd } = this;
    const { ts, dur } = event;

    // start is event start or the last end of js time
    const start = Math.max(ts, lastEnd);
    // end is event end or the end of our sample duration
    const end = Math.min(ts + dur, this.end);

    if (start < end) {
      this.js += end - start;
      this.lastEnd = end;
    }
  }

  protected addRuntimeCallStats(event: IV8Event) {
    const { runtimeCallStats } = this;
    if (!runtimeCallStats) {
      return;
    }
    const { args } = event;
    if (!isRuntimeCallStatsArgs(args)) {
      return;
    }
    const runtimeCallStatsArg = args["runtime-call-stats"];
    for (const name of Object.keys(runtimeCallStatsArg)) {
      const [count, time] = runtimeCallStatsArg[name];
      const group = runtimeCallStatGroup(name);
      let statGroup = runtimeCallStats[group];
      if (statGroup === undefined) {
        statGroup = runtimeCallStats[group] = {};
      }
      const stat = statGroup[name];
      if (stat === undefined) {
        statGroup[name] = { count, time };
      } else {
        stat.count += count;
        stat.time += time;
      }
    }
  }

  protected addGCSample(event: IV8Event) {
    const { start } = this;
    if (
      (event.ph !== TRACE_EVENT_PHASE_INSTANT &&
        event.name !== "MinorGC" &&
        event.name !== "MajorGC") ||
      event.args === "__stripped__"
    ) {
      return;
    }
    this.gc.push({
      kind: event.name as V8GCKind,
      type:
        event.name === "MinorGC" ? "scavenge" : (event.args.type as V8GCType),
      start: event.ts - start,
      duration: event.dur as number,
      usedHeapSizeAfter: event.args.usedHeapSizeAfter as number,
      usedHeapSizeBefore: event.args.usedHeapSizeBefore as number
    });
  }

  protected addBlinkGC(event: IBlinkGCEvent) {
    this.addJSTime(event);
    if (isCompleteEvent(event)) {
      this.blinkGC.push({
        start: event.ts - this.start,
        duration: event.dur
      });
    }
  }
}

function isRuntimeCallStatsArgs(
  args: ITraceEvent["args"]
): args is IRuntimeCallStatsArgs {
  if (args === "__stripped__") {
    return false;
  }
  const runtimeCallStats = args["runtime-call-stats"];
  return typeof runtimeCallStats === "object" && runtimeCallStats !== null;
}

interface IRuntimeCallStatsArgs {
  "runtime-call-stats": {
    [name: string]: [number, number];
  };
}

function isCompleteEvent(event: IBlinkGCEvent): event is IBlinkGCCompleteEvent;
function isCompleteEvent(event: IV8Event): event is IV8CompleteEvent;
function isCompleteEvent(
  event: IV8Event | IBlinkGCEvent
): event is IBlinkGCCompleteEvent | IV8CompleteEvent;
function isCompleteEvent(
  event: IV8Event | IBlinkGCEvent
): event is IBlinkGCCompleteEvent | IV8CompleteEvent {
  return event.ph === TRACE_EVENT_PHASE_COMPLETE;
}

export interface IV8Event extends ITraceEvent {
  cat: "v8";
}

export interface IV8CompleteEvent extends IV8Event {
  ph: TRACE_EVENT_PHASE_COMPLETE;
  dur: number;
}

export interface IBlinkGCEvent extends ITraceEvent {
  cat: "blink_gc";
}

export interface IBlinkGCCompleteEvent extends IBlinkGCEvent {
  ph: TRACE_EVENT_PHASE_COMPLETE;
  dur: number;
}

function isV8(event: ITraceEvent): event is IV8Event {
  return IS_V8_CAT.test(event.cat);
}

function isBlinkGC(event: ITraceEvent): event is IBlinkGCEvent {
  return IS_BLINK_GC_CAT.test(event.cat);
}
