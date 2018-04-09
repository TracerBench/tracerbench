import * as fs from 'fs';
import * as SilentError from 'silent-error';
import * as chalk from 'chalk';
import { HAR } from 'har-remix';
import { cdnHashes, Hashes, getVersion, computeMinMax } from './utils';
import { HeuristicsValidator } from './heuristics';
import { Trace } from '../trace'
import CpuProfile from '../cpuprofile';

const error = chalk.default.bold.red;

export interface UI {
  file:string;
  har: string;
  time?: string,
  methods?: string[];
  report?: string;
}


class CommandLine {
  har: HAR;
  appVersion: string;
  cdnHashes: Hashes;
  _validator: HeuristicsValidator;
  filePath: string;
  constructor(private ui: UI) {
    let { file, har: harPath } = this.ui;
    let defaultProfilePath = `${process.cwd()}/profile.json`;

    if (file === undefined && fs.existsSync(defaultProfilePath) === false) {
      throw new SilentError(error(`Error: Must pass a path to the trace file 💣`));
    }

    if (harPath === undefined) {
      throw new SilentError(error(`Error: Must pass a path to the har file 💣`))
    }

    let har = this.har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
    let version = this.appVersion = getVersion(har.log.entries[0]);
    this.cdnHashes = cdnHashes(version);
    this.filePath = file || defaultProfilePath;
  }

  private validator(trace: Trace, profile: CpuProfile) {
    if (!this._validator) {
      let { report, methods } = this.ui;
      let { cdnHashes } = this;
      return this._validator = new HeuristicsValidator(profile, cdnHashes, { report, methods });
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
    let { min, max } = computeMinMax(trace, 'navigationStart', time);
    return trace.cpuProfile(min, max);
  }

  run() {
    let { validator, appVersion } = this;
    let trace = this.loadTrace();
    let profile = this.cpuProfile(trace);
    let validator = this.validator(trace, profile);
    let validations = validator.validate(appVersion);

  }
}