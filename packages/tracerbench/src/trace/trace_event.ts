export const TRACE_EVENT_PHASE_BEGIN = 'B';
export const TRACE_EVENT_PHASE_END = 'E';
export const TRACE_EVENT_PHASE_COMPLETE = 'X';
export const TRACE_EVENT_PHASE_INSTANT = 'I';
export const TRACE_EVENT_PHASE_ASYNC_BEGIN = 'S';
export const TRACE_EVENT_PHASE_ASYNC_STEP_INTO = 'T';
export const TRACE_EVENT_PHASE_ASYNC_STEP_PAST = 'p';
export const TRACE_EVENT_PHASE_ASYNC_END = 'F';
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN = 'b';
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_END = 'e';
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT = 'n';
export const TRACE_EVENT_PHASE_FLOW_BEGIN = 's';
export const TRACE_EVENT_PHASE_FLOW_STEP = 't';
export const TRACE_EVENT_PHASE_FLOW_END = 'f';
export const TRACE_EVENT_PHASE_METADATA = 'M';
export const TRACE_EVENT_PHASE_COUNTER = 'C';
export const TRACE_EVENT_PHASE_SAMPLE = 'P';
export const TRACE_EVENT_PHASE_CREATE_OBJECT = 'N';
export const TRACE_EVENT_PHASE_SNAPSHOT_OBJECT = 'O';
export const TRACE_EVENT_PHASE_DELETE_OBJECT = 'D';
export const TRACE_EVENT_PHASE_MEMORY_DUMP = 'v';
export const TRACE_EVENT_PHASE_MARK = 'R';
export const TRACE_EVENT_PHASE_CLOCK_SYNC = 'c';
export const TRACE_EVENT_PHASE_ENTER_CONTEXT = '(';
export const TRACE_EVENT_PHASE_LEAVE_CONTEXT = ')';
export const TRACE_EVENT_PHASE_LINK_IDS = '=';

export type TRACE_EVENT_PHASE_BEGIN = typeof TRACE_EVENT_PHASE_BEGIN;
export type TRACE_EVENT_PHASE_END = typeof TRACE_EVENT_PHASE_END;
export type TRACE_EVENT_PHASE_COMPLETE = typeof TRACE_EVENT_PHASE_COMPLETE;
export type TRACE_EVENT_PHASE_INSTANT = typeof TRACE_EVENT_PHASE_INSTANT;
export type TRACE_EVENT_PHASE_ASYNC_BEGIN = typeof TRACE_EVENT_PHASE_ASYNC_BEGIN;
export type TRACE_EVENT_PHASE_ASYNC_STEP_INTO = typeof TRACE_EVENT_PHASE_ASYNC_STEP_INTO;
export type TRACE_EVENT_PHASE_ASYNC_STEP_PAST = typeof TRACE_EVENT_PHASE_ASYNC_STEP_PAST;
export type TRACE_EVENT_PHASE_ASYNC_END = typeof TRACE_EVENT_PHASE_ASYNC_END;
export type TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN = typeof TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN;
export type TRACE_EVENT_PHASE_NESTABLE_ASYNC_END = typeof TRACE_EVENT_PHASE_NESTABLE_ASYNC_END;
export type TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT = typeof TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT;
export type TRACE_EVENT_PHASE_FLOW_BEGIN = typeof TRACE_EVENT_PHASE_FLOW_BEGIN;
export type TRACE_EVENT_PHASE_FLOW_STEP = typeof TRACE_EVENT_PHASE_FLOW_STEP;
export type TRACE_EVENT_PHASE_FLOW_END = typeof TRACE_EVENT_PHASE_FLOW_END;
export type TRACE_EVENT_PHASE_METADATA = typeof TRACE_EVENT_PHASE_METADATA;
export type TRACE_EVENT_PHASE_COUNTER = typeof TRACE_EVENT_PHASE_COUNTER;
export type TRACE_EVENT_PHASE_SAMPLE = typeof TRACE_EVENT_PHASE_SAMPLE;
export type TRACE_EVENT_PHASE_CREATE_OBJECT = typeof TRACE_EVENT_PHASE_CREATE_OBJECT;
export type TRACE_EVENT_PHASE_SNAPSHOT_OBJECT = typeof TRACE_EVENT_PHASE_SNAPSHOT_OBJECT;
export type TRACE_EVENT_PHASE_DELETE_OBJECT = typeof TRACE_EVENT_PHASE_DELETE_OBJECT;
export type TRACE_EVENT_PHASE_MEMORY_DUMP = typeof TRACE_EVENT_PHASE_MEMORY_DUMP;
export type TRACE_EVENT_PHASE_MARK = typeof TRACE_EVENT_PHASE_MARK;
export type TRACE_EVENT_PHASE_CLOCK_SYNC = typeof TRACE_EVENT_PHASE_CLOCK_SYNC;
export type TRACE_EVENT_PHASE_ENTER_CONTEXT = typeof TRACE_EVENT_PHASE_ENTER_CONTEXT;
export type TRACE_EVENT_PHASE_LEAVE_CONTEXT = typeof TRACE_EVENT_PHASE_LEAVE_CONTEXT;
export type TRACE_EVENT_PHASE_LINK_IDS = typeof TRACE_EVENT_PHASE_LINK_IDS;

