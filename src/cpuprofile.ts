import { ITraceEvent } from './trace';
import { hierarchy, HierarchyNode } from 'd3-hierarchy';

export interface ICpuProfileEvent extends ITraceEvent {
  ph: 'I';
  name: 'CpuProfile';
  args: {
    data: {
      cpuProfile: ICpuProfile;
    };
  };
}

export interface ICpuProfile {
  nodes: IProfileNode[];
  /**
   * startTime in microseconds of CPU profile
   */
  startTime: number;
  endTime: number;

  /**
   * id of root node
   */
  samples: number[];

  /**
   * offset from startTime if first or previous time
   */
  timeDeltas: number[];
}

export const enum Constants {
  ROOT_FUNCTION_NAME = '(root)',
  PROGRAM_FUNCTION_NAME = '(program)',
  IDLE_FUNCTION_NAME = '(idle)',
  GC_FUNCTION_NAME = '(garbage collector)',
  NATIVE_SCRIPT_ID = '0',
}

export interface IProfileNode {
  id: number;
  callFrame: {
    functionName: string;
    scriptId: string;
    url: string;
    lineNumber: number;
    columnNumber: number;
  };
  hitCount: number;
  children?: number[];
  positionTicks?: {
    line: number;
    ticks: number;
  };

  sampleCount: number;

  min: number;
  max: number;

  total: number;
  self: number;
}

export default class CpuProfile {
  profile: ICpuProfile;

  /**
   * total hitCount of nodes.
   */
  hitCount: number;

  /**
   * Node by node id.
   */
  nodes: Map<number, IProfileNode>;

  samples: ISample[];

  /**
   * Root parent
   */
  root?: IProfileNode;

  /**
   * Program node
   */
  program?: IProfileNode;

  /**
   * Idle node
   */
  idle?: IProfileNode;

  /**
   * GC node
   */
  gc?: IProfileNode;

  start: number;
  end: number;
  duration: number;

  hierarchy: HierarchyNode<IProfileNode>;

  private parentLinks: Map<IProfileNode, IProfileNode>;
  private childrenLinks: Map<IProfileNode, IProfileNode[]>;

  constructor(profile: ICpuProfile) {
    this.profile = profile;

    let parentLinks = (this.parentLinks = new Map<IProfileNode, IProfileNode>());
    let childrenLinks = (this.childrenLinks = new Map<IProfileNode, IProfileNode[]>());

    let nodes = profile.nodes;

    let nodeMap = (this.nodes = mapAndLinkNodes(nodes, parentLinks, childrenLinks));

    let hitCount = 0;

    let root: IProfileNode | undefined;
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      hitCount += node.hitCount;

      if (node.callFrame.scriptId === Constants.NATIVE_SCRIPT_ID) {
        switch (node.callFrame.functionName) {
          case Constants.ROOT_FUNCTION_NAME:
            root = node;
            break;
          case Constants.PROGRAM_FUNCTION_NAME:
            this.program = node;
            break;
          case Constants.IDLE_FUNCTION_NAME:
            this.idle = node;
            break;
          case Constants.GC_FUNCTION_NAME:
            this.gc = node;
            break;
        }
      }
    }

    this.hitCount = hitCount;

    this.samples = mapSamples(profile, nodeMap);

    if (root === undefined) {
      throw new Error('missing root node in profile');
    }

    this.root = root;

    computeTimes(root, childrenLinks);

    let start = (this.start = profile.startTime);
    let end = (this.end = root.max);
    this.duration = end - start;

    this.hierarchy = hierarchy(root, node => {
      let children = childrenLinks.get(node);
      if (children) {
        return root === node ? children.filter(n => !isMetaNode(n)) : children;
      }
      return null;
    });
  }

  parent(node: IProfileNode) {
    return this.parentLinks.get(node);
  }

  children(node: IProfileNode) {
    return this.childrenLinks.get(node);
  }

  node(id: number) {
    let n = this.nodes.get(id);
    if (n === undefined) throw new Error(`invalid node id: ${id}`);
    return n;
  }

  static from(traceEvent: ITraceEvent | undefined) {
    if (isCpuProfile(traceEvent)) {
      return new CpuProfile(traceEvent.args.data.cpuProfile);
    }
  }
}

