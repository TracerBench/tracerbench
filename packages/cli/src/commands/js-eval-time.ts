import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import { loadTrace } from 'parse-profile';
import { traceJSONOutput } from '../flags';

export default class JSEvalTime extends Command {
  public static description = 'Aggregates JS Eval time from a trace.';
  public static flags = {
    traceJSONOutput: traceJSONOutput({ required: true })
  };

  public async run() {
    let events: any = '';
    let trace: any = null;
    let totalDuration: number = 0;

    const { flags } = this.parse(JSEvalTime);
    const { traceJSONOutput } = flags;

    try {
      events = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace JSON file at path ${traceJSONOutput}, ${error}`
      );
    }

    try {
      trace = loadTrace(events.traceEvents);
    } catch (error) {
      this.error(error);
    }

    trace.events
      .filter((event: any) => event.name === 'EvaluateScript')
      .filter((event: any) => event.args.data.url)
      .forEach((event: any) => {
        const url = event.args.data.url;
        const durationInMs = event.dur / 1000;
        totalDuration += durationInMs;
        this.log(`${url}: ${durationInMs.toFixed(2)}`);
      });
    this.log(`Total Duration = ${totalDuration.toFixed(2)}ms`);
  }
}
