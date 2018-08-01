import Bounds from "./bounds";
import Thread from "./thread";
import { ITraceEvent } from "./trace_event";

export default class Process {
  public threads: Thread[] = [];
  public mainThread: Thread | null = null;
  public scriptStreamerThread: Thread | null = null;
  public bounds: Bounds = new Bounds();
  public events: ITraceEvent[] = [];
  public name?: string;
  public labels?: string;
  public sortIndex?: number;
  public traceBufferOverflowedAt?: number;
  public isTimeTicksHighResolution?: boolean;
  public traceConfig: any;

  private threadMap: { [tid: number]: Thread } = {};

  constructor(public id: number) {}

  public thread(tid: number) {
    let thread = this.threadMap[tid];
    if (thread === undefined) {
      this.threadMap[tid] = thread = new Thread(tid);
      this.threads.push(thread);
    }
    return thread;
  }

  public addEvent(event: ITraceEvent) {
    this.bounds.addEvent(event);
    this.events.push(event);
    this.thread(event.tid).addEvent(event);
  }
}
