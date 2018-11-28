import { UnaryExpression } from 'estree';
import * as fs from 'fs';
import { HAR } from 'har-remix';
import { CpuProfile, Trace } from '../trace';
import { aggregate, collapseCallFrames } from './aggregator';
import { Archive } from './archive_trace';
import { report as reporter } from './reporter';
import { computeMinMax } from './utils';

// tslint:disable:member-ordering

export interface UI {
  file: string;
  archive: string;
  methods: string[];
  event?: string;
  report?: string;
  verbose?: boolean;
}

export default class CommandLine {
  archive: Archive;
  filePath: string;

  constructor(private ui: UI) {
    let { file, archive: archivePath } = this.ui;
    let defaultProfilePath = `${process.cwd()}/trace.json`;
    let defaultArchivePath = `${process.cwd()}/trace.archive`;

    if (file === undefined && !fs.existsSync(file) && !fs.existsSync(defaultProfilePath)) {
      throw new Error(`Error: Must pass a path to the trace file 💣`);
    }

    if (archivePath === undefined && fs.existsSync(defaultArchivePath) === false) {
      throw new Error(`Error: Must pass a path to the archive file 💣`);
    }

    this.archive = JSON.parse(fs.readFileSync(archivePath || defaultArchivePath, 'utf8'));
    this.filePath = file || defaultProfilePath;
  }

  private loadTrace() {
    let { filePath } = this;
    let traceEvents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let trace = new Trace();
    trace.addEvents(traceEvents.traceEvents);
    trace.buildModel();
    return trace;
  }

  private cpuProfile(trace: Trace) {
    let { event } = this.ui;
    let { min, max } = computeMinMax(trace, 'navigationStart', event!);
    return trace.cpuProfile(min, max);
  }

  run() {
    let { archive } = this;
    let { report, verbose, methods } = this.ui;
    let trace = this.loadTrace();
    let profile = this.cpuProfile(trace)!;

    let aggregations = aggregate(profile.hierarchy, archive);
    collapseCallFrames(aggregations);
    reporter(aggregations, verbose!!);
  }
}
