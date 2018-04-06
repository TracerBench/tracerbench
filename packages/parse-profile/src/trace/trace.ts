import binsearch from 'array-binsearch';
import Bounds from './bounds';
import Process from './process';
import Thread from './thread';
import CpuProfile, { ICpuProfile } from '../cpuprofile';

import {
  ITraceEvent,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_END,
  TRACE_EVENT_PHASE_METADATA,
} from './trace_event';

import traceEventComparator from './trace_event_comparator';

export default class Trace {
  public processes: Process[] = [];
  public mainProcess?: Process;
  public bounds: Bounds = new Bounds();
  public events: ITraceEvent[] = [];
  public browserProcess: Process | null = null;
  public gpuProcess: Process | null = null;
  public rendererProcesses: Process[] = [];
  public numberOfProcessors?: number;
  public cpuProfileEvent?: ITraceEvent;
  public lastTracingStartedInPageEvent?: ITraceEvent;

  private _cpuProfile?: CpuProfile;
  private parents = new Map<ITraceEvent, ITraceEvent>();
  private stack: ITraceEvent[] = [];

  public cpuProfile(min: number, max: number): CpuProfile | undefined {
    if (this._cpuProfile) return this._cpuProfile;
    if (this._cpuProfile === undefined && this.cpuProfileEvent !== undefined) {
      this._cpuProfile = CpuProfile.from(this.cpuProfileEvent, min, max);
    }
    return this._cpuProfile;
  }

  public process(pid: number): Process {
    let process = this.findProcess(pid);
    if (process === undefined) {
      process = new Process(pid);
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
    if (this.stack.length > 0) {
      /* tslint:disable:no-console */
      console.error('trace has incomplete B phase events');
      this.stack.length = 0;
    }
    for (const event of events) {
      this.associateParent(event);
      const process = this.process(event.pid);

      process.addEvent(event);

      if (event.ph === 'I' && event.cat === 'disabled-by-default-devtools.timeline') {
        if (event.name === 'CpuProfile') {
          this.cpuProfileEvent = event;
        } else if (event.name === 'TracingStartedInPage') {
          this.lastTracingStartedInPageEvent = event;
        }
      }
    }

    // determine main process
    if (this.lastTracingStartedInPageEvent) {
      // if this was recorded with the Performance tab, this should be the main process
      this.mainProcess = this.process(this.lastTracingStartedInPageEvent.pid);
    } else if (this.cpuProfileEvent) {
      // the process with a CPU profile
      this.mainProcess = this.process(this.cpuProfileEvent.pid);
    } else {
      // fallback to Renderer process with most events
      this.mainProcess = this.processes
        .filter(p => p.name === 'Renderer')
        .reduce((a, b) => (b.events.length > a.events.length ? b : a));
    }
  }

  public getParent(event: ITraceEvent) {
    this.parents.get(event);
  }

  private associateParent(event: ITraceEvent) {
    if (event.ph !== TRACE_EVENT_PHASE_COMPLETE) {
      return;
    }
    const { stack, parents } = this;
    const { ts, pid, tid } = event;
    for (let i = stack.length - 1; i >= 0; i--) {
      const parent = stack[i];
      if (ts < parent.ts + parent.dur!) {
        if (parent.pid === pid && parent.tid === tid) {
          parents.set(event, parent);
          break;
        }
      } else {
        stack.splice(i, 1);
      }
    }
    stack.push(event);
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
      this.stack.push(event);
    }
    this.bounds.addEvent(event);
  }

  private findProcess(pid: number): Process | undefined {
    for (const process of this.processes) {
      if (process.id === pid) {
        return process;
      }
    }
    return;
  }

  private endEvent(end: ITraceEvent) {
    const { stack } = this;
    for (let i = stack.length - 1; i >= 0; i--) {
      const begin = stack[i];
      if (
        begin.name === end.name &&
        begin.cat === end.cat &&
        begin.tid === end.tid &&
        begin.pid === end.pid
      ) {
        stack.splice(i, 1);
        return this.completeEvent(begin, end);
      }
    }
    throw new Error('could not find matching B phase for E phase event');
  }

  private completeEvent(begin: ITraceEvent, end: ITraceEvent) {
    let args: { [key: string]: any } | '__stripped__' = '__stripped__';
    if (typeof begin.args === 'object' && begin.args !== null) {
      args = Object.assign({}, begin.args);
    }
    if (typeof end.args === 'object' && end.args !== null) {
      args = Object.assign(args === undefined ? {} : args, end.args);
    }

    const complete: ITraceEvent = {
      args,
      cat: begin.cat,
      dur: end.ts - begin.ts,
      name: begin.name,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      pid: begin.pid,
      tdur: end.tts! - begin.tts!,
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
    if (event.args === '__stripped__') {
      return;
    }
    switch (event.name) {
      case 'num_cpus':
        this.numberOfProcessors = event.args.number;
        break;
      case 'process_name':
        const processName: string = event.args.name;
        const process = this.process(pid);
        process.name = processName;
        if (processName === 'GPU Process') {
          this.gpuProcess = process;
        } else if (processName === 'Browser') {
          this.browserProcess = process;
        } else if (processName === 'Renderer') {
          this.rendererProcesses.push(process);
        }
        break;
      case 'process_labels':
        this.process(pid).labels = event.args.labels;
        break;
      case 'process_sort_index':
        this.process(pid).sortIndex = event.args.sort_index;
        break;
      case 'trace_buffer_overflowed':
        this.process(pid).traceBufferOverflowedAt = event.args.overflowed_at_ts;
        break;
      case 'thread_name':
        const threadName: string = event.args.name;
        const thread = this.thread(pid, tid);
        thread.name = threadName;
        if (threadName === 'CrRendererMain') {
          this.process(pid).mainThread = thread;
        } else if (threadName === 'ScriptStreamerThread') {
          this.process(pid).scriptStreamerThread = thread;
        }
        break;
      case 'thread_sort_index':
        this.thread(pid, tid).sortIndex = event.args.sort_index;
        break;
      case 'IsTimeTicksHighResolution':
        this.process(pid).isTimeTicksHighResolution = event.args.value;
        break;
      case 'TraceConfig':
        this.process(pid).traceConfig = event.args.value;
        break;
      default:
        //console.warn("unrecognized metadata:", JSON.stringify(event, null, 2));
        break;
    }
  }
}
