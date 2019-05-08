import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import * as path from 'path';
import { filter, tbResultsFile, url, traceFrame } from '../helpers/flags';
import {
  byTime,
  collect,
  findFrame,
  format,
  isCommitLoad,
  isFrameMark,
  isFrameNavigationStart,
  isMark,
  isUserMark,
  loadTraceFile,
} from '../helpers/utils';

export default class Timings extends Command {
  public static description = 'Get list of all user-timings from trace';

  public static flags = {
    tbResultsFile: tbResultsFile({ required: true }),
    filter: filter(),
    url: url({ required: true }),
    traceFrame: traceFrame(),
  };

  public async run() {
    const { flags } = this.parse(Timings);
    const { tbResultsFile } = flags;
    const filter = collect(flags.filter, []);
    const traceFrame: any = flags.traceFrame ? flags.traceFrame : flags.url;
    const traceJSON = path.join(tbResultsFile, 'trace.json');

    let frame: any = null;
    let startTime = -1;
    let traceFile: any = null;
    let trace: any = null;

    if (!traceFrame) {
      this.error(`Either a traceFrame or url are required flags.`);
    }

    try {
      traceFile = JSON.parse(fs.readFileSync(traceJSON, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from '${traceJSON}', ${error}`
      );
    }

    try {
      trace = loadTraceFile(traceFile);
    } catch (error) {
      this.error(`${error}`);
    }

    if (traceFrame.startsWith('http')) {
      frame = findFrame(trace, traceFrame);
    } else {
      frame = traceFrame;
    }
    if (!frame) {
      this.error(`frame not found`);
    }

    trace
      .filter((event: any) => isMark(event) || isCommitLoad(event))
      .sort(byTime)
      .forEach((event: any) => {
        if (isFrameNavigationStart(frame, event)) {
          startTime = event.ts;
          this.log(`Timings: ${format(event.ts, startTime)} ${event.name}`);
        } else if (isFrameMark(frame, event)) {
          if (startTime === -1) {
            startTime = event.ts;
          }
          this.log(`Timings: ${format(event.ts, startTime)} ${event.name}`);
        } else if (isUserMark(event)) {
          if (
            filter.length === 0 ||
            filter.some((f: any) => event.name.indexOf(f) !== -1)
          ) {
            this.log(`Timings: ${format(event.ts, startTime)} ${event.name}`);
          }
        } else if (isCommitLoad(event)) {
          const { data } = event.args;
          if (data.frame === frame) {
            this.log(
              `Timings: ${format(event.ts, startTime)} ${event.name} ${
                data.frame
              } ${data.url}`
            );
          }
        }
      });
  }
}
