import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
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
  loadTraceFile
} from '../../utils';

export default class Show extends Command {
  public static description = 'show tracefile with user timings';
  public static flags = {
    file: flags.string({
      char: 'f',
      default: './trace.json',
      description: 'Path to trace json file',
      required: true
    }),
    filter: flags.string({
      char: 'r',
      description: 'user timing marks start with'
    }),
    marks: flags.string({
      char: 'm',
      description: 'show user timing marks'
    }),
    urlOrFrame: flags.string({
      char: 'u',
      description: 'URL or Frame',
      required: true
    })
  };

  public async run() {
    const { flags } = this.parse(Show);
    const filter = collect(flags.filter, []);
    const marks = flags.marks;
    const file = flags.file;
    const urlOrFrame = flags.urlOrFrame;
    const events: any = null;
    let frame: any = null;
    let startTime = -1;
    let traceFile: any = null;
    let trace: any = null;

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
      this.error(`${error}`);
    }

    if (urlOrFrame.startsWith('http')) {
      frame = findFrame(trace, urlOrFrame);
    } else {
      frame = urlOrFrame;
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
