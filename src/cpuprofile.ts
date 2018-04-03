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
}

export default class CpuProfile {
  profile: ICpuProfile;

  /**
   * Sample timestamps in microseconds
   */
  timestamps: number[];

  /**
   * Profile duration in microseconds
   */
  duration: number;

  /**
   * Average interval in microseconds
   */
  interval: number;

  /**
   * total hitCount of nodes.
   */
  hitCount: number;

  /**
   * Node by node id.
   */
  nodes: Map<number, IProfileNode>;

  /**
   * Parents by child node id.
   */
  parents: Map<number, IProfileNode>;

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

  hierarchy: HierarchyNode<IProfileNode>;

  constructor(profile: ICpuProfile) {
    this.profile = profile;
    let timeDeltas = profile.timeDeltas;
    let timestamps: number[] = new Array(timeDeltas.length);
    let last = profile.startTime;
    for (let i = 0; i < timeDeltas.length; i++) {
      timestamps[i] = last;
      last += timeDeltas[i];
    }
    timestamps[timeDeltas.length] = last;
    this.timestamps = timestamps;

    let duration = (this.duration = profile.endTime - profile.startTime);
    this.interval = duration / profile.samples.length;

    let nodes = (this.nodes = new Map<number, IProfileNode>());
    let parents = (this.parents = new Map<number, IProfileNode>());
    let hitCount = 0;

    profile.nodes.forEach(node => {
      nodes.set(node.id, node);
      if (node.children) {
        node.children.forEach(id => {
          parents.set(id, node);
        });
      }
      hitCount += node.hitCount;
      if (node.callFrame.scriptId === Constants.NATIVE_SCRIPT_ID) {
        switch (node.callFrame.functionName) {
          case Constants.ROOT_FUNCTION_NAME:
            this.root = node;
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
    });

    this.hitCount = hitCount;

    this.hierarchy = hierarchy(
      this.root!,
      d => (d.children !== undefined ? d.children.map(id => nodes.get(id)!) : [])
    );
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
