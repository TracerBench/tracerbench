import Thread from "./thread";
import Bounds from "./bounds";
import { TraceEvent } from "./trace_event";

export default class Process {
  threads: { [tid: number]: Thread; } = {};
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];

  name: string;
  labels: string;
  sortIndex: number;
  traceBufferOverflowedAt: number;

  id: number;
  constructor(id: number) {
    this.id = id;
  }

  thread(tid: number) {
    let thread = this.threads[tid];
    if (thread === undefined) {
      this.threads[tid] = thread = new Thread(tid);
    }
    return thread;
  }

  addEvent(event: TraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
    this.thread(event.tid).addEvent(event);
  }

  findThread(predicate: (thread: Thread) => boolean): Thread {
    let tids = Object.keys(this.threads);
    for (let i = 0; i < tids.length; i++) {
      let thread = this.threads[tids[i]];
      if (predicate(thread)) {
        return thread;
      }
    }
  }
}
