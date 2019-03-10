import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import * as Listr from 'listr';
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

    const tasks = new Listr([
      {
        title: 'Extract Trace Events',
        task: () => {
          events = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
        }
      },
      {
        title: 'Loading Trace',
        task: () => {
          trace = loadTrace(events.traceEvents);
        }
      },
      {
        title: 'Filtering Events',
        task: () => {
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
    ]);

    tasks.run().catch((err: any) => {
      this.error(err);
    });
  }
}
