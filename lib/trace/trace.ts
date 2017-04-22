import binsearch from "array-binsearch";
import Bounds from "./bounds";
import Process from "./process";
import Thread from "./thread";

import {
  ITraceEvent,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_END,
  TRACE_EVENT_PHASE_METADATA,
} from "./trace_event";

import traceEventComparator from "./trace_event_comparator";

export default class Trace {
  public processes: Process[] = [];
  public mainProcess: Process;
  public bounds: Bounds = new Bounds();
  public events: ITraceEvent[] = [];
  public browserProcess: Process = null;
  public gpuProcess: Process = null;
  public rendererProcesses: Process[] = [];
  public numberOfProcessors: number;

  private processMap: { [pid: number]: Process; } = {};
  private openBegins: ITraceEvent[] = [];

  public process(pid: number): Process {
    let process = this.processMap[pid];
    if (process === undefined) {
      this.processMap[pid] = process = new Process(pid);
      this.processes.push(process);
    }
    return process;
  }

  public thread(pid: number, tid: number): Thread {
    return this.process(pid).thread(tid);
  }

  public addEvents(events: ITraceEvent[]) {
    for (const event of events) {
      this.addEvent(event);
    }
  }

  public buildModel() {
    const { events } = this;
    for (const event of events) {
      const process = this.process(event.pid);
      process.addEvent(event);
    }
  }

  private addEvent(event: ITraceEvent) {
    if (event.ph === TRACE_EVENT_PHASE_END) {
      this.endEvent(event);
      return;
    }
    const events = this.events;
    let index = binsearch(events, event, traceEventComparator);
    if (index < 0) {
      /* tslint:disable:no-bitwise */
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

  private endEvent(end: ITraceEvent) {
    const { openBegins } = this;
    for (let i = openBegins.length - 1; i >= 0; i--) {
      const begin = openBegins[i];
      if (begin.name === end.name &&
          begin.cat === end.cat &&
          begin.tid === end.tid &&
          begin.pid === end.pid) {
        openBegins.splice(i, 1);
        this.completeEvent(begin, end);
      }
    }
  }

  private completeEvent(begin: ITraceEvent, end: ITraceEvent) {
    let args;
    if (typeof begin.args === "object" && begin.args !== null) {
      args = Object.assign({}, begin.args);
    }
    if (typeof end.args === "object" && end.args !== null) {
      args = Object.assign(args === undefined ? {} : args, end.args);
    }
    const complete: ITraceEvent = {
      args,
      cat: begin.cat,
      dur: end.ts - begin.ts,
      name: begin.name,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      pid: begin.pid,
      tdur: end.tts - begin.tts,
      tid: begin.tid,
      ts: begin.ts,
      tts: begin.tts,
    };
    const { events } = this;
    const index = binsearch(events, begin, traceEventComparator);
    events[index] = complete;
  }

  private addMetadata(event: ITraceEvent) {
    const { pid, tid } = event;
    if (event.args === "__stripped__") {
      return;
    }
    switch (event.name) {
      case "num_cpus":
        this.numberOfProcessors = event.args.number;
        break;
      case "process_name":
        const processName: string = event.args.name;
        const process = this.process(pid);
        process.name = processName;
        if (processName === "GPU Process") {
          this.gpuProcess = process;
        } else if (processName === "Browser") {
          this.browserProcess = process;
        } else if (processName === "Renderer") {
          this.rendererProcesses.push(process);
        }
        break;
      case "process_labels":
        this.process(pid).labels = event.args.labels;
        break;
      case "process_sort_index":
        this.process(pid).sortIndex = event.args.sort_index;
        break;
      case "trace_buffer_overflowed":
        this.process(pid).traceBufferOverflowedAt = event.args.overflowed_at_ts;
        break;
      case "thread_name":
        const threadName: string = event.args.name;
        const thread = this.thread(pid, tid);
        thread.name = threadName;
        if (threadName === "CrRendererMain") {
          this.process(pid).mainThread = thread;
        } else if (threadName === "ScriptStreamerThread") {
          this.process(pid).scriptStreamerThread = thread;
        }
        break;
      case "thread_sort_index":
        this.thread(pid, tid).sortIndex = event.args.sort_index;
        break;
      case "IsTimeTicksHighResolution":
        this.process(pid).isTimeTicksHighResolution = event.args.value;
        break;
      case "TraceConfig":
        this.process(pid).traceConfig = event.args.value;
        break;
      default:
        // console.warn("unrecognized metadata:", JSON.stringify(event, null, 2));
        break;
    }
  }
}
