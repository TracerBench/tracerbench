import { Constants } from '@tracerbench/trace-event';

import type {
  EventModel,
  MetadataEventModel,
  ProcessId,
  ProcessModel,
  ThreadId,
  ThreadModel
} from '../types';
import Bounds from '../util/bounds';
import type {
  CompleteEventModelImpl,
  EventModelImplUnion
} from './event-model-impl';

class ThreadModelImpl implements ThreadModel {
  process: ProcessModel;
  id: ThreadId;
  name: string;
  sortIndex: number;
  start: number;
  end: number;
  events: EventModel[];

  constructor(
    process: ProcessModel,
    { tid, name, sortIndex, start, end, events }: ThreadBuilder
  ) {
    this.process = process;
    this.id = tid;
    this.name = name;
    this.sortIndex = sortIndex;
    this.start = start;
    this.end = end;
    this.events = events;
  }

  get duration(): number {
    return this.end - this.start;
  }

  get isRendererMain(): boolean {
    return this.name === Constants.THREAD_NAME_RENDERER_MAIN;
  }
}

export default class ThreadBuilder {
  pid: ProcessId;
  tid: ThreadId;
  bounds: Bounds | undefined = undefined;
  name = '';
  sortIndex = 0;

  events: EventModelImplUnion[] = [];
  stack: CompleteEventModelImpl[] = [];

  constructor(pid: ProcessId, tid: ThreadId) {
    this.pid = pid;
    this.tid = tid;
  }

  get start(): number {
    return this.bounds?.start ?? 0;
  }

  get end(): number {
    return this.bounds?.end ?? 0;
  }

  addMetadata(event: MetadataEventModel): void {
    switch (event.name) {
      case Constants.METADATA_NAME_THREAD_NAME:
        this.name = event.getStringArg(Constants.METADATA_ARG_NAME, '');
        break;
      case Constants.METADATA_NAME_THREAD_SORT_INDEX:
        this.sortIndex = event.getNumberArg(
          Constants.METADATA_ARG_SORT_INDEX,
          0
        );
        break;
    }
  }

  extendBounds(event: EventModelImplUnion): void {
    if (this.bounds === undefined) {
      this.bounds = new Bounds(event.start, event.end);
    } else {
      this.bounds.extend(event.start, event.end);
    }
  }

  addEvent(event: EventModelImplUnion): void {
    this.events.push(event);
    if (event.isComplete()) {
      const { stack } = this;
      const { end } = event;
      for (let i = stack.length - 1; i >= 0; i--) {
        const parent = stack[i];
        if (end <= parent.end) {
          event.parent = parent;
          break;
        } else {
          stack.pop();
        }
      }
      stack.push(event);
    }
  }

  build(process: ProcessModel): ThreadModel {
    return new ThreadModelImpl(process, this);
  }
}
