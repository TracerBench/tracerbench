import {
  Constants,
  TRACE_EVENT_PHASE,
  TraceEvent,
  TraceEventArgs,
  TraceEvents
} from '@tracerbench/trace-event';

import type {
  BeginEventModel,
  CompleteEventModel,
  EndEventModel,
  EventModelCommon,
  EventModels,
  InstantEventModel,
  MarkEventModel,
  MetadataEventModel,
  ProcessId,
  ThreadId
} from '../types';
import splitCat from '../util/split-cat';

const EMPTY_ARGS = Object.freeze({});

export type EventModelImpls = {
  [TPhase in TRACE_EVENT_PHASE]: EventModelImpl<TPhase>;
};

export type CastableEventModelImpl = EventModelImpls[TRACE_EVENT_PHASE];

export type MetadataEventModelImpl = EventModelImpl<MetadataEventModel['ph']>;

export type BeginEventModelImpl = EventModelImpl<BeginEventModel['ph']>;

export type EndEventModelImpl = EventModelImpl<EndEventModel['ph']>;

export type CompleteEventModelImpl = EventModelImpl<CompleteEventModel['ph']>;

export type InstantEventModelImpl = EventModelImpl<InstantEventModel['ph']>;

export type MarkEventModelImpl = EventModelImpl<MarkEventModel['ph']>;

export default class EventModelImpl<
  TPhase extends TRACE_EVENT_PHASE = TRACE_EVENT_PHASE
> implements EventModelCommon<TPhase, EventModels[TPhase]['traceEvent']> {
  ord: number;
  pid: ProcessId;
  tid: ThreadId;
  ph: TPhase;
  cat: string | string[];
  name: string;
  start: number;
  end: number;
  args: TraceEventArgs;
  parent: CompleteEventModel | undefined;
  traceEvent: EventModels[TPhase]['traceEvent'];
  constructor(traceEvent: EventModels[TPhase]['traceEvent'], ord: number);
  constructor(traceEvent: TraceEvent, ord: number) {
    const { args, ts: start } = traceEvent;
    this.ord = ord;
    this.pid = traceEvent.pid as ProcessId;
    this.tid = traceEvent.tid as ThreadId;
    this.ph = traceEvent.ph as TPhase;
    this.cat = splitCat(traceEvent.cat);
    this.name = traceEvent.name;
    this.start = start;
    this.end =
      traceEvent.ph === Constants.TRACE_EVENT_PHASE_COMPLETE
        ? start + traceEvent.dur
        : start;
    this.args = args === Constants.STRIPPED ? EMPTY_ARGS : args;
    this.traceEvent = traceEvent;
    this.parent = undefined;
  }

  get duration(): number {
    return this.end - this.start;
  }

  isMetadata(): this is MetadataEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_METADATA;
  }

  isBegin(): this is BeginEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_BEGIN;
  }

  isEnd(): this is EndEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_END;
  }

  isComplete(): this is CompleteEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_COMPLETE;
  }

  isInstant(): this is InstantEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_INSTANT;
  }

  isMark(): this is MarkEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_MARK;
  }

  getArg(name: string): unknown {
    const value = this.args[name];
    if (value === Constants.STRIPPED) return;
    return value;
  }

  getStringArg(name: string, defaultValue: string): string;
  getStringArg(name: string, defaultValue?: undefined): string | undefined;
  getStringArg(name: string, defaultValue?: string): string | undefined {
    const value = this.getArg(name);
    if (typeof value === 'string') {
      return value;
    } else {
      return defaultValue;
    }
  }

  getNumberArg(name: string, defaultValue: number): number;
  getNumberArg(name: string, defaultValue?: undefined): number | undefined;
  getNumberArg(name: string, defaultValue?: number): number | undefined {
    const value = this.getArg(name);
    if (typeof value === 'number') {
      return value;
    } else {
      return defaultValue;
    }
  }

  hasCategory(category: string): boolean {
    const cat = this.cat;
    return Array.isArray(cat) ? cat.indexOf(category) !== -1 : cat === category;
  }

  toJSON(): TraceEvents[TPhase];
  toJSON(this: CastableEventModelImpl): TraceEvent {
    const { traceEvent } = this;
    if (Array.isArray(traceEvent)) {
      const [beginEvent, endEvent] = traceEvent;
      return {
        ...endEvent,
        ...beginEvent,
        ph: Constants.TRACE_EVENT_PHASE_COMPLETE,
        dur: endEvent.ts - beginEvent.ts,
        tdur:
          endEvent.tts === undefined || beginEvent.tts === undefined
            ? undefined
            : endEvent.tts - beginEvent.tts,
        tidelta:
          endEvent.ticount === undefined || beginEvent.ticount === undefined
            ? undefined
            : endEvent.ticount - beginEvent.ticount,
        args: this.args
      };
    } else {
      return traceEvent;
    }
  }
}
