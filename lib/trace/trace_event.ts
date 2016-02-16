export const TRACE_EVENT_PHASE_BEGIN = "B";
export const TRACE_EVENT_PHASE_END = "E";
export const TRACE_EVENT_PHASE_COMPLETE = "X";
export const TRACE_EVENT_PHASE_INSTANT = "I";
export const TRACE_EVENT_PHASE_ASYNC_BEGIN = "S";
export const TRACE_EVENT_PHASE_ASYNC_STEP_INTO = "T";
export const TRACE_EVENT_PHASE_ASYNC_STEP_PAST = "p";
export const TRACE_EVENT_PHASE_ASYNC_END = "F";
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN = "b";
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_END = "e";
export const TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT = "n";
export const TRACE_EVENT_PHASE_FLOW_BEGIN = "s";
export const TRACE_EVENT_PHASE_FLOW_STEP = "t";
export const TRACE_EVENT_PHASE_FLOW_END = "f";
export const TRACE_EVENT_PHASE_METADATA = "M";
export const TRACE_EVENT_PHASE_COUNTER = "C";
export const TRACE_EVENT_PHASE_SAMPLE = "P";
export const TRACE_EVENT_PHASE_CREATE_OBJECT = "N";
export const TRACE_EVENT_PHASE_SNAPSHOT_OBJECT = "O";
export const TRACE_EVENT_PHASE_DELETE_OBJECT = "D";
export const TRACE_EVENT_PHASE_MEMORY_DUMP = "v";
export const TRACE_EVENT_PHASE_MARK = "R";

/** Serialized TraceEvent */
export interface TraceEvent {
  /** Process id */
  pid: number;
  /**
   * Thread id.
   * Always present, but can be serialized as 0 if trace_event_internal::kNoId
   * was used or -1 if TRACE_EVENT_FLAG_HAS_PROCESS_ID flag is set.
   */
  tid: number;
  /**
   * Event phase, single character constants defined in trace_event_common.h
   */
  ph: string;
  /**
   * Event category
   */
  cat: string;
  /**
   * Event name
   */
  name: string;
  /**
   * Wall clock timestamp in microseconds.
   */
  ts: number;
  /**
   * Optional wall clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
   */
  dur?: number;
  /**
   * Optional thread clock duration in microseconds for TRACE_EVENT_PHASE_COMPLETE events.
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
  args: { [key: string]: any; } | string;
  /**
   * Optional flag indicating whether the tts is meaningful for related async events.
   *
   * Serialized as 1 if TRACE_EVENT_FLAG_ASYNC_TTS flag was set.
   */
  use_async_tts?: number;
  /**
   * Optional event id.
   *
   * Serialized as a hex encoded uint64 string if the TRACE_EVENT_FLAG_HAS_ID was set.
   */
  id?: string;
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
   * Optional scope for TRACE_EVENT_PHASE_INSTANT phase events.
   *
   * Seems to always be TRACE_EVENT_SCOPE_NAME_THREAD ('t') but
   * the serializer can output "?" or "g" or "p" or "t".
   */
  s?: string;
}