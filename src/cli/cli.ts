import { UnaryExpression } from 'estree';
import * as fs from 'fs';
import { HAR } from 'har-remix';
import * as path from 'path';
import { CpuProfile, Trace } from '../trace';
import { Aggregator, aggregate, toCategories } from './aggregator';
import { Archive } from './archive_trace';
import { HeuristicsValidator } from './heuristics';
import { MetaData } from './metadata';
import { Reporter, Categories } from './reporter';
import { cdnHashes, computeMinMax, getVersion, Hashes } from './utils';

// tslint:disable:member-ordering

export interface UI {
  file: string;
  archive: string;
  time?: string;
  methods?: string[];
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
    let { report, verbose } = this.ui;
    let trace = this.loadTrace();
    let profile = this.cpuProfile(trace)!;
    let categories = getCategories(this.ui);
    let methods = getMethods(categories);
    let aggregations = aggregate(profile.hierarchy, methods);
    let metadata = new MetaData(archive);
    let associatedAggregations = metadata.associate(aggregations);
    let categorized = toCategories(associatedAggregations, categories);

    console.log(JSON.stringify(categorized, null, 2));

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

function getMethods(categories: Categories) {
  return Object.keys(categories).reduce((accum: string[], category: string) => {
    accum.push(...categories[category]);
    return accum;
  }, []);
}

function getCategories(ui: UI) {
  let { report, methods } = ui;
  if (report) {
    let files = fs.readdirSync(report);
    let _categories: Categories = {};

    files.map(file => {
      let name = path.basename(file).replace('.json', '');
      // tslint:disable-next-line:no-shadowed-variable
      let methods = JSON.parse(fs.readFileSync(`${report}/${file}`, 'utf8'));
      _categories[name] = methods;
    });

    return _categories;

  } else {
    if (methods === undefined) {
      throw new Error(`Error: Must pass a list of method names.`);
    }

    return { adhoc: methods };
  }
}
