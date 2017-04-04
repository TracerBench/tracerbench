import Thread from "./thread";
import Bounds from "./bounds";
import { TraceEvent } from "./trace_event";

export default class Process {
  threadMap: { [tid: number]: Thread; } = {};
  threads: Thread[] = [];
  mainThread: Thread = null;
  scriptStreamerThread: Thread = null;
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];
  name: string;
  labels: string;
  sortIndex: number;
  traceBufferOverflowedAt: number;
  isTimeTicksHighResolution: boolean;
  traceConfig: any;

  id: number;
  constructor(id: number) {
    this.id = id;
  }

  thread(tid: number) {
    let thread = this.threadMap[tid];
    if (thread === undefined) {
      this.threadMap[tid] = thread = new Thread(tid);
      this.threads.push(thread);
    }
    return thread;
  }

  addEvent(event: TraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
    this.thread(event.tid).addEvent(event);
  }
}
