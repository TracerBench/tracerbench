import { ITraceEvent } from './trace';

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

export interface IProfileNode {
  id: number;
  children: number[];
}

export default class CpuProfile {
  profile: ICpuProfile;

  constructor(profile: ICpuProfile) {
    this.profile = profile;
    let timeDeltas = profile.timeDeltas;
    let timestamps: number[] = new Array(timeDeltas.length);
    let last = profile.startTime;
    for (let i = 0; i < timeDeltas.length; i++) {
      timestamps[i] = last;
      last += timeDeltas[i];
    }
  }

  static from(traceEvent: ITraceEvent | undefined) {
    if (isCpuProfile(traceEvent)) {
      return new CpuProfile(traceEvent.args.data.cpuProfile);
    }
  }
}

function isCpuProfile(traceEvent: ITraceEvent | undefined): traceEvent is ICpuProfileEvent {
  return traceEvent && traceEvent.cat === 'I' && traceEvent.name === 'CpuProfile';
}
