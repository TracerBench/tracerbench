import * as fs from 'fs';
import { HAR } from 'har-remix';
import { cdnHashes, Hashes, getVersion, computeMinMax } from './utils';
import { HeuristicsValidator } from './heuristics';
import { Trace } from '../trace'
import CpuProfile from '../cpuprofile';
import { UnaryExpression } from 'estree';
import { Aggregator } from './aggregator';
import { Reporter } from './reporter';

export interface UI {
  file:string;
  har: string;
  time?: string,
  methods?: string[];
  report?: string;
  verbose?: boolean;
}


export default class CommandLine {
  har: HAR;
  _validator: HeuristicsValidator | undefined;
  filePath: string;
  constructor(private ui: UI) {
    let { file, har: harPath } = this.ui;
    let defaultProfilePath = `${process.cwd()}/profile.json`;

    if (file === undefined && fs.existsSync(defaultProfilePath) === false) {
      throw new Error(`Error: Must pass a path to the trace file 💣`);
    }

    if (harPath === undefined) {
      throw new Error(`Error: Must pass a path to the har file 💣`);
    }

    let har = this.har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
    this.filePath = file || defaultProfilePath;
  }

  private validator(trace: Trace, profile: CpuProfile) {
    if (!this._validator) {
      let { report, methods } = this.ui;
      return this._validator = new HeuristicsValidator({ report, methods });
    }

    return this._validator;
  }

  private loadTrace() {
    let { filePath } = this;
    let traceEvents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let trace = new Trace()
    trace.addEvents(traceEvents);
    trace.buildModel();
    return trace;
  }

  private cpuProfile(trace: Trace) {
    let { time } = this.ui;
    let { min, max } = computeMinMax(trace, 'navigationStart', time!);
    return trace.cpuProfile(min, max);
  }

  run() {
    let { har } = this;
    let { report, verbose } = this.ui;
    let trace = this.loadTrace();
    let profile = this.cpuProfile(trace)!;
    let validator = this.validator(trace, profile);
    let { verification, heuristics } = validator.validate(profile, har);
    let aggregator = new Aggregator(trace, profile, heuristics);
    let reporter = new Reporter(aggregator);

    if (report) {
      reporter.fullReport(heuristics, verbose);
    } else {
      reporter.categoryReport(heuristics);
    }
  }
}