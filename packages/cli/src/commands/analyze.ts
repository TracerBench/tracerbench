import * as fs from 'fs-extra';

import { Command } from '@oclif/command';
import { analyze } from 'parse-profile';
import { archive, event, file, methods, report } from '../flags';

export default class Analyze extends Command {
  public static description =
    'Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.';
  public static flags = {
    archive: archive({ required: true }),
    event: event(),
    file: file({ required: true }),
    methods: methods({ required: true }),
    report: report()
  };

  public async run() {
    const { flags } = this.parse(Analyze);
    const { archive, event, file, report } = flags;
    const methods = flags.methods.split(',');
    let archiveFile;
    let rawTraceData;

    try {
      rawTraceData = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      this.error(`Could not find file: ${file}, ${error}`);
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
