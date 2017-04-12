import Process from "./process";
import Thread from "./thread";
import Bounds from "./bounds";
import binsearch from "array-binsearch";

import {
  TraceEvent,
  TRACE_EVENT_PHASE_METADATA,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_END,
  TRACE_EVENT_PHASE_COMPLETE
} from "./trace_event";

import traceEventComparator from "./trace_event_comparator";

export default class Trace {
  processMap: { [pid: number]: Process; } = {};
  processes: Process[] = [];
  mainProcess: Process;
  bounds: Bounds = new Bounds();
  events: TraceEvent[] = [];
  browserProcess: Process = null;
  gpuProcess: Process = null;
  rendererProcesses: Process[] = [];

  numberOfProcessors: number;

  openBegins: TraceEvent[] = [];

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

  buildModel() {
    let events = this.events;
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let process = this.process(event.pid);
      process.addEvent(event);
    }
  }

  addEvent(event: TraceEvent) {
    if (event.ph === TRACE_EVENT_PHASE_END) {
      this.endEvent(event);
      return;
    }
    let events = this.events;
    let index = binsearch(events, event, traceEventComparator);
    if (index < 0) {
      index = ~index;
    } else {
      // insert just after if ts order matched
      index++;
    }
    events.splice(index, 0, event);
    if (event.ph === TRACE_EVENT_PHASE_METADATA) {
      this.addMetadata(event);
      return;
    }
    if (event.ph === TRACE_EVENT_PHASE_BEGIN) {
      this.openBegins.push(event);
    }
    this.bounds.addEvent(event);
  }

  endEvent(end: TraceEvent) {
    let openBegins = this.openBegins;
    for (let i = openBegins.length - 1; i >= 0; i--) {
      let begin = openBegins[i];
      if (begin.name === end.name &&
          begin.cat === end.cat &&
          begin.tid === end.tid &&
          begin.pid === end.pid) {
        openBegins.splice(i, 1);
        this.completeEvent(begin, end);
      }
    }
  }

  completeEvent(begin: TraceEvent, end: TraceEvent) {
    let args;
    if (typeof begin.args === "object" && begin.args !== null) {
      args = Object.assign({}, begin.args);
    }
    if (typeof end.args === "object" && end.args !== null) {
      args = Object.assign(args === undefined ? {} : args, end.args);
    }
    let complete = {
      pid: begin.pid,
      tid: begin.tid,
      ts: begin.ts,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      cat: begin.cat,
      name: begin.name,
      args: args,
      dur: end.ts - begin.ts,
      tdur: end.tts - begin.tts,
      tts: begin.tts
    };
    let events = this.events;
    let index = binsearch(events, begin, traceEventComparator);
    events[index] = complete;
  }

  addMetadata(event: TraceEvent) {
    let pid = event.pid;
    let tid = event.tid;
    switch (event.name) {
      case "num_cpus":
        this.numberOfProcessors = event.args["number"];
        break;
      case "process_name":
        let process_name: string = event.args["name"];
        let process = this.process(pid);
        process.name = process_name;
        if (process_name === "GPU Process") {
          this.gpuProcess = process;
        } else if (process_name === "Browser") {
          this.browserProcess = process;
        } else if (process_name === "Renderer") {
          this.rendererProcesses.push(process);
        }
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
        let thread_name: string = event.args["name"];
        let thread = this.thread(pid, tid);
        thread.name = thread_name;
        if (thread_name === 'CrRendererMain') {
          this.process(pid).mainThread = thread;
        } else if (thread_name === 'ScriptStreamerThread') {
          this.process(pid).scriptStreamerThread = thread;
        }
        break;
      case "thread_sort_index":
        this.thread(pid, tid).sortIndex = event.args["sort_index"];
        break;
      case "IsTimeTicksHighResolution":
        this.process(pid).isTimeTicksHighResolution = event.args["value"];
        break;
      case "TraceConfig":
        this.process(pid).traceConfig = event.args["value"];
        break;
      default:
        // console.warn("unrecognized metadata:", JSON.stringify(event, null, 2));
        break;
    }
  }
}
