import type {
  AsyncBeginTraceEvent,
  AsyncEndTraceEvent,
  AsyncStepIntoTraceEvent,
  AsyncStepPastTraceEvent,
  BeginTraceEvent,
  ClockSyncTraceEvent,
  CompleteTraceEvent,
  Constants,
  CounterTraceEvent,
  CreateObjectTraceEvent,
  DeleteObjectTraceEvent,
  EndTraceEvent,
  EnterContextTraceEvent,
  FlowBeginTraceEvent,
  FlowEndTraceEvent,
  FlowStepTraceEvent,
  InstantTraceEvent,
  LeaveContextTraceEvent,
  MarkTraceEvent,
  MemoryDumpTraceEvent,
  MetadataTraceEvent,
  NestableAsyncBeginTraceEvent,
  NestableAsyncEndTraceEvent,
  NestableAsyncInstantTraceEvent,
  SampleTraceEvent,
  SnapshotObjectTraceEvent,
  TRACE_EVENT_PHASE,
  TraceEventArgs,
  TraceEvents,
  TraceMetadata,
  TraceStreamJson
} from '@tracerbench/trace-event';

export interface Bounds {
  start: number;
  end: number;
}

export type EventModel = EventModels[TRACE_EVENT_PHASE];

export type BeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_BEGIN,
  BeginTraceEvent
>;
export type EndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_END,
  EndTraceEvent
>;
export type CompleteEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_COMPLETE,
  | CompleteTraceEvent
  | [BeginTraceEvent, EndTraceEvent]
  | BeginTraceEvent
  | EndTraceEvent
>;
export type InstantEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_INSTANT,
  InstantTraceEvent
>;
export type AsyncBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN,
  AsyncBeginTraceEvent
>;
export type AsyncStepIntoEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO,
  AsyncStepIntoTraceEvent
>;
export type AsyncStepPastEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST,
  AsyncStepPastTraceEvent
>;
export type AsyncEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_END,
  AsyncEndTraceEvent
>;
export type NestableAsyncBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN,
  NestableAsyncBeginTraceEvent
>;
export type NestableAsyncEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END,
  NestableAsyncEndTraceEvent
>;
export type NestableAsyncInstantEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT,
  NestableAsyncInstantTraceEvent
>;
export type FlowBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_BEGIN,
  FlowBeginTraceEvent
>;
export type FlowStepEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_STEP,
  FlowStepTraceEvent
>;
export type FlowEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_END,
  FlowEndTraceEvent
>;
export type MetadataEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_METADATA,
  MetadataTraceEvent
>;
export type CounterEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_COUNTER,
  CounterTraceEvent
>;
export type SampleEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_SAMPLE,
  SampleTraceEvent
>;
export type CreateObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_CREATE_OBJECT,
  CreateObjectTraceEvent
>;
export type SnapshotObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT,
  SnapshotObjectTraceEvent
>;
export type DeleteObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_DELETE_OBJECT,
  DeleteObjectTraceEvent
>;
export type MemoryDumpEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_MEMORY_DUMP,
  MemoryDumpTraceEvent
>;
export type MarkEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_MARK,
  MarkTraceEvent
>;
export type ClockSyncEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_CLOCK_SYNC,
  ClockSyncTraceEvent
>;
export type EnterContextEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT,
  EnterContextTraceEvent
>;
export type LeaveContextEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT,
  LeaveContextTraceEvent
>;

