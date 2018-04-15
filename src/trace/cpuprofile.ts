import { hierarchy, HierarchyNode } from 'd3-hierarchy';
import {
  FUNCTION_NAME,
  ICpuProfile,
  ICpuProfileEvent,
  ICpuProfileNode,
  ISample,
  ITraceEvent,
  TRACE_EVENT_NAME,
  TRACE_EVENT_PHASE,
} from './trace_event';

export default class CpuProfile {
  profile: ICpuProfile;

  /**
   * Node by node id.
   */
  nodes: Map<number, ICpuProfileNode>;

  samples: ISample[];

  /**
   * Root parent
   */
  root?: ICpuProfileNode;

  /**
   * Program node
   */
  program?: ICpuProfileNode;

  /**
   * Idle node
   */
  idle?: ICpuProfileNode;

  /**
   * GC node
   */
  gc?: ICpuProfileNode;

  start: number;
  end: number;
  duration: number;

  hierarchy: HierarchyNode<ICpuProfileNode>;

  private parentLinks: Map<ICpuProfileNode, ICpuProfileNode>;
  private childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>;

  constructor(profile: ICpuProfile, min: number, max: number) {
    this.profile = profile;

    const parentLinks = (this.parentLinks = new Map<ICpuProfileNode, ICpuProfileNode>());
    const childrenLinks = (this.childrenLinks = new Map<ICpuProfileNode, ICpuProfileNode[]>());

    const nodes = profile.nodes;

    const nodeMap = (this.nodes = mapAndLinkNodes(nodes, parentLinks, childrenLinks));

    let root: ICpuProfileNode | undefined;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.callFrame.scriptId === 0 || node.callFrame.scriptId === '0') {
        switch (node.callFrame.functionName) {
          case FUNCTION_NAME.ROOT:
            root = node;
            break;
          case FUNCTION_NAME.PROGRAM:
            this.program = node;
            break;
          case FUNCTION_NAME.IDLE:
            this.idle = node;
            break;
          case FUNCTION_NAME.GC:
            this.gc = node;
            break;
        }
      }
    }

    this.samples = mapSamples(profile, nodeMap, min, max);

    if (root === undefined) {
      throw new Error('missing root node in profile');
    }

    this.root = root;

    computeTimes(root, childrenLinks);

    const start = (this.start = profile.startTime);
    const end = (this.end = root.max);
    this.duration = end - start;

    this.hierarchy = hierarchy(root, node => {
      const children = childrenLinks.get(node);
      if (children) {
        return root === node ? children.filter(n => !isMetaNode(n)) : children;
      }
      return null;
    });
  }

  parent(node: ICpuProfileNode) {
    return this.parentLinks.get(node);
  }

  children(node: ICpuProfileNode) {
    return this.childrenLinks.get(node);
  }

  node(id: number) {
    const n = this.nodes.get(id);
    if (n === undefined) throw new Error(`invalid node id: ${id}`);
    return n;
  }
}

function isCpuProfile(traceEvent: ITraceEvent | undefined): traceEvent is ICpuProfileEvent {
  return traceEvent !== undefined && traceEvent.ph === 'I' && traceEvent.name === 'CpuProfile';
}

function mapAndLinkNodes(
  nodes: ICpuProfileNode[],
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>,
) {
  const nodeMap = new Map<number, ICpuProfileNode>();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
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
  nodes: ICpuProfileNode[],
  nodeMap: Map<number, ICpuProfileNode>,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>,
) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    linkChildren(node, nodeMap, parentLinks, childrenLinks);
  }
}

function linkChildren(
  parent: ICpuProfileNode,
  nodeMap: Map<number, ICpuProfileNode>,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>,
) {
  const childIds = parent.children;
  if (childIds === undefined) return;

  const children: ICpuProfileNode[] = new Array(childIds.length);
  for (let i = 0; i < childIds.length; i++) {
    const child = nodeMap.get(childIds[i])!;
    children[i] = child;
    parentLinks.set(child, parent);
  }
  childrenLinks.set(parent, children);
}

function mapSamples(
  profile: ICpuProfile,
  nodeMap: Map<number, ICpuProfileNode>,
  min: number,
  max: number,
) {
  const sampleIds = profile.samples;
  const samples: ISample[] = new Array(sampleIds.length);
  // deltas can be negative and samples out of order
  const timeDeltas = profile.timeDeltas;
  let last = profile.startTime;
  for (let i = 0; i < sampleIds.length; i++) {
    const node = nodeMap.get(sampleIds[i])!;
    const timestamp = last + timeDeltas[i];
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
    const sample = samples[i];
    const timestamp = sample.timestamp;

    if (prev === null) {
      sample.delta = timestamp - profile.startTime;
    } else {
      prev.next = sample;
      sample.delta = timestamp - prev.timestamp;
      sample.prev = prev;
    }

    if (min < timestamp && (max > timestamp || max === -1)) {
      const node = sample.node;
      if (node.min === -1) {
        node.min = timestamp;
      }

      node.self += sample.delta;
      node.max = timestamp;
    }

    prev = sample;
  }

  return samples;
}

function computeTimes(node: ICpuProfileNode, childrenMap: Map<ICpuProfileNode, ICpuProfileNode[]>) {
  const children = childrenMap.get(node);
  let childTotal = 0;
  let min = node.min;
  let max = node.max;
  if (children !== undefined) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
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

export function isMetaNode(node: ICpuProfileNode) {
  switch (node.callFrame.functionName) {
    case FUNCTION_NAME.ROOT:
    case FUNCTION_NAME.IDLE:
      return true;
  }
  return false;
}