export type TRACE_EVENT_PHASE =
  | TRACE_EVENT_PHASE_BEGIN
  | TRACE_EVENT_PHASE_END
  | TRACE_EVENT_PHASE_COMPLETE
  | TRACE_EVENT_PHASE_INSTANT
  | TRACE_EVENT_PHASE_ASYNC_BEGIN
  | TRACE_EVENT_PHASE_ASYNC_STEP_INTO
  | TRACE_EVENT_PHASE_ASYNC_STEP_PAST
  | TRACE_EVENT_PHASE_ASYNC_END
  | TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN
  | TRACE_EVENT_PHASE_NESTABLE_ASYNC_END
  | TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT
  | TRACE_EVENT_PHASE_FLOW_BEGIN
  | TRACE_EVENT_PHASE_FLOW_STEP
  | TRACE_EVENT_PHASE_FLOW_END
  | TRACE_EVENT_PHASE_METADATA
  | TRACE_EVENT_PHASE_COUNTER
  | TRACE_EVENT_PHASE_SAMPLE
  | TRACE_EVENT_PHASE_CREATE_OBJECT
  | TRACE_EVENT_PHASE_SNAPSHOT_OBJECT
  | TRACE_EVENT_PHASE_DELETE_OBJECT
  | TRACE_EVENT_PHASE_MEMORY_DUMP
  | TRACE_EVENT_PHASE_MARK
  | TRACE_EVENT_PHASE_CLOCK_SYNC
  | TRACE_EVENT_PHASE_ENTER_CONTEXT
  | TRACE_EVENT_PHASE_LEAVE_CONTEXT
  | TRACE_EVENT_PHASE_LINK_IDS;

export const TRACE_EVENT_SCOPE_NAME_GLOBAL: TRACE_EVENT_SCOPE_NAME_GLOBAL = 'g';
export const TRACE_EVENT_SCOPE_NAME_PROCESS: TRACE_EVENT_SCOPE_NAME_PROCESS =
  'p';
export const TRACE_EVENT_SCOPE_NAME_THREAD: TRACE_EVENT_SCOPE_NAME_THREAD = 't';
export type TRACE_EVENT_SCOPE_NAME_GLOBAL = 'g';
export type TRACE_EVENT_SCOPE_NAME_PROCESS = 'p';
export type TRACE_EVENT_SCOPE_NAME_THREAD = 't';
export type TRACE_EVENT_SCOPE =
  | TRACE_EVENT_SCOPE_NAME_GLOBAL
  | TRACE_EVENT_SCOPE_NAME_PROCESS
  | TRACE_EVENT_SCOPE_NAME_THREAD;

export const enum TRACE_EVENT_NAME {
  TRACING_STARTED_IN_PAGE = 'TracingStartedInPage',
  PROFILE = 'Profile',
  PROFILE_CHUNK = 'ProfileChunk',
  CPU_PROFILE = 'CpuProfile',
  V8_EXECUTE = 'V8.Execute'
}

export const enum PROCESS_NAME {
  BROWSER = 'Browser',
  RENDERER = 'Renderer',
  GPU = 'GPU Process'
}

export const enum TRACE_METADATA_NAME {
  PROCESS_NAME = 'process_name',
  PROCESS_LABELS = 'process_labels',
  PROCESS_SORT_INDEX = 'process_sort_index',
  PROCESS_UPTIME_SECONDS = 'process_uptime_seconds',
  THREAD_NAME = 'thread_name',
  THREAD_SORT_INDEX = 'thread_sort_index',
  NUM_CPUS = 'num_cpus',
  TRACE_BUFFER_OVERFLOWED = 'trace_buffer_overflowed'
}

/*
 StringAppendF(out, "{\"pid\":%i,\"tid\":%i,\"ts\":%" PRId64
                     ",\"ph\":\"%c\",\"cat\":\"%s\",\"name\":",
                process_id, thread_id, time_int64, phase_, category_group_name);
 */

/** Serialized TraceEvent */
export interface ITraceEvent {
  /**
   * Process id. Can be 0 (kNoId) for global scope event like metadata.
   *
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
  ph: TRACE_EVENT_PHASE;

  /**
   * Event categories (comma delimited).
   */
  cat: string;

  /**
   * Event name.
   */
  name: string;

  /**
   * Wall clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
   */
  dur?: number;

  /**
   * Thread clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
   */
  tdur?: number;

