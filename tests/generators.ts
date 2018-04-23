import { ICallFrame, ICpuProfile, ICpuProfileNode } from '../src';
import { AggregationResult, Aggregations, Loc } from '../src/cli/aggregator';

interface INode {
  child(functionName: string): CPUProfileNode;
  toJSON(): ICpuProfileNode;
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

  constructor(functionName: string = '(root)', scriptId = 0) {
    this.callFrame = {
      functionName,
      lineNumber: -1,
      columnNumber: -1,
      scriptId: 0,
      url: 'script',
    };
  }

  child(functionName: string) {
    let child = new CPUProfileNode(functionName);
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child.id);
    return child;
  }

  toJSON(): ICpuProfileNode {
    let {
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
  constructor(functionName: string) {
    super(functionName, 10);
    this.id = ++nodeId;
  }
}

export class ProfileGenerator {
  nodes: INode[] = [];
  samples: number[] = [];
  timeDeltas: number[] = [];
  root: INode;

  constructor() {
    let root = new RootCPUProfileNode();
    this.nodes.push(root);
    this.root = root;
    nodeId = 0;
  }

  start() {
    return this.root;
  }

  append(node: INode, functionName: string, delta: number) {
    let child = node.child(functionName);
    this.samples.push(child.id);
    this.nodes.push(child);
    this.timeDeltas.push(delta);
    return child;
  }

  end(): ICpuProfile {
    let {
      nodes,
      samples,
      timeDeltas,
    } = this;
    let duration = timeDeltas.reduce((accum, cur) =>  accum += cur, 0);
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

export class AggregationGenerator {
  private currentAggregation: Aggregations = {};
  aggregation(name: string) {
    let result = this.result(name);
    this.currentAggregation[name] = result;
    return result;
  }

  callsites(result: AggregationResult, multipler: number, locCB: (i: number) => Loc) {
    for (let i = 0; i < multipler; i++) {
      result.callsites.push(this.callsite(i, locCB(i)));
    }
  }

  commit() {
    let aggregation = this.currentAggregation;
    this.currentAggregation = {};

    Object.keys(aggregation).forEach(a => {
      aggregation[a].total = aggregation[a].callsites.reduce((acc, cur) => {
        return acc += cur.time;
      }, 0);
    });

    return aggregation;
  }

  private callsite(time: number, loc: Loc) {
    return {
      time,
      moduleName: 'example',
      url: 'example.com',
      loc,
    };
  }

  private result(name: string): AggregationResult {
    return {
      name,
      total: 0,
      callsites: [],
      containees: {},
      containers: {},
    };
  }
}