export type EventModels = {
  [Constants.TRACE_EVENT_PHASE_BEGIN]: BeginEventModel;
  [Constants.TRACE_EVENT_PHASE_END]: EndEventModel;
  [Constants.TRACE_EVENT_PHASE_COMPLETE]: CompleteEventModel;
  [Constants.TRACE_EVENT_PHASE_INSTANT]: InstantEventModel;
  [Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN]: AsyncBeginEventModel;
  [Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO]: AsyncStepIntoEventModel;
  [Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST]: AsyncStepPastEventModel;
  [Constants.TRACE_EVENT_PHASE_ASYNC_END]: AsyncEndEventModel;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN]: NestableAsyncBeginEventModel;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END]: NestableAsyncEndEventModel;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT]: NestableAsyncInstantEventModel;
  [Constants.TRACE_EVENT_PHASE_FLOW_BEGIN]: FlowBeginEventModel;
  [Constants.TRACE_EVENT_PHASE_FLOW_STEP]: FlowStepEventModel;
  [Constants.TRACE_EVENT_PHASE_FLOW_END]: FlowEndEventModel;
  [Constants.TRACE_EVENT_PHASE_METADATA]: MetadataEventModel;
  [Constants.TRACE_EVENT_PHASE_COUNTER]: CounterEventModel;
  [Constants.TRACE_EVENT_PHASE_SAMPLE]: SampleEventModel;
  [Constants.TRACE_EVENT_PHASE_CREATE_OBJECT]: CreateObjectEventModel;
  [Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT]: SnapshotObjectEventModel;
  [Constants.TRACE_EVENT_PHASE_DELETE_OBJECT]: DeleteObjectEventModel;
  [Constants.TRACE_EVENT_PHASE_MEMORY_DUMP]: MemoryDumpEventModel;
  [Constants.TRACE_EVENT_PHASE_MARK]: MarkEventModel;
  [Constants.TRACE_EVENT_PHASE_CLOCK_SYNC]: ClockSyncEventModel;
  [Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT]: EnterContextEventModel;
  [Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT]: LeaveContextEventModel;
};

export type ThreadId = number & { __isThreadId: true };
export type ProcessId = number & { __isProcessId: true };

/**
 * Monomorphic wrapper for common props
 */
export interface EventModelCommon<
  TPhase extends TRACE_EVENT_PHASE,
  TTraceEvent
> extends Bounds {
  /**
   * original order in trace
   */
  readonly ord: number;
  readonly pid: ProcessId;
  readonly tid: ThreadId;
  readonly ph: TPhase;
  readonly cat: string | string[];
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly duration: number;

  readonly parent: EventModel | undefined;

  readonly traceEvent: TTraceEvent;

  readonly args: TraceEventArgs;

  isMetadata(): this is MetadataEventModel;
  isBegin(): this is BeginEventModel;
  isEnd(): this is EndEventModel;
  isComplete(): this is CompleteEventModel;
  isInstant(): this is InstantEventModel;
  isMark(): this is MarkEventModel;

  getArg(name: string): unknown;

  getNumberArg(name: string, defaultValue: number): number;
  getNumberArg(name: string, defaultValue?: undefined): number | undefined;

  getStringArg(name: string, defaultValue: string): string;
  getStringArg(name: string, defaultValue?: undefined): string | undefined;

  toJSON(): TraceEvents[TPhase];
}

export interface TraceModel extends Bounds {
  readonly start: number;
  readonly duration: number;
  readonly end: number;
  readonly processes: ProcessModel[];
  readonly events: EventModel[];
  readonly metadata: TraceMetadata;
  toJSON(): TraceStreamJson;
  findRendererMain(): ThreadModel | undefined;
}

export interface ProcessModel extends Bounds {
  readonly trace: TraceModel;
  readonly id: ProcessId;
  readonly name: string;
  readonly sortIndex: number;
  readonly start: number;
  readonly duration: number;
  readonly end: number;
  readonly threads: ThreadModel[];
  readonly events: EventModel[];
  readonly isRenderer: boolean;
}

export interface ThreadModel extends Bounds {
  readonly process: ProcessModel;
  readonly id: ThreadId;
  readonly name: string;
  readonly sortIndex: number;
  readonly start: number;
  readonly duration: number;
  readonly end: number;
  readonly events: EventModel[];
  readonly isRendererMain: boolean;
}