function isCpuProfile(traceEvent: ITraceEvent | undefined): traceEvent is ICpuProfileEvent {
  return traceEvent !== undefined && traceEvent.ph === 'I' && traceEvent.name === 'CpuProfile';
}

function mapAndLinkNodes(
  nodes: IProfileNode[],
  parentLinks: Map<IProfileNode, IProfileNode>,
  childrenLinks: Map<IProfileNode, IProfileNode[]>
) {
  let nodeMap = new Map<number, IProfileNode>();
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    // initialize our extensions
    node.min = -1;
    node.max = -1;
    node.sampleCount = 0;
    node.self = 0;
    nodeMap.set(node.id, node);
  }

  linkNodes(nodes, nodeMap, parentLinks, childrenLinks);
  return nodeMap;
}

function linkNodes(
  nodes: IProfileNode[],
  nodeMap: Map<number, IProfileNode>,
  parentLinks: Map<IProfileNode, IProfileNode>,
  childrenLinks: Map<IProfileNode, IProfileNode[]>
) {
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    linkChildren(node, nodeMap, parentLinks, childrenLinks);
  }
}

function linkChildren(
  parent: IProfileNode,
  nodeMap: Map<number, IProfileNode>,
  parentLinks: Map<IProfileNode, IProfileNode>,
  childrenLinks: Map<IProfileNode, IProfileNode[]>
) {
  let childIds = parent.children;
  if (childIds === undefined) return;

  let children: IProfileNode[] = new Array(childIds.length);
  for (let i = 0; i < childIds.length; i++) {
    let child = nodeMap.get(childIds[i])!;
    children[i] = child;
    parentLinks.set(child, parent);
  }
  childrenLinks.set(parent, children);
}

function mapSamples(profile: ICpuProfile, nodeMap: Map<number, IProfileNode>) {
  let sampleIds = profile.samples;
  let samples: ISample[] = new Array(sampleIds.length);
  // deltas can be negative and samples out of order
  let timeDeltas = profile.timeDeltas;
  let last = profile.startTime;
  for (let i = 0; i < sampleIds.length; i++) {
    let node = nodeMap.get(sampleIds[i])!;
    let timestamp = last + timeDeltas[i];
    samples[i] = {
      node,
      delta: 0,
      timestamp,
      prev: null,
      next: null,
    };
    last = timestamp;

    node.sampleCount++;
  }

  samples.sort((a, b) => a.timestamp - b.timestamp);

  let prev: ISample | null = null;

  for (let i = 0; i < samples.length; i++) {
    let sample = samples[i];
    let timestamp = sample.timestamp;

    if (prev === null) {
      sample.delta = timestamp - profile.startTime;
    } else {
      prev.next = sample;
      sample.delta = timestamp - prev.timestamp;
      sample.prev = prev;
    }

    let node = sample.node;
    if (node.min === -1) {
      node.min = timestamp;
    }

    node.self += sample.delta;

    node.max = timestamp;
    prev = sample;
  }

  return samples;
}

function computeTimes(node: IProfileNode, childrenMap: Map<IProfileNode, IProfileNode[]>) {
  let children = childrenMap.get(node);
  let childTotal = 0;
  let min = node.min;
  let max = node.max;
  if (children !== undefined) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      computeTimes(child, childrenMap);
      childTotal += child.total;

      min = min === -1 ? child.min : Math.min(min, child.min);
      max = max === -1 ? child.max : Math.max(max, child.max);
    }
    children.sort((a, b) => a.min - b.min);
  }
  node.min = min;
  node.max = max;
  node.total = node.self + childTotal;
}

export function isMetaNode(node: IProfileNode) {
  switch (node.callFrame.functionName) {
    case Constants.ROOT_FUNCTION_NAME:
    case Constants.PROGRAM_FUNCTION_NAME:
    case Constants.IDLE_FUNCTION_NAME:
    case Constants.GC_FUNCTION_NAME:
      return true;
  }
  return false;
}

interface ISample {
  delta: number;
  timestamp: number;
  prev: ISample | null;
  next: ISample | null;

  node: IProfileNode;
}
