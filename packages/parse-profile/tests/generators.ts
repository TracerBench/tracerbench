import { ICallFrame, ICpuProfile, ICpuProfileNode, ITraceEvent, TRACE_EVENT_NAME, TRACE_EVENT_PHASE } from '../src';
import { Archive } from '../src/cli/archive_trace';

interface INode {
  child(options: OptionalCallFrame): CPUProfileNode;
  toJSON(): ICpuProfileNode;
}

interface OptionalCallFrame {
  functionName?: string;
  scriptId?: string | number;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
}

let nodeId = 0;
class RootCPUProfileNode implements INode {
  id = nodeId;
  callFrame: ICallFrame;
  children?: number[];
  sampleCount: number = 0;
  min: number = -1;
  max: number = -1;
  total: number = 0;
  self: number = 0;

  constructor(options?: OptionalCallFrame) {
    this.callFrame = {
      functionName: '(root)',
      lineNumber: -1,
      columnNumber: -1,
      scriptId: 0,
      url: 'script',
    };
    Object.assign(this.callFrame, options);
  }

  child(options: OptionalCallFrame) {
    if (options.functionName !== undefined) {
      let child = new CPUProfileNode(options);
      if (!this.children) {
        this.children = [];
      }
      this.children.push(child.id);
      return child;
    }
    throw Error('Must provide function name for new child node');
  }

  toJSON(): ICpuProfileNode {
    let { id, callFrame, self, max, min, children, sampleCount, total } = this;
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
  constructor(options?: OptionalCallFrame) {
    super(options);
    this.id = ++nodeId;
  }
}

export class ProfileGenerator {
  nodes: INode[] = [];
  samples: number[] = [];
  timeDeltas: number[] = [];
  root: INode;
  events: ITraceEvent[] = [];
  curTime: number = 0;
  lastAppend: number = 0;

  constructor() {
    nodeId = 0;
    let root = new RootCPUProfileNode();
    this.nodes.push(root);
    this.root = root;
  }

  start() {
    return this.root;
  }

  tick(delta: number) {
    this.curTime += delta;
  }

  appendNode(node: INode, options: OptionalCallFrame) {
    const child = node.child(options);
    this.samples.push(child.id);
    this.nodes.push(child);

    this.timeDeltas.push(this.curTime - this.lastAppend);
    this.lastAppend = this.curTime;

    return child;
  }

  appendSample(node: CPUProfileNode) {
    this.samples.push(node.id);

    this.timeDeltas.push(this.curTime - this.lastAppend);
    this.lastAppend = this.curTime;
  }

  appendRenderEvent(name: string, duration: number) {
    let event: ITraceEvent;
    event = {
      pid: -1,
      tid: -1,
      ts: this.curTime,
      ph: TRACE_EVENT_PHASE.COMPLETE,
      dur: duration,
      cat: '',
      name,
      args: {},
    };
    this.events.push(event);
  }

  appendEvent(name: TRACE_EVENT_NAME, isStart: boolean) {
    let event: ITraceEvent;
    if (name === TRACE_EVENT_NAME.V8_EXECUTE) {
      event = {
        pid: -1,
        tid: -1,
        ts: this.curTime,
        ph: isStart ? TRACE_EVENT_PHASE.BEGIN : TRACE_EVENT_PHASE.END,
        cat: '',
        name,
        args: {},
      };
    } else throw Error('Trying to create an unknown event in test');
    this.events.push(event);
  }

  end(): ICpuProfile {
    let { nodes, samples, timeDeltas } = this;
    let duration = timeDeltas.reduce((accum, cur) => (accum += cur), 0);
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
  generate(methods: string[][]) {
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
  generate(content: string = ''): Archive {
    return {
      log: {
        entries: [
          {
            request: { url: 'https://www.example.com/a.js' },
            response: {
              content: {
                text: content,
              },
            },
          },
        ],
      },
    };
  }
}
