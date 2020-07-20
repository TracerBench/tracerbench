import type { Constants } from './constants';

export type TRACE_EVENT_PHASE = keyof TraceEvents;
export type TRACE_EVENT_SCOPE_NAME =
  | Constants.TRACE_EVENT_SCOPE_NAME_GLOBAL
  | Constants.TRACE_EVENT_SCOPE_NAME_PROCESS
  | Constants.TRACE_EVENT_SCOPE_NAME_THREAD;

export type STRIPPED = Constants.STRIPPED;
export interface TraceEventArgs {
  [name: string]: unknown;
}

export interface TraceEventLocalId {
  local: string;
}

export interface TraceEventGlobalId {
  global: string;
}

/*
 StringAppendF(out, "{\"pid\":%i,\"tid\":%i,\"ts\":%" PRId64
                     ",\"ph\":\"%c\",\"cat\":\"%s\",\"name\":",
                process_id, thread_id, time_int64, phase_, category_group_name);
 */

export interface TraceEventCommon<TPhase extends string = TRACE_EVENT_PHASE> {
  /**
   * Process id. Can be 0 (kNoId) for global scope event like metadata.
   */
  pid: number;

  /**
   * Thread id.
   * Can be 0 (kNoId) or -1 if TRACE_EVENT_FLAG_HAS_PROCESS_ID flag is set.
   */
  tid: number;

  /**
   * Wall clock timestamp in microseconds.
   */
  ts: number;

  /**
   * Event phase, single character constants defined in trace_event_common.h
   */
  ph: TPhase;

  /**
   * Event categories (comma delimited).
   */
  cat: string;

  /**
   * Event name.
   */
  name: string;

  /**
   * Event key/value args or "__stripped__".
   * Individual arg values can be "__stripped__" too.
   */
  args: STRIPPED | TraceEventArgs;

  /**
   * Optional thread clock timestamp in microseconds.
   */
  tts?: number;

  ticount?: number;

  /**
   * Optional flag indicating whether the tts is meaningful for related async events.
   *
   * Serialized as 1 if TRACE_EVENT_FLAG_ASYNC_TTS flag was set.
   */
  use_async_tts?: 1;
  scope?: string;
  id?: string;
  id2?: TraceEventLocalId | TraceEventGlobalId;
  bp?: 'e';
  bind_id?: string;
  flow_in?: true;
  flow_out?: true;
}

export interface CompleteTraceEvent
  extends TraceEventCommon<Constants.TRACE_EVENT_PHASE_COMPLETE> {
  /**
   * Wall clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
   */
  dur: number;
  /**
   * Thread clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
   */
  tdur?: number;
  tidelta?: number;
}

export interface InstantTraceEvent
  extends TraceEventCommon<Constants.TRACE_EVENT_PHASE_INSTANT> {
  s: TRACE_EVENT_SCOPE_NAME;
}

export type BeginTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_BEGIN
>;
export type EndTraceEvent = TraceEventCommon<Constants.TRACE_EVENT_PHASE_END>;
export type AsyncBeginTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_BEGIN
>;
export type AsyncStepIntoTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_INTO
>;
export type AsyncStepPastTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_STEP_PAST
>;
export type AsyncEndTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_ASYNC_END
>;
export type NestableAsyncBeginTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN
>;
export type NestableAsyncEndTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_END
>;
export type NestableAsyncInstantTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT
>;
export type FlowBeginTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_BEGIN
>;
export type FlowStepTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_STEP
>;
export type FlowEndTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_FLOW_END
>;
export type MetadataTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_METADATA
>;
export type CounterTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_COUNTER
>;
export type SampleTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_SAMPLE
>;
export type CreateObjectTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_CREATE_OBJECT
>;
export type SnapshotObjectTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_SNAPSHOT_OBJECT
>;
export type DeleteObjectTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_DELETE_OBJECT
>;
export type MemoryDumpTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_MEMORY_DUMP
>;
export type MarkTraceEvent = TraceEventCommon<Constants.TRACE_EVENT_PHASE_MARK>;
export type ClockSyncTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_CLOCK_SYNC
>;
export type EnterContextTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_ENTER_CONTEXT
>;
export type LeaveContextTraceEvent = TraceEventCommon<
  Constants.TRACE_EVENT_PHASE_LEAVE_CONTEXT
>;

export type TraceEvents = {
  [Constants.TRACE_EVENT_PHASE_BEGIN]: BeginTraceEvent;
  [Constants.TRACE_EVENT_PHASE_END]: EndTraceEvent;
  [Constants.TRACE_EVENT_PHASE_COMPLETE]: CompleteTraceEvent;
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
export type TraceEvent = TraceEvents[TRACE_EVENT_PHASE];

/**
 * The format when using transferMode: 'ReturnAsStream' and streamFormat: 'json'.
 * @public
 */
export interface TraceStreamJson {
  traceEvents: TraceEvent[];
  metadata: TraceMetadata;
}

export interface TraceMetadata {
  [name: string]: unknown;
}

export interface NameMetadataArgs extends TraceEventArgs {
  name: string;
}

export interface SortIndexMetadataArgs extends TraceEventArgs {
  sort_index: number;
}

export interface LabelsMetadataArgs extends TraceEventArgs {
  labels: string;
}

export type V8RuntimeCallCountAndTime = [number, number];

export interface V8RuntimeCallStats {
  [stat: string]: V8RuntimeCallCountAndTime;
}

export interface V8RuntimeCallStatsArgs extends TraceEventArgs {
  'runtime-call-stats': V8RuntimeCallStats;
}
