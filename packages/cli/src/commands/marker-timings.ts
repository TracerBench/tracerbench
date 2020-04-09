import { readJSONSync } from "fs-extra";
import * as path from "path";

import { TBBaseCommand } from "../command-config";
import { filter, traceFrame, tracepath, url } from "../helpers/flags";
import {
  byTime,
  collect,
  findFrame,
  format,
  IEvent,
  isCommitLoad,
  isFrameMark,
  isFrameNavigationStart,
  isMark,
  isUserMark,
  setTraceEvents,
} from "../helpers/utils";

export default class MarkerTimings extends TBBaseCommand {
  public static description = "Get list of all user-timings from trace";

  public static flags = {
    tracepath: tracepath({ required: true }),
    filter: filter(),
    url: url({ required: true }),
    traceFrame: traceFrame(),
  };

  public async run(): Promise<void> {
    const { flags } = this.parse(MarkerTimings);
    const { tracepath } = flags;
    const filter = collect(flags.filter, []);
    const traceFrame: string = flags.traceFrame ? flags.traceFrame : flags.url;

    let frame: any = null;
    let startTime = -1;
    let rawTraceData: any = null;
    let trace: any = null;

    if (!traceFrame && !url) {
      this.error(`Either a traceFrame or url are required flags.`);
    }

    try {
      rawTraceData = readJSONSync(path.resolve(tracepath));
    } catch (e) {
      this.error(e);
    }

    try {
      trace = setTraceEvents(rawTraceData);
    } catch (e) {
      this.error(e);
    }

    if (traceFrame.startsWith("http")) {
      frame = findFrame(trace, traceFrame);
    } else {
      frame = traceFrame;
    }
    if (!frame) {
      this.error(`frame not found`);
    }

    trace
      .filter((event: IEvent) => isMark(event) || isCommitLoad(event))
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
