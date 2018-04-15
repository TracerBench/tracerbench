export const enum TRACE_EVENT_PHASE {
  BEGIN = 'B',
  END = 'E',
  COMPLETE = 'X',
  INSTANT = 'I',
  ASYNC_BEGIN = 'S',
  ASYNC_STEP_INTO = 'T',
  ASYNC_STEP_PAST = 'p',
  ASYNC_END = 'F',
  NESTABLE_ASYNC_BEGIN = 'b',
  NESTABLE_ASYNC_END = 'e',
  NESTABLE_ASYNC_INSTANT = 'n',
  FLOW_BEGIN = 's',
  FLOW_STEP = 't',
  FLOW_END = 'f',
  METADATA = 'M',
  COUNTER = 'C',
  SAMPLE = 'P',
  CREATE_OBJECT = 'N',
  SNAPSHOT_OBJECT = 'O',
  DELETE_OBJECT = 'D',
  MEMORY_DUMP = 'v',
  MARK = 'R',
  CLOCK_SYNC = 'c',
  ENTER_CONTEXT = '(',
  LEAVE_CONTEXT = ')',
  LINK_IDS = '=',
}

export const enum TRACE_EVENT_SCOPE {
  GLOBAL = 'g',
  PROCESS = 'p',
  THREAD = 't',
}

export const enum TRACE_EVENT_NAME {
  TRACING_STARTED_IN_PAGE = 'TracingStartedInPage',
  PROFILE = 'Profile',
  PROFILE_CHUNK = 'ProfileChunk',
  CPU_PROFILE = 'CpuProfile',
}

export const enum PROCESS_NAME {
  BROWSER = 'Browser',
  RENDERER = 'Renderer',
  GPU = 'GPU Process',
}

export const enum TRACE_METADATA_NAME {
  PROCESS_NAME = 'process_name',
  PROCESS_LABELS = 'process_labels',
  PROCESS_SORT_INDEX = 'process_sort_index',
  PROCESS_UPTIME_SECONDS = 'process_uptime_seconds',
  THREAD_NAME = 'thread_name',
  THREAD_SORT_INDEX = 'thread_sort_index',
  NUM_CPUS = 'num_cpus',
  TRACE_BUFFER_OVERFLOWED = 'trace_buffer_overflowed',
}

export const enum ARGS {
  STRIPPED = '__stripped__',
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
  args: { [key: string]: any } | ARGS.STRIPPED;

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
  ph: TRACE_EVENT_PHASE.SAMPLE;
  name: TRACE_EVENT_NAME.PROFILE;
  args: {
    data: {
      startTime: number;
    };
  };
  id: string;
}

export interface IProfileChunkEvent extends ITraceEvent {
  ph: TRACE_EVENT_PHASE.SAMPLE;
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
  ph: TRACE_EVENT_PHASE.INSTANT;
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
  GC = '(garbage collector)',
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
