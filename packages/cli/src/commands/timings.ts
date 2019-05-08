import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import {
  filter,
  marks,
  traceJSONOutput,
  url,
  traceFrame,
} from '../helpers/flags';
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
    traceJSONOutput: traceJSONOutput({ required: true }),
    filter: filter(),
    marks: marks(),
    url: url(),
    traceFrame: traceFrame(),
  };

  public async init() {
    const { flags } = this.parse(Timings);
    if (flags.url || flags.traceFrame) {
      this.error(
        `You must pass either a url or traceFrame to the Timings command`
      );
    }
  }
  public async run() {
    const { flags } = this.parse(Timings);
    const { marks, traceJSONOutput } = flags;
    const filter = collect(flags.filter, []);
    const traceFrame: any = !flags.url ? flags.traceFrame : flags.url;
    let frame: any = null;
    let startTime = -1;
    let traceFile: any = null;
    let trace: any = null;

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
        } else if (isUserMark(event) && marks) {
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
