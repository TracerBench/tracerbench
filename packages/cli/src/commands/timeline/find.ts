import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { findFrame, loadTraceFile } from '../../utils';

export default class Find extends Command {
  public static description = 'Get frame id from trace file and url.';
  public static flags = {
    file: flags.string({
      char: 'f',
      default: './trace.json',
      description: 'Path to trace json file',
      required: true
    }),
    url: flags.string({
      char: 'u',
      description: 'url',
      required: true
    })
  };

  public async run() {
    const { flags } = this.parse(Find);
    const file = flags.file;
    const url = flags.url;
    let frame: any = null;
    let trace: any = null;
    let traceFile: any = null;

    try {
      traceFile = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace file at path ${file}, ${error}`
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
