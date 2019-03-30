import * as fs from 'fs-extra';

import { Command } from '@oclif/command';
import { analyze } from 'tracerbench';
import {
  archive,
  event,
  traceJSONOutput,
  methods,
  report
} from '../helpers/flags';

export default class Analyze extends Command {
  public static description =
    'Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.';
  public static flags = {
    archive: archive({ required: true }),
    event: event(),
    traceJSONOutput: traceJSONOutput({ required: true }),
    methods: methods({ required: true }),
    report: report()
  };

  public async run() {
    const { flags } = this.parse(Analyze);
    const { archive, event, traceJSONOutput, report } = flags;
    const methods = flags.methods.split(',');
    const file = traceJSONOutput;
    let archiveFile;
    let rawTraceData;
    try {
      rawTraceData = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
    } catch (error) {
      this.error(`Could not find file: ${traceJSONOutput}, ${error}`);
    }

    try {
      archiveFile = JSON.parse(fs.readFileSync(archive, 'utf8'));
    } catch (error) {
      this.error(`Could not find archive file: ${archive}, ${error}`);
    }

    await analyze({
      archiveFile,
      event,
      file,
      methods,
      rawTraceData,
      report
    });
  }
}
