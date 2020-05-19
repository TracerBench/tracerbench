import { hierarchy, HierarchyNode } from 'd3-hierarchy';

import {
  FUNCTION_NAME,
  ICpuProfile,
  ICpuProfileNode,
  IProfileNode,
  ISample,
  ITraceEvent,
  TRACE_EVENT_NAME,
  TRACE_EVENT_PHASE_BEGIN,
  TRACE_EVENT_PHASE_END
} from './index';
import { addRenderNodes } from './render-events';
import { TRACE_EVENT_PHASE_COMPLETE } from './trace-event';

export default class CpuProfile {
  public profile: ICpuProfile;

  /**
   * Node by node id.
   */
  public nodeMap: Map<number, ICpuProfileNode>;

  public samples: ISample[];

  /**
   * Root parent
   */
  public root?: ICpuProfileNode;

  public start: number;
  public end: number;
  public duration: number;

  public hierarchy: HierarchyNode<ICpuProfileNode>;

  private parentLinks: Map<ICpuProfileNode, ICpuProfileNode>;
  private childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>;

  constructor(
    profile: ICpuProfile,
    events: ITraceEvent[],
    min: number,
    max: number
  ) {
    this.profile = profile;

    const parentLinks = (this.parentLinks = new Map<
      ICpuProfileNode,
      ICpuProfileNode
    >());
    const childrenLinks = (this.childrenLinks = new Map<
      ICpuProfileNode,
      ICpuProfileNode[]
    >());

    const nodes = profile.nodes;
    initNodes(nodes);
    const nodeMap = mapAndLinkNodes(nodes, parentLinks, childrenLinks);

    const originalRoot: ICpuProfileNode | undefined = nodes.find((node) => {
      return (
        node.callFrame.scriptId === 0 ||
        (node.callFrame.scriptId === '0' &&
          node.callFrame.functionName === FUNCTION_NAME.ROOT)
      );
    });
    if (originalRoot === undefined) {
      throw new Error('Missing root node in original profile');
    }
    this.samples = absoluteSamples(profile, nodeMap);
    const { expandedRoot, expandedNodeMap } = expandAndFix(
      this.samples,
      profile,
      events,
      min,
      max,
      parentLinks,
      childrenLinks,
      originalRoot
    );
    this.root = expandedRoot;
    this.nodeMap = expandedNodeMap;

    const start = (this.start = profile.startTime);
    const end = (this.end = expandedRoot.max);
    this.duration = end - start;

    this.hierarchy = hierarchy(expandedRoot, (node) => {
      const children = childrenLinks.get(node);
      if (children) {
        return expandedRoot === node
          ? children.filter((n) => !isMetaNode(n))
          : children;
      }
      return null;
    });

    // Make child iteration easier
    this.hierarchy.each((node) => {
      if (node.children === undefined) {
        node.children = [];
      }
    });

    addRenderNodes(this.hierarchy, events);
  }

  public parent(node: ICpuProfileNode): ICpuProfileNode | undefined {
    return this.parentLinks.get(node);
  }

  public children(node: ICpuProfileNode): ICpuProfileNode[] | undefined {
    return this.childrenLinks.get(node);
  }

  public node(id: number): ICpuProfileNode {
    const n = this.nodeMap.get(id);
    if (n === undefined) {
      throw new Error(`invalid node id: ${id}`);
    }
    return n;
  }
}

export function getChildren(
  node: HierarchyNode<ICpuProfileNode>
): HierarchyNode<ICpuProfileNode>[] {
  if (node.children === undefined) {
    throw new Error('Node had undefined children');
  }
  return node.children;
}

function expandAndFix(
  samples: ISample[],
  profile: ICpuProfile,
  events: ITraceEvent[],
  min: number,
  max: number,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>,
  root: ICpuProfileNode
): {
  expandedRoot: ICpuProfileNode;
  expandedNodeMap: Map<number, ICpuProfileNode>;
} {
  const { expandedNodes, orig2ExpNodes } = expandNodes(
    samples,
    events,
    min,
    max,
    parentLinks
  );
  profile.nodes = expandedNodes;
  parentLinks.clear();
  childrenLinks.clear();

  const expandedNodeMap = mapAndLinkNodes(
    expandedNodes,
    parentLinks,
    childrenLinks
  );

  if (!orig2ExpNodes.has(root.id)) {
    throw new Error('Missing root node in expanded profile');
  }
  return { expandedRoot: orig2ExpNodes.get(root.id)![0], expandedNodeMap };
}

