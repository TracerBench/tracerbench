import { TraceEventArgs, TraceMetadata } from '@tracerbench/trace-event';
import {
  CompleteEventModel,
  EventModel,
  MarkEventModel,
  TraceModel
} from '@tracerbench/trace-model';

import { Marker } from '../create-trace-navigation-benchmark';

export default function extractNavigationSample(
  trace: TraceModel,
  markers: Marker[]
): NavigationSample {
  const mainRendererThread = trace.findRendererMain();
  if (mainRendererThread === undefined) {
    throw new Error(`missing main renderer thread`);
  }
  const phases = findPhases(mainRendererThread.events, markers);
  const lastPhase = phases[phases.length - 1];
  return {
    metadata: trace.metadata,
    duration: lastPhase.start + lastPhase.duration,
    phases
  };
}

interface NavigationTimingMarkArgs extends TraceEventArgs {
  frame: string;
}

interface UserTimingMarkArgs extends TraceEventArgs {
  data: {
    navigationId: string;
  };
}

interface NavigationStartArgs
  extends NavigationTimingMarkArgs,
    UserTimingMarkArgs {}

function findPhases(events: EventModel[], markers: Marker[]): PhaseSample[] {
  const phaseEvents: MarkEventModel[] = [];
  let eventIdx = 0;
  let navigationStartArgs: NavigationStartArgs | undefined;
  // for each marker scan forward in the events to find it
  for (const marker of markers) {
    let markEvent: MarkEventModel | undefined;
    for (; eventIdx < events.length; eventIdx++) {
      const event = events[eventIdx];
      if (event.isMark()) {
        if (navigationStartArgs === undefined) {
          if (event.name === 'navigationStart') {
            if (event.args === undefined) {
              throw new Error(`navigationStart mark event is missing args`);
            }
            navigationStartArgs = event.args as NavigationStartArgs;
          }
          if (marker.start === 'navigationStart') {
            markEvent = event;
            break;
          }
        } else {
          if (event.name === marker.start) {
            const { args } = event;
            // ensure this belongs to this navigation
            if (isNavigationTimingArgs(args)) {
              // if it is a navigation timing API mark
              // it should match the start frame
              if (args.frame === navigationStartArgs.frame) {
                markEvent = event;
                break;
              }
            } else if (isUserTimingArgs(args)) {
              // if the mark is a user timing mark
              // performance.mark("my mark")
              // it should have a navigationId to match this one
              if (
                args.data.navigationId === navigationStartArgs.data.navigationId
              ) {
                markEvent = event;
                break;
              }
            }
          }
        }
      }
    }
    if (markEvent === undefined) {
      throw new Error(`Could not find mark "${marker.start}" in trace`);
    } else {
      phaseEvents.push(markEvent);
    }
  }
  let paintEvent: CompleteEventModel | undefined;
  for (; eventIdx < events.length; eventIdx++) {
    const event = events[eventIdx];
    if (event.isComplete() && event.name === 'Paint') {
      paintEvent = event;
      break;
    }
  }
  if (!paintEvent) {
    throw new Error(
      `Could not find Paint event in trace after last mark "${
        markers[markers.length - 1].start
      }"`
    );
  }
  const phases: PhaseSample[] = [];
  const start = phaseEvents[0].start;
  for (let i = 0; i < phaseEvents.length; i++) {
    const marker = markers[i];
    const markEvent = phaseEvents[i];
    const end =
      i + 1 < phaseEvents.length ? phaseEvents[i + 1].start : paintEvent.end;
    phases.push({
      phase: marker.label,
      start: markEvent.start - start,
      duration: end - markEvent.start
    });
  }
  return phases;
}

function isNavigationTimingArgs(
  args: TraceEventArgs | undefined
): args is NavigationTimingMarkArgs {
  return args !== undefined && typeof args.frame === 'string';
}

function isUserTimingArgs(
  args: TraceEventArgs | undefined
): args is UserTimingMarkArgs {
  return (
    args !== undefined &&
    typeof args.data === 'object' &&
    args.data !== null &&
    'navigationId' in args.data
  );
}

export interface RuntimeCallStats {
  [group: string]: RuntimeCallStatGroup | undefined;
}

export interface RuntimeCallStatGroup {
  [stat: string]: RuntimeCallStat | undefined;
}

export interface RuntimeCallStat {
  /**
   * count of stat
   */
  count: number;

  /**
   * time in microseconds
   */
  time: number;
}

export interface NavigationSample {
  /**
   * Microseconds from start mark until the start of the first Paint event after the last mark.
   */
  duration: number;

  /**
   * Samples for phases duration the iteration.
   */
  phases: PhaseSample[];

  metadata: TraceMetadata;

  /**
   * Runtime call stats.
   *
   * Present if param.runtimeStats enabled.
   */
  runtimeCallStats?: RuntimeCallStats;
}

export interface PhaseSample {
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
