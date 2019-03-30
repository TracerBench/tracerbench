import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import * as Listr from 'listr';
import { traceJSONOutput, url } from '../../helpers/flags';
import { findFrame, loadTraceFile } from '../../helpers/utils';

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

    const tasks = new Listr([
      {
        title: 'Extract Trace Events',
        task: () => {
          traceFile = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
        }
      },
      {
        title: 'Load Trace File',
        task: () => {
          trace = loadTraceFile(traceFile);
        }
      },
      {
        title: 'Find Frame',
        task: () => {
          frame = findFrame(trace, url);
          this.log(`FRAME: ${frame}`);
        }
      }
    ]);

    tasks.run().catch((err: any) => {
      this.error(err);
    });
  }
}
