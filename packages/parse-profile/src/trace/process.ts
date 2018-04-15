import Bounds from './bounds';
import Thread from './thread';
import { ITraceEvent } from './trace_event';

export default class Process {
  threads: Thread[] = [];
  mainThread: Thread | null = null;
  scriptStreamerThread: Thread | null = null;
  bounds: Bounds = new Bounds();
  events: ITraceEvent[] = [];
  name?: string;
  labels?: string;
  sortIndex?: number;
  traceBufferOverflowedAt?: number;
  isTimeTicksHighResolution?: boolean;
  traceConfig: any;

  private threadMap: { [tid: number]: Thread } = {};

  constructor(public id: number) {}

  thread(tid: number) {
    let thread = this.threadMap[tid];
    if (thread === undefined) {
      this.threadMap[tid] = thread = new Thread(tid);
      this.threads.push(thread);
    }
    return thread;
  }

  addEvent(event: ITraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
    this.thread(event.tid).addEvent(event);
  }
}