function initNodes(nodes: ICpuProfileNode[]): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // initialize our extensions
    node.min = -1;
    node.max = -1;
    node.sampleCount = 0;
    node.self = 0;
  }
}

function mapAndLinkNodes(
  nodes: ICpuProfileNode[],
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>
): Map<number, ICpuProfileNode> {
  const nodeMap = new Map<number, ICpuProfileNode>();
  for (let i = 0; i < nodes.length; i++) {
    nodeMap.set(nodes[i].id, nodes[i]);
  }

  linkNodes(nodes, nodeMap, parentLinks, childrenLinks);
  return nodeMap;
}

function linkNodes(
  nodes: ICpuProfileNode[],
  nodeMap: Map<number, ICpuProfileNode>,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>
): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    linkChildren(node, nodeMap, parentLinks, childrenLinks);
  }
}

function linkChildren(
  parent: ICpuProfileNode,
  nodeMap: Map<number, ICpuProfileNode>,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  childrenLinks: Map<ICpuProfileNode, ICpuProfileNode[]>
): void {
  const childIds = parent.children;
  if (childIds === undefined) {
    return;
  }
  const children: ICpuProfileNode[] = new Array(childIds.length);
  for (let i = 0; i < childIds.length; i++) {
    const child = nodeMap.get(childIds[i])!;
    children[i] = child;
    parentLinks.set(child, parent);
  }
  childrenLinks.set(parent, children);
}

function absoluteSamples(
  profile: ICpuProfile,
  nodeMap: Map<number, ICpuProfileNode>
): ISample[] {
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
      next: null
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
    prev = sample;
  }

  return samples;
}

function expandNodes(
  samples: ISample[],
  events: ITraceEvent[],
  min: number,
  max: number,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>
): {
  expandedNodes: ICpuProfileNode[];
  orig2ExpNodes: Map<number, ICpuProfileNode[]>;
} {
  const expandedNodes: ICpuProfileNode[] = [];
  const orig2ExpNodes = new Map<number, ICpuProfileNode[]>();
  const state: IExpState = {
    lastSampleTS: -1,
    stack: [],
    origId2activeIndex: new Map<number, number>(),
    expId2origId: new Map<number, number>()
  };

  let begin: ITraceEvent | undefined;
  let from = -1;
  let to = -1;

  let sampleIndex = 0;
  let eventIndex = 0;

  while (sampleIndex < samples.length) {
    // move through events until we have an executing range
    for (; eventIndex < events.length; eventIndex++) {
      const event = events[eventIndex];
      if (begin !== undefined) {
        if (
          event.ph === TRACE_EVENT_PHASE_END &&
          event.pid === begin.pid &&
          event.tid === begin.tid &&
          event.cat === begin.cat &&
          event.name === begin.name
        ) {
          begin = undefined;
          to = event.ts;
        }
      } else if (from === -1) {
        if (event.name === TRACE_EVENT_NAME.V8_EXECUTE) {
          if (event.ph === TRACE_EVENT_PHASE_BEGIN) {
            begin = event;
            from = event.ts;
            to = -1;
          } else if (event.ph === TRACE_EVENT_PHASE_COMPLETE) {
            from = event.ts;
            to = event.ts + event.dur!;
          }
        }
      } else if (event.ts > to) {
        break;
      }
    }

    // we should be just after `to` or out of events
    // if we don't have a from/to then this will drain samples and exit
    for (; sampleIndex < samples.length; sampleIndex++) {
      // process samples in execute range
      const sample = samples[sampleIndex];
      if (to !== -1 && sample.timestamp > to) {
        // end executing
        endExecute(state, to);
        from = to = -1;
        break;
      } else if (
        from !== -1 &&
        sample.timestamp > from &&
        !isOutOfBounds(sample.timestamp, min, max)
      ) {
        processSample(sample, orig2ExpNodes, parentLinks, expandedNodes, state);
      }
    }
  }

  if (to !== -1) {
    endExecute(state, to);
  }

  terminateNodes(state.stack, state.lastSampleTS, state);
  return { expandedNodes, orig2ExpNodes };
}

