import * as fs from 'fs-extra';
import * as path from 'path';
import { Command, flags } from '@oclif/command';
import { analyze } from 'parse-profile';
import { har, event, traceJSONOutput, methods, report, outputPath, legacy } from '../flags';

export default class Analyze extends Command {
  public static description =
    'Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.';
  public static flags = {
    har: har({ required: true }),
    event: event(),
    traceJSONOutput: traceJSONOutput({ required: true }),
    methods: methods({ required: true }),
    report: report(),
    outputPath: outputPath({ required: true }),
    legacy: flags.boolean(),
  };

  public async run() {
    const { flags } = this.parse(Analyze);
    const { har, event, traceJSONOutput, report, outputPath, legacy } = flags;
    const methods = flags.methods.split(',');
    const file = traceJSONOutput;
    let harFile;
    let rawTraceData;

    try {
      harFile = JSON.parse(fs.readFileSync(har, 'utf8'));
    } catch (error) {
      this.error(`Could not find har file: ${har}, ${error}`);
    }

    const stats = fs.statSync(traceJSONOutput);
    const files = stats.isDirectory() ?
                  fs.readdirSync(traceJSONOutput).map(f => path.join(traceJSONOutput, f)) :
                  [traceJSONOutput];

    for (const file of files) {
      try {
        rawTraceData = JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch (error) {
        this.error(`Could not find file: ${file}, ${error}`);
      }

      await analyze({
        harFile,
        event,
        file,
        methods,
        rawTraceData,
        report,
        outputPath,
        legacy
      });
    }
  }
}
