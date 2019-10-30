// tslint:disable:max-classes-per-file
import { Archive } from '@tracerbench/har';

import {
  ICallFrame,
  ICpuProfile,
  ICpuProfileNode,
  ITraceEvent,
  TRACE_EVENT_NAME,
  TRACE_EVENT_PHASE_COMPLETE,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_END,
} from '../../src/trace/trace_event';

interface INode {
  child(options: IOptionalCallFrame): CPUProfileNode;
  toJSON(): ICpuProfileNode;
}

interface IOptionalCallFrame {
  functionName?: string;
  scriptId?: string | number;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
}

let nodeId = 0;
class RootCPUProfileNode implements INode {
  public id = nodeId;
  public callFrame: ICallFrame;
  public children?: number[];
  public sampleCount: number = 0;
  public min: number = -1;
  public max: number = -1;
  public total: number = 0;
  public self: number = 0;

  constructor(options?: IOptionalCallFrame) {
    this.callFrame = {
      functionName: '(root)',
      lineNumber: -1,
      columnNumber: -1,
      scriptId: 0,
      url: 'script',
    };
    (Object as any).assign(this.callFrame, options);
  }

  public child(options: IOptionalCallFrame) {
    if (options.functionName !== undefined) {
      const child = new CPUProfileNode(options);
      if (!this.children) {
        this.children = [];
      }
      this.children.push(child.id);
      return child;
    }
    throw Error('Must provide function name for new child node');
  }

  public toJSON(): ICpuProfileNode {
    const {
      id,
      callFrame,
      self,
      max,
      min,
      children,
      sampleCount,
      total,
    } = this;
    return {
      id,
      callFrame,
      self,
      min,
      max,
      children,
      sampleCount,
      total,
    };
  }
}

class CPUProfileNode extends RootCPUProfileNode {
  constructor(options?: IOptionalCallFrame) {
    super(options);
    this.id = ++nodeId;
  }
}

export class ProfileGenerator {
  public nodes: INode[] = [];
  public samples: number[] = [];
  public timeDeltas: number[] = [];
  public root: INode;
  public events: ITraceEvent[] = [];
  public curTime: number = 0;
  public lastAppend: number = 0;

  constructor() {
    nodeId = 0;
    const root = new RootCPUProfileNode();
    this.nodes.push(root);
    this.root = root;
  }

  public start() {
    return this.root;
  }

  public tick(delta: number) {
    this.curTime += delta;
  }

  public appendNode(node: INode, options: IOptionalCallFrame) {
    const child = node.child(options);
    this.samples.push(child.id);
    this.nodes.push(child);

    this.timeDeltas.push(this.curTime - this.lastAppend);
    this.lastAppend = this.curTime;

    return child;
  }

  public appendSample(node: CPUProfileNode) {
    this.samples.push(node.id);

    this.timeDeltas.push(this.curTime - this.lastAppend);
    this.lastAppend = this.curTime;
  }

  public appendRenderEvent(name: string, duration: number) {
    let event: ITraceEvent;
    event = {
      pid: -1,
      tid: -1,
      ts: this.curTime,
      ph: TRACE_EVENT_PHASE_COMPLETE,
      dur: duration,
      cat: '',
      name,
      args: {},
    };
    this.events.push(event);
  }

  public appendEvent(name: TRACE_EVENT_NAME, isStart: boolean) {
    let event: ITraceEvent;
    if (name === TRACE_EVENT_NAME.V8_EXECUTE) {
      event = {
        pid: -1,
        tid: -1,
        ts: this.curTime,
        ph: isStart ? TRACE_EVENT_PHASE_BEGIN : TRACE_EVENT_PHASE_END,
        cat: '',
        name,
        args: {},
      };
    } else {
      throw Error('Trying to create an unknown event in test');
    }
    this.events.push(event);
  }

  public end(): ICpuProfile {
    const { nodes, samples, timeDeltas } = this;
    const duration = timeDeltas.reduce((accum, cur) => (accum += cur), 0);
    return {
      startTime: 0,
      endTime: duration,
      duration,
      timeDeltas,
      nodes: nodes.map(node => node.toJSON()),
      samples,
    };
  }
}

export class LocatorGenerator {
  public generate(methods: string[][]) {
    return methods.map(m => {
      return {
        functionName: m[0],
        functionNameRegex: new RegExp(`^${m[0]}$`),
        moduleName: m[1],
        moduleNameRegex: new RegExp(`^${m[1]}$`),
      };
    });
  }
}

export class ArchiveGenerator {
  public generate(content: string = ''): Archive {
    return {
      log: {
        version: '0.0.0',
        creator: {
          name: 'TracerBench',
          version: '0.0.0',
        },
        entries: [
          {
            request: {
              url: 'https://www.example.com/a.js',
              method: '',
              httpVersion: '',
              cookies: [],
              headers: [],
              queryString: [],
              headersSize: 0,
              bodySize: 0,
            },
            response: {
              status: 0,
              statusText: '',
              httpVersion: '',
              cookies: [],
              headers: [],
              redirectURL: '',
              headersSize: 0,
              bodySize: 0,
              content: {
                text: content,
                size: 0,
                mimeType: '',
              },
            },
            time: 0,
            cache: {},
            timings: {
              send: 0,
              wait: 0,
              receive: 0,
            },
            startedDateTime: '',
          },
        ],
      },
    };
  }
}
