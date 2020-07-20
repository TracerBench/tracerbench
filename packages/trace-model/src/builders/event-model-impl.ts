import {
  Constants,
  TRACE_EVENT_PHASE,
  TraceEvent,
  TraceEventArgs,
  TraceEvents
} from '@tracerbench/trace-event';

import type {
  AsyncBeginEventModel,
  AsyncEndEventModel,
  AsyncStepIntoEventModel,
  AsyncStepPastEventModel,
  BeginEventModel,
  ClockSyncEventModel,
  CompleteEventModel,
  CounterEventModel,
  CreateObjectEventModel,
  DeleteObjectEventModel,
  EndEventModel,
  EnterContextEventModel,
  EventModelCommon,
  EventModelTraceEvents,
  FlowBeginEventModel,
  FlowEndEventModel,
  FlowStepEventModel,
  InstantEventModel,
  LeaveContextEventModel,
  MarkEventModel,
  MemoryDumpEventModel,
  MetadataEventModel,
  NestableAsyncBeginEventModel,
  NestableAsyncEndEventModel,
  NestableAsyncInstantEventModel,
  ProcessId,
  SampleEventModel,
  SnapshotObjectEventModel,
  ThreadId
} from '../types';
import splitCat from '../util/split-cat';

const EMPTY_ARGS = Object.freeze({});

export type EventModelImpls = {
  [TPhase in TRACE_EVENT_PHASE]: EventModelImpl<TPhase>;
};

export type EventModelImplUnion = EventModelImpls[TRACE_EVENT_PHASE];

export type MetadataEventModelImpl = EventModelImpl<MetadataEventModel['ph']>;

export type BeginEventModelImpl = EventModelImpl<BeginEventModel['ph']>;

export type EndEventModelImpl = EventModelImpl<EndEventModel['ph']>;

export type CompleteEventModelImpl = EventModelImpl<CompleteEventModel['ph']>;

export type InstantEventModelImpl = EventModelImpl<InstantEventModel['ph']>;

export type MarkEventModelImpl = EventModelImpl<MarkEventModel['ph']>;

export default class EventModelImpl<
  TPhase extends TRACE_EVENT_PHASE = TRACE_EVENT_PHASE
> implements EventModelCommon<TPhase> {
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
  traceEvent: EventModelTraceEvents[TPhase];
  constructor(traceEvent: EventModelTraceEvents[TPhase], ord: number);
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
    this.traceEvent = traceEvent as EventModelTraceEvents[TPhase];
    this.parent = undefined;
  }

  get duration(): number {
    return this.end - this.start;
  }

  isBegin(): this is BeginEventModelImpl {
    return this.ph === Constants.TRACE_EVENT_PHASE_BEGIN;
  }

  isEnd(): this is EventModelImpl<EndEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_END;
  }

  isComplete(): this is EventModelImpl<CompleteEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_COMPLETE;
  }

  isInstant(): this is EventModelImpl<InstantEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_INSTANT;
  }

  isAsyncBegin(): this is EventModelImpl<AsyncBeginEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN;
  }

  isAsyncStepInto(): this is EventModelImpl<AsyncStepIntoEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO;
  }

  isAsyncStepPast(): this is EventModelImpl<AsyncStepPastEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST;
  }

  isAsyncEnd(): this is EventModelImpl<AsyncEndEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_ASYNC_END;
  }

  isNestableAsyncBegin(): this is EventModelImpl<
    NestableAsyncBeginEventModel['ph']
  > {
    return this.ph === Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN;
  }

  isNestableAsyncEnd(): this is EventModelImpl<
    NestableAsyncEndEventModel['ph']
  > {
    return this.ph === Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END;
  }

  isNestableAsyncInstant(): this is EventModelImpl<
    NestableAsyncInstantEventModel['ph']
  > {
    return this.ph === Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT;
  }

  isFlowBegin(): this is EventModelImpl<FlowBeginEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_FLOW_BEGIN;
  }

  isFlowStep(): this is EventModelImpl<FlowStepEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_FLOW_STEP;
  }

  isFlowEnd(): this is EventModelImpl<FlowEndEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_FLOW_END;
  }

  isMetadata(): this is EventModelImpl<MetadataEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_METADATA;
  }

  isCounter(): this is EventModelImpl<CounterEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_COUNTER;
  }

  isSample(): this is EventModelImpl<SampleEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_SAMPLE;
  }

  isCreateObject(): this is EventModelImpl<CreateObjectEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_CREATE_OBJECT;
  }

  isSnapshotObject(): this is EventModelImpl<SnapshotObjectEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT;
  }

  isDeleteObject(): this is EventModelImpl<DeleteObjectEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_DELETE_OBJECT;
  }

  isMemoryDump(): this is EventModelImpl<MemoryDumpEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_MEMORY_DUMP;
  }

  isMark(): this is EventModelImpl<MarkEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_MARK;
  }

  isClockSync(): this is EventModelImpl<ClockSyncEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_CLOCK_SYNC;
  }

  isEnterContext(): this is EventModelImpl<EnterContextEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT;
  }

  isLeaveContext(): this is EventModelImpl<LeaveContextEventModel['ph']> {
    return this.ph === Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT;
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

  hasCategory(category: string | ((category: string) => boolean)): boolean {
    const cat = this.cat;
    if (typeof category === 'function') {
      return Array.isArray(cat) ? cat.some(category) : category(cat);
    }
    return Array.isArray(cat) ? cat.includes(category) : cat === category;
  }

  toJSON(): TraceEvents[TPhase];
  toJSON(this: EventModelImplUnion): TraceEvent {
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
