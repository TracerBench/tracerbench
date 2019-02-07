import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { loadTrace } from 'parse-profile';

export default class CSSParse extends Command {
  public static description = 'Aggregates CSS parsing time from a trace.';
  public static flags = {
    file: flags.string({
      char: 'f',
      default: './trace.json',
      description: 'the path to the trace json file',
      required: true
    })
  };

  public async run() {
    let events: any = '';
    let trace: any = null;
    let totalDuration: number = 0;

    const { flags } = this.parse(CSSParse);
    const { file } = flags;

    try {
      events = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace file at path ${file}, ${error}`
      );
    }

    try {
      trace = loadTrace(events.traceEvents);
    } catch (error) {
      this.error(error);
    }

    trace.events
      .filter((event: any) => event.name === 'ParseAuthorStyleSheet')
      .filter((event: any) => event.args.data.styleSheetUrl)
      .forEach((event: any) => {
        const url = event.args.data.styleSheetUrl;
        const durationInMs = event.dur / 1000;
        totalDuration += durationInMs;
        this.log(`CSS: ${url}: ${durationInMs.toFixed(2)}`);
      });

    this.log(`TOTAL DURATION: ${totalDuration.toFixed(2)}ms`);
  }
}