function isOutOfBounds(ts: number, min: number, max: number): boolean {
  return ts < min || (max !== -1 && ts > max);
}

function terminateNodes(
  toTerminate: ICpuProfileNode[],
  ts: number,
  state: IExpState
): void {
  toTerminate.forEach((node) => {
    state.origId2activeIndex.delete(state.expId2origId.get(node.id)!);
    state.expId2origId.delete(node.id);
    node.max = ts;
  });
}

function activateNodes(
  toActivate: ICpuProfileNode[],
  state: IExpState,
  ts: number,
  newNodes: ICpuProfileNode[],
  orig2ExpNodes: Map<number, ICpuProfileNode[]>
): void {
  const { stack, origId2activeIndex, expId2origId } = state;
  let parent = stack[stack.length - 1];

  for (let i = toActivate.length - 1; i >= 0; i--) {
    const oldNode = toActivate[i];
    // IProfileNode type gives access to the .parent attribute
    const newNode: ICpuProfileNode & IProfileNode = JSON.parse(
      JSON.stringify(oldNode)
    );
    newNode.id = newNodes.length;

    if (parent) {
      newNode.parent = parent.id;

      const children = parent.children;
      if (children !== undefined) {
        children.push(newNode.id);
      } else {
        parent.children = [newNode.id];
      }
    }

    // clear out node-->children links
    newNode.children = undefined;

    newNode.min = ts;
    newNode.max = -1;
    newNode.self = 0;
    newNode.total = 0;

    newNodes.push(newNode);
    stack.push(newNode);
    origId2activeIndex.set(oldNode.id, stack.length - 1);
    expId2origId.set(newNode.id, oldNode.id);
    if (orig2ExpNodes.has(oldNode.id)) {
      orig2ExpNodes.get(oldNode.id)!.push(newNode);
    } else {
      orig2ExpNodes.set(oldNode.id, [newNode]);
    }

    parent = newNode;
  }
}

function addDurationToNodes(stack: ICpuProfileNode[], delta: number): void {
  if (stack.length > 0) {
    stack[stack.length - 1].self += delta;
  }
}

interface IExpState {
  lastSampleTS: number;
  stack: ICpuProfileNode[];
  origId2activeIndex: Map<number, number>;
  expId2origId: Map<number, number>;
}

function endExecute(state: IExpState, timestamp: number): void {
  const { stack, lastSampleTS } = state;
  addDurationToNodes(stack, timestamp - lastSampleTS);
  const toTerminate = stack.splice(1); // don't slice (root)
  terminateNodes(toTerminate, timestamp, state);
}

function processSample(
  sample: ISample,
  orig2ExpNodes: Map<number, ICpuProfileNode[]>,
  parentLinks: Map<ICpuProfileNode, ICpuProfileNode>,
  newNodes: ICpuProfileNode[],
  state: IExpState
): void {
  const { stack, origId2activeIndex } = state;
  let curNode: ICpuProfileNode | undefined;
  const toActivate: ICpuProfileNode[] = [];

  state.lastSampleTS = sample.timestamp;

  for (curNode = sample.node; curNode; curNode = parentLinks.get(curNode)) {
    if (origId2activeIndex.has(curNode.id)) {
      break;
    }
    toActivate.push(curNode);
  }

  addDurationToNodes(stack, sample.delta);

  let spliceStart;
  if (curNode === undefined) {
    // No ongoing nodes, remove everything from the stack
    spliceStart = 0;
  } else {
    // Don't let GC or Program samples terminate the current stack
    if (
      sample.node.callFrame.functionName === FUNCTION_NAME.GC ||
      sample.node.callFrame.functionName === FUNCTION_NAME.PROGRAM
    ) {
      spliceStart = stack.length; // no-op for slice
    } else {
      // Leave only ongoing nodes on the stack
      spliceStart = origId2activeIndex.get(curNode.id)! + 1;
    }
  }
  const toTerminate = stack.splice(spliceStart);

  terminateNodes(toTerminate, sample.timestamp, state);
  activateNodes(toActivate, state, sample.timestamp, newNodes, orig2ExpNodes);
}

export function isMetaNode(node: ICpuProfileNode): boolean {
  switch (node.callFrame.functionName) {
    case FUNCTION_NAME.ROOT:
    case FUNCTION_NAME.IDLE:
      return true;
  }
  return false;
}
