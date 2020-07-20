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

export type EventModelTraceEvents = {
  [Constants.TRACE_EVENT_PHASE_BEGIN]: BeginTraceEvent;
  [Constants.TRACE_EVENT_PHASE_END]: EndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_COMPLETE]:
    | CompleteTraceEvent
    | [BeginTraceEvent, EndTraceEvent]
    | BeginTraceEvent
    | EndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_INSTANT]: InstantTraceEvent;
  [Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN]: AsyncBeginTraceEvent;
  [Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO]: AsyncStepIntoTraceEvent;
  [Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST]: AsyncStepPastTraceEvent;
  [Constants.TRACE_EVENT_PHASE_ASYNC_END]: AsyncEndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN]: NestableAsyncBeginTraceEvent;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END]: NestableAsyncEndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT]: NestableAsyncInstantTraceEvent;
  [Constants.TRACE_EVENT_PHASE_FLOW_BEGIN]: FlowBeginTraceEvent;
  [Constants.TRACE_EVENT_PHASE_FLOW_STEP]: FlowStepTraceEvent;
  [Constants.TRACE_EVENT_PHASE_FLOW_END]: FlowEndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_METADATA]: MetadataTraceEvent;
  [Constants.TRACE_EVENT_PHASE_COUNTER]: CounterTraceEvent;
  [Constants.TRACE_EVENT_PHASE_SAMPLE]: SampleTraceEvent;
  [Constants.TRACE_EVENT_PHASE_CREATE_OBJECT]: CreateObjectTraceEvent;
  [Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT]: SnapshotObjectTraceEvent;
  [Constants.TRACE_EVENT_PHASE_DELETE_OBJECT]: DeleteObjectTraceEvent;
  [Constants.TRACE_EVENT_PHASE_MEMORY_DUMP]: MemoryDumpTraceEvent;
  [Constants.TRACE_EVENT_PHASE_MARK]: MarkTraceEvent;
  [Constants.TRACE_EVENT_PHASE_CLOCK_SYNC]: ClockSyncTraceEvent;
  [Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT]: EnterContextTraceEvent;
  [Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT]: LeaveContextTraceEvent;
};

export type EventModel = EventModels[TRACE_EVENT_PHASE];

export type BeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_BEGIN
>;
export type EndEventModel = EventModelCommon<Constants.TRACE_EVENT_PHASE_END>;
export type CompleteEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_COMPLETE
>;
export type InstantEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_INSTANT
>;
export type AsyncBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN
>;
export type AsyncStepIntoEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO
>;
export type AsyncStepPastEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST
>;
export type AsyncEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_END
>;
export type NestableAsyncBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN
>;
export type NestableAsyncEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END
>;
export type NestableAsyncInstantEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT
>;
export type FlowBeginEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_BEGIN
>;
export type FlowStepEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_STEP
>;
export type FlowEndEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_END
>;
export type MetadataEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_METADATA
>;
export type CounterEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_COUNTER
>;
export type SampleEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_SAMPLE
>;
export type CreateObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_CREATE_OBJECT
>;
export type SnapshotObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT
>;
export type DeleteObjectEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_DELETE_OBJECT
>;
export type MemoryDumpEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_MEMORY_DUMP
>;
export type MarkEventModel = EventModelCommon<Constants.TRACE_EVENT_PHASE_MARK>;
export type ClockSyncEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_CLOCK_SYNC
>;
export type EnterContextEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT
>;
export type LeaveContextEventModel = EventModelCommon<
  Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT
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
export interface EventModelCommon<TPhase extends TRACE_EVENT_PHASE>
  extends Bounds {
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

  readonly traceEvent: EventModelTraceEvents[TPhase];

  readonly args: TraceEventArgs;

  isBegin(): this is BeginEventModel;
  isEnd(): this is EndEventModel;
  isComplete(): this is CompleteEventModel;
  isInstant(): this is InstantEventModel;
  isAsyncBegin(): this is AsyncBeginEventModel;
  isAsyncStepInto(): this is AsyncStepIntoEventModel;
  isAsyncStepPast(): this is AsyncStepPastEventModel;
  isAsyncEnd(): this is AsyncEndEventModel;
  isNestableAsyncBegin(): this is NestableAsyncBeginEventModel;
  isNestableAsyncEnd(): this is NestableAsyncEndEventModel;
  isNestableAsyncInstant(): this is NestableAsyncInstantEventModel;
  isFlowBegin(): this is FlowBeginEventModel;
  isFlowStep(): this is FlowStepEventModel;
  isFlowEnd(): this is FlowEndEventModel;
  isMetadata(): this is MetadataEventModel;
  isCounter(): this is CounterEventModel;
  isSample(): this is SampleEventModel;
  isCreateObject(): this is CreateObjectEventModel;
  isSnapshotObject(): this is SnapshotObjectEventModel;
  isDeleteObject(): this is DeleteObjectEventModel;
  isMemoryDump(): this is MemoryDumpEventModel;
  isMark(): this is MarkEventModel;
  isClockSync(): this is ClockSyncEventModel;
  isEnterContext(): this is EnterContextEventModel;
  isLeaveContext(): this is LeaveContextEventModel;

  getArg(name: string): unknown;

  getNumberArg(name: string, defaultValue: number): number;
  getNumberArg(name: string, defaultValue?: undefined): number | undefined;

  getStringArg(name: string, defaultValue: string): string;
  getStringArg(name: string, defaultValue?: undefined): string | undefined;

  hasCategory(category: string | ((category: string) => boolean)): boolean;

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
