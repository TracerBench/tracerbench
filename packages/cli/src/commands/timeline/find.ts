import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import { traceJSONOutput, url } from '../../flags';
import { findFrame, loadTraceFile } from '../../utils';

export default class Find extends Command {
  public static description = 'Get frame id from trace JSON file and url.';
  public static flags = {
    traceJSONOutput: traceJSONOutput({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(Find);
    const { traceJSONOutput, url } = flags;
    let frame: any = null;
    let trace: any = null;
    let traceFile: any = null;

    try {
      traceFile = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace JSON file at path ${traceJSONOutput}, ${error}`
      );
    }

    try {
      trace = loadTraceFile(traceFile);
    } catch (error) {
      this.error(`Error loading trace: ${error}`);
    }

    try {
      frame = findFrame(trace, url);
      this.log(`FRAME: ${frame}`);
    } catch (error) {
      this.error(`${error}`);
    }
  }
}
