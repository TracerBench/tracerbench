import {
  TraceEvent,
  TraceMetadata,
  TraceStreamJson
} from '@tracerbench/trace-event';

import type {
  EventModel,
  MetadataEventModel,
  ProcessId,
  ProcessModel,
  ThreadModel,
  TraceModel
} from '../types';
import Bounds from '../util/bounds';
import Cache from '../util/cache';
import normalizeCompleteEvents from '../util/normalize-complete-events';
import EventModelImpl, { CastableEventModelImpl } from './event-model-impl';
import ProcessBuilder from './process-builder';

class TraceModelImpl implements TraceModel {
  start: number;
  end: number;
  processes: ProcessModel[];
  events: EventModel[];
  metadata: TraceMetadata;

  constructor({ start, end, events, metadata, processes }: ModelBuilder) {
    this.start = start;
    this.end = end;
    this.events = events as EventModel[];
    this.metadata = metadata || {};
    this.processes = Array.from(processes, (builder) =>
      builder.build(this)
    ).sort((a, b) => a.sortIndex - b.sortIndex);
  }

  get duration(): number {
    return this.end - this.start;
  }

  findRendererMain(): ThreadModel | undefined {
    // we find the main renderer thread with the most events
    return this.processes
      .filter((p) => p.isRenderer)
      .map((p) => p.threads.find((t) => t.isRendererMain))
      .reduce((a, b) =>
        b === undefined
          ? a
          : a === undefined
          ? b
          : b.events.length > a.events.length
          ? b
          : a
      );
  }

  toJSON(): TraceStreamJson {
    return {
      traceEvents: this.events.map((event) => event.toJSON()),
      metadata: this.metadata
    };
  }
}

export default class ModelBuilder {
  processes: Cache<ProcessId, ProcessBuilder>;
  metadata: TraceMetadata | undefined = undefined;

  bounds: Bounds | undefined = undefined;

  events: EventModelImpl[] = [];
  metadataEvents: MetadataEventModel[] = [];

  constructor() {
    this.processes = new Cache((pid: ProcessId) => new ProcessBuilder(pid));
  }

  get start(): number {
    return this.bounds?.start ?? 0;
  }

  get end(): number {
    return this.bounds?.end ?? 0;
  }

  process(pid: ProcessId): ProcessBuilder {
    return this.processes.get(pid);
  }

  extendBounds(event: CastableEventModelImpl): void {
    const { pid, start, end } = event;
    if (this.bounds === undefined) {
      this.bounds = new Bounds(start, end);
    } else {
      this.bounds.extend(start, end);
    }
    if (pid) {
      this.process(pid).extendBounds(event);
    }
  }

  addMetadata(event: MetadataEventModel): void {
    const { pid } = event;
    this.metadataEvents.push(event);
    if (pid) {
      this.process(pid).addMetadata(event);
    }
  }

  addEvent(event: CastableEventModelImpl): void {
    const { pid } = event;
    if (pid) {
      this.process(pid).addEvent(event);
    }
  }

  build(trace: TraceStreamJson | TraceEvent[]): TraceModel {
    let traceEvents: TraceEvent[];
    if (Array.isArray(trace)) {
      traceEvents = trace;
    } else {
      traceEvents = trace.traceEvents;
      this.metadata = trace.metadata;
    }

    let needsSort = false;
    let last = 0;
    const events: CastableEventModelImpl[] = (this.events = new Array(
      traceEvents.length
    ));
    for (let i = 0; i < traceEvents.length; i++) {
      const traceEvent = traceEvents[i];
      const { ts } = traceEvent;
      if (ts < last) {
        needsSort = true;
      }
      last = ts;

      const event = new EventModelImpl(traceEvent, i) as CastableEventModelImpl;

      if (event.isMetadata()) {
        this.addMetadata(event);
      } else {
        this.extendBounds(event);
      }

      events[i] = event;
    }

    if (needsSort) {
      events.sort((a, b) => {
        const cmp = a.start - b.start;
        return cmp !== 0 ? cmp : a.ord - b.ord;
      });
    }

    normalizeCompleteEvents(events, this.start, this.end);

    // at this point we shouldn't have any non B or E models
    // and events are sorted
    for (const event of events) {
      this.addEvent(event);
    }

    return new TraceModelImpl(this);
  }
}
