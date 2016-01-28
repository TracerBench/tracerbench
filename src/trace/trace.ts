import Process from "./process";
import Thread from "./thread";
import Bounds from "./bounds";

import {
  TraceEvent,
  TRACE_EVENT_PHASE_METADATA
} from "./trace_event";

export default class Trace {
  processMap: { [pid: number]: Process; } = {};
  processes: Process[] = [];
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];

  numberOfProcessors: number;

  process(pid: number): Process {
    let process = this.processMap[pid];
    if (process === undefined) {
      this.processMap[pid] = process = new Process(pid);
      this.processes.push(process);
    }
    return process;
  }

  thread(pid: number, tid: number): Thread {
    return this.process(pid).thread(tid);
  }

  addEvents(events: TraceEvent[]) {
    for (let i = 0; i < events.length; i++) {
      this.addEvent(events[i]);
    }
  }

  addEvent(event: TraceEvent) {
    if (event.ph === TRACE_EVENT_PHASE_METADATA) {
      this.addMetadata(event);
      return;
    }
    this.bounds.addEvent(event);
    this.events.push(event);
    this.process(event.pid).addEvent(event);
  }

  addMetadata(event: TraceEvent) {
    let pid = event.pid;
    let tid = event.tid;
    switch (event.name) {
      case "num_cpus":
        this.numberOfProcessors = event.args["number"];
        break;
      case "process_name":
        this.process(pid).name = event.args["name"];
        break;
      case "process_labels":
        this.process(pid).labels = event.args["labels"];
        break;
      case "process_sort_index":
        this.process(pid).sortIndex = event.args["sort_index"];
        break;
      case "trace_buffer_overflowed":
        this.process(pid).traceBufferOverflowedAt = event.args["overflowed_at_ts"];
        break;
      case "thread_name":
        this.thread(pid, tid).name = event.args["name"];
        break;
      case "thread_sort_index":
        this.thread(pid, tid).sortIndex = event.args["sort_index"];
        break;
      default:
        console.warn("unrecognized metadata:", JSON.stringify(event, null, 2));
        break;
    }
  }
}
