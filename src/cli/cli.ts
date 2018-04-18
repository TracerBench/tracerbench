import { UnaryExpression } from 'estree';
import * as fs from 'fs';
import { HAR } from 'har-remix';
import { CpuProfile, Trace } from '../trace';
import { aggregate, categorizeAggregations, Aggregations, CallSite, collapseCallSites } from './aggregator';
import { Archive } from './archive_trace';
import { HeuristicsValidator } from './heuristics';
import { MetaData } from './metadata';
import { Reporter, Categories } from './reporter';
import { cdnHashes, computeMinMax, getVersion, Hashes, methodsFromCategories, formatCategories } from './utils';

// tslint:disable:member-ordering

export interface UI {
  file: string;
  archive: string;
  methods: string[];
  time?: string;
  report?: string;
  verbose?: boolean;
}

export default class CommandLine {
  archive: Archive;
  _validator: HeuristicsValidator | undefined;
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
    let { time } = this.ui;
    let { min, max } = computeMinMax(trace, 'navigationStart', time!);
    return trace.cpuProfile(min, max);
  }

  run() {
    let { archive } = this;
    let { report, verbose, methods } = this.ui;
    let trace = this.loadTrace();
    let profile = this.cpuProfile(trace)!;
    let metadata = new MetaData(archive);

    let categories = formatCategories(report, methods);
    let allMethods = methodsFromCategories(categories);
    let aggregations = aggregate(profile.hierarchy, allMethods);
    let associatedAggregations = metadata.for(aggregations);
    let collapsedAggregations = collapseCallSites(associatedAggregations);
    let categorized = categorizeAggregations(associatedAggregations, categories);
    let reporter = new Reporter(categorized);

    reporter.report(verbose!!);
    // let validator = this.validator(trace, profile);
    // let { validations, heuristics } = validator.validate(profile, archive);
    // let aggregator = new Aggregator(trace, profile, heuristics);
    // let reporter = new Reporter(aggregator, validations);

    // if (report) {
    //   reporter.fullReport(heuristics, verbose!!);
    // } else {
    //   reporter.categoryReport(heuristics);
    // }
  }
}
