import { TBBaseCommand } from '../command-config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ITraceEvent } from '@tracerbench/core';
import { filter, tbResultsFolder, url, traceFrame } from '../helpers/flags';
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

export default class MarkerTimings extends TBBaseCommand {
  public static description = 'Get list of all user-timings from trace';

  public static flags = {
    tbResultsFolder: tbResultsFolder({ required: true }),
    filter: filter(),
    url: url({ required: true }),
    traceFrame: traceFrame(),
  };

  public async run() {
    const { flags } = this.parse(MarkerTimings);
    const { tbResultsFolder } = flags;
    const filter = collect(flags.filter, []);
    const traceFrame: any = flags.traceFrame ? flags.traceFrame : flags.url;
    const traceJSON = path.join(tbResultsFolder, 'trace.json');

    let frame: any = null;
    let startTime = -1;
    let rawTraceData: any = null;
    let trace: any = null;

    if (!traceFrame) {
      this.error(`Either a traceFrame or url are required flags.`);
    }

    try {
      rawTraceData = JSON.parse(fs.readFileSync(traceJSON, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from '${traceJSON}', ${error}`
      );
    }

    try {
      trace = loadTraceFile(rawTraceData);
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
      .filter((event: ITraceEvent) => isMark(event) || isCommitLoad(event))
      .sort(byTime)
      .forEach((event: any) => {
        if (isFrameNavigationStart(frame, event)) {
          startTime = event.ts;
          this.log(
            `Marker Timings: ${format(event.ts, startTime)} ${event.name}`
          );
        } else if (isFrameMark(frame, event)) {
          if (startTime === -1) {
            startTime = event.ts;
          }
          this.log(
            `Marker Timings: ${format(event.ts, startTime)} ${event.name}`
          );
        } else if (isUserMark(event)) {
          if (
            filter.length === 0 ||
            filter.some((f: any) => event.name.indexOf(f) !== -1)
          ) {
            this.log(
              `Marker Timings: ${format(event.ts, startTime)} ${event.name}`
            );
          }
        } else if (isCommitLoad(event)) {
          const { data } = event.args;
          if (data.frame === frame) {
            this.log(
              `Marker Timings: ${format(event.ts, startTime)} ${event.name} ${
                data.frame
              } ${data.url}`
            );
          }
        }
      });
  }
}