  /**
   * Optional thread clock timestamp in microseconds.
   */
  tts?: number;

  /**
   * Event key/value pairs as an object.
   *
   * Can also be a constant "__stripped__" as well as the individual values.
   */
  args: { [key: string]: any } | '__stripped__';

  /**
   * Optional flag indicating whether the tts is meaningful for related async events.
   *
   * Serialized as 1 if TRACE_EVENT_FLAG_ASYNC_TTS flag was set.
   */
  use_async_tts?: number;

  /**
   * Scope of id
   */
  scope?: string;

  /**
   * Event id.
   *
   * Serialized as a hex encoded uint64 string if the TRACE_EVENT_FLAG_HAS_ID was set.
   */
  id?: string;

  /**
   * Scoped event ids. If has TRACE_EVENT_FLAG_HAS_LOCAL_ID or TRACE_EVENT_FLAG_HAS_GLOBAL_ID
   */
  id2?:
    | {
        local: string;
      }
    | {
        global: string;
      };

  /**
   * Optional flag to say the async event should be associated with its enclosing event.
   *
   * Serialized as "e" if TRACE_EVENT_FLAG_BIND_TO_ENCLOSING flag was set.
   */
  bp?: string;

  /**
   * Optional flow binding id.
   *
   * Serialized as a hex encoded uint64 string when the either TRACE_EVENT_FLAG_FLOW_IN or
   * TRACE_EVENT_FLAG_FLOW_OUT flag is set.
   */
  bind_id?: string;

  /**
   * Optional incoming flow flag.
   *
   * Serialized as true if the TRACE_EVENT_FLAG_FLOW_IN flag is set.
   */
  flow_in?: boolean;

  /**
   * Optional outgoing flow flag.
   *
   * Serialized as true if the TRACE_EVENT_FLAG_FLOW_OUT flag is set.
   */
  flow_out?: boolean;

  /**
   * Optional scope for TRACE_EVENT_PHASE_INSTANT events.
   *
   * Seems to always be TRACE_EVENT_SCOPE_NAME_THREAD ('t') but
   * the serializer can output "?" or "g" or "p" or "t".
   */
  s?: TRACE_EVENT_SCOPE;
}

export interface ICpuProfile {
  nodes: ICpuProfileNode[];

  /** startTime in microseconds of CPU profile */
  startTime: number;

  /** node id of node that was sampled */
  samples: number[];

  /** delta from when the profile started to when the sample was taken in microseconds */
  timeDeltas: number[];
}

export interface ICpuProfileNode {
  id: number;
  callFrame: ICallFrame;
  children?: number[];
  positionTicks?: {
    line: number;
    ticks: number;
  };
}

export interface IProfileEvent extends ITraceEvent {
  ph: TRACE_EVENT_PHASE_SAMPLE;
  name: TRACE_EVENT_NAME.PROFILE;
  args: {
    data: {
      startTime: number;
    };
  };
  id: string;
}

export interface IProfileChunkEvent extends ITraceEvent {
  ph: TRACE_EVENT_PHASE_SAMPLE;
  name: TRACE_EVENT_NAME.PROFILE_CHUNK;
  args: {
    data: IProfileChunk;
  };
  id: string;
}

export interface IProfileChunk {
  cpuProfile: {
    nodes: IProfileNode[];
    samples: number[];
  };
  timeDeltas: number[];
}

export interface IProfileNode {
  id: number;
  parent?: number;
  callFrame: ICallFrame;
}

export interface ICallFrame {
  functionName: string;
  scriptId: string | number;
  url: string;
  lineNumber: number;
  columnNumber: number;
}

export interface ICpuProfileEvent extends ITraceEvent {
  ph: TRACE_EVENT_PHASE_INSTANT;
  name: TRACE_EVENT_NAME.CPU_PROFILE;
  args: {
    data: {
      cpuProfile: ICpuProfile;
    };
  };
}

export interface ICpuProfile {
  nodes: ICpuProfileNode[];
  /**
   * startTime in microseconds of CPU profile
   */
  startTime: number;
  endTime: number;

  /**
   * id of root node
   */
  samples: number[];

  /**
   * offset from startTime if first or previous time
   */
  timeDeltas: number[];

  duration: number;
}

export const enum FUNCTION_NAME {
  ROOT = '(root)',
  PROGRAM = '(program)',
  IDLE = '(idle)',
  GC = '(garbage collector)'
}

export interface ICpuProfileNode {
  id: number;
  callFrame: ICallFrame;
  children?: number[];
  positionTicks?: {
    line: number;
    ticks: number;
  };

  sampleCount: number;

  min: number;
  max: number;

  total: number;
  self: number;
}

export interface ISample {
  delta: number;
  timestamp: number;
  prev: ISample | null;
  next: ISample | null;

  node: ICpuProfileNode;
}
