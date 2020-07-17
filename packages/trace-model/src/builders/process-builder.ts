import { Constants } from '@tracerbench/trace-event';

import type {
  EventModel,
  MetadataEventModel,
  ProcessId,
  ProcessModel,
  ThreadId,
  ThreadModel,
  TraceModel
} from '../types';
import Bounds from '../util/bounds';
import Cache from '../util/cache';
import type { CastableEventModelImpl } from './event-model-impl';
import ThreadBuilder from './thread-builder';

class ProcessModelImpl implements ProcessModel {
  trace: TraceModel;
  id: ProcessId;
  name: string;
  labels: string;
  sortIndex: number;
  start: number;
  end: number;
  threads: ThreadModel[];
  events: EventModel[];

  constructor(
    trace: TraceModel,
    {
      pid,
      name,
      labels,
      sortIndex,
      start,
      end,
      events,
      threads
    }: ProcessBuilder
  ) {
    this.trace = trace;
    this.id = pid;
    this.name = name;
    this.labels = labels;
    this.sortIndex = sortIndex;
    this.start = start;
    this.end = end;
    this.events = events;
    this.threads = Array.from(threads, (builder) => builder.build(this));
    this.threads.sort((a, b) => a.sortIndex - b.sortIndex);
  }

  get duration(): number {
    return this.end - this.start;
  }

  get isRenderer(): boolean {
    return this.name === Constants.PROCESS_NAME_RENDERER;
  }
}

export default class ProcessBuilder {
  pid: ProcessId;
  threads: Cache<ThreadId, ThreadBuilder>;

  name = '';
  labels = '';
  sortIndex = 0;

  bounds: Bounds | undefined = undefined;

  events: CastableEventModelImpl[] = [];

  constructor(pid: ProcessId) {
    this.pid = pid;
    this.threads = new Cache((tid) => new ThreadBuilder(pid, tid));
  }

  get start(): number {
    return this.bounds?.start ?? 0;
  }

  get end(): number {
    return this.bounds?.end ?? 0;
  }

  get isRenderer(): boolean {
    return this.name === Constants.PROCESS_NAME_RENDERER;
  }

  thread(tid: ThreadId): ThreadBuilder {
    return this.threads.get(tid);
  }

  extendBounds(event: CastableEventModelImpl): void {
    const { tid, start, end } = event;
    if (this.bounds === undefined) {
      this.bounds = new Bounds(start, end);
    } else {
      this.bounds.extend(start, end);
    }
    if (tid) {
      this.thread(tid).extendBounds(event);
    }
  }

  addMetadata(event: MetadataEventModel): void {
    const { tid, name } = event;
    switch (name) {
      case Constants.METADATA_NAME_PROCESS_NAME:
        this.name = event.getStringArg(Constants.METADATA_ARG_NAME, '');
        break;
      case Constants.METADATA_NAME_PROCESS_LABELS:
        this.labels = event.getStringArg(Constants.METADATA_ARG_LABELS, '');
        break;
      case Constants.METADATA_NAME_PROCESS_SORT_INDEX:
        this.sortIndex = event.getNumberArg(
          Constants.METADATA_ARG_SORT_INDEX,
          0
        );
        break;
      default:
        if (tid) this.thread(tid).addMetadata(event);
        break;
    }
  }

  addEvent(event: CastableEventModelImpl): void {
    const { tid } = event;
    this.events.push(event);
    if (tid) {
      this.thread(tid).addEvent(event);
    }
  }

  build(trace: TraceModel): ProcessModel {
    return new ProcessModelImpl(trace, this);
  }
}
