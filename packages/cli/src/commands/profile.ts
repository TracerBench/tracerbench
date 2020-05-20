/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IConditions,
  ITraceEvent,
  ITraceEventFrame,
  liveTrace,
} from "@tracerbench/core";
import { Archive } from "@tracerbench/har";
import Protocol from "devtools-protocol";
import { existsSync, mkdirSync, readJson, writeFileSync } from "fs-extra";
import * as listr from "listr";
import { join, resolve } from "path";

import { TBBaseCommand } from "../command-config";
import { harpath } from "../helpers/args";
import {
  cookiespath,
  cpuThrottleRate,
  network,
  tbResultsFolder,
  url,
} from "../helpers/flags";
import {
  byTime,
  convertToSentCase,
  findFrame,
  formatToDuration,
  isCommitLoad,
  isFrameMark,
  isFrameNavigationStart,
  isMark,
  logBar,
  logBarOptions,
  logHeading,
  setTraceEvents,
} from "../helpers/utils";

interface ProfileContext {
  cookies: Protocol.Network.CookieParam[];
  harJSON: Archive;
  traceJSONPath: string;
  traceEvents: ITraceEventFrame[];
  url: string;
}

type markerLogMeta = {
  name: string;
  sentanceCaseName: string;
  duration: number;
  startTime: number;
  bar: string;
};

export default class Profile extends TBBaseCommand {
  // include backwards compat to trace cmd
  static aliases = ["trace"];
  public trace: ITraceEventFrame[] = [];
  public static description = `Parses a CPU profile and aggregates time across heuristics.`;
  public static args = [harpath];
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    network: network(),
    url: url({ required: true }),
    cookiespath: cookiespath({ required: true }),
  };

  public async run(): Promise<void> {
    const { flags, args } = this.parse(Profile);
    const {
      cpuThrottleRate,
      cookiespath,
      tbResultsFolder,
      network,
      url,
    } = flags;
    const { harpath } = args;
    const cookies = [
      {
        name: "",
        value: "",
        domain: "",
        path: "",
      },
    ];
    const conditions: IConditions = {
      cpu: cpuThrottleRate,
      network,
    };

    const tasks = new listr([
      {
        title: "Reading cookies json",
        task: async (ctx: ProfileContext) => {
          // read cookies json file from path and set to context
          ctx.cookies = cookiespath.length
            ? await readJson(resolve(cookiespath))
            : cookies;
        },
      },
      {
        title: "Preparing results folder",
        task: () => {
          // if the folder for the tracerbench results file
          // does not exist then create it
          try {
            if (!existsSync(tbResultsFolder)) {
              mkdirSync(tbResultsFolder);
            }
          } catch (error) {
            this.error(error);
          }
        },
      },
      {
        title: "Validating & Cloning HAR file",
        task: async (ctx: ProfileContext) => {
          // validate har and clone it to trace.json which will be mutated
          ctx.harJSON = await readJson(resolve(harpath));
          ctx.traceJSONPath = join(tbResultsFolder, "trace.json");
          writeFileSync(
            ctx.traceJSONPath,
            JSON.stringify(ctx.harJSON, null, 2)
          );
          // if no url get url from har otherwise set with cmd url
          ctx.url = url.length ? url : getURLFromHAR(ctx);

          function getURLFromHAR(ctx: ProfileContext): string {
            try {
              const url = ctx.harJSON.log.entries[0].request.url;
              return url;
            } catch (error) {
              throw new Error(
                `${error}. Could not extract the URL from the HAR. Explicitly pass via "--url" flag and rerun.`
              );
            }
          }
        },
      },
      {
        title: "Recording the live trace",
        task: async (ctx: ProfileContext) => {
          const { cookies, url } = ctx;
          try {
            // run the liveTrace
            const { traceEvents } = await liveTrace(
              url,
              tbResultsFolder,
              cookies,
              conditions
            );
            ctx.traceEvents = traceEvents as ITraceEventFrame[];
          } catch (error) {
            this.error(`${error}`);
          }
        },
      },
      {
        title: "Setting trace events",
        task: async (ctx: ProfileContext) => {
          const { traceEvents } = ctx;
          // mutates this.trace
          try {
            this.trace = setTraceEvents(traceEvents);
          } catch (error) {
            this.error(`${error}`);
          }
        },
      },
    ]);

    await tasks
      .run()
      .catch((error) => {
        this.error(`${error}`);
      })
      .then(async (ctx) => {
        // log js-eval-time
        this.logJSEvalTime();
        // log css-parse
        this.logCSSEvalTime();
        // log user timings
        await this.markerTimings(ctx.traceJSONPath, ctx.url);
      });
  }

  private logJSEvalTime(): void {
    let totalJSDuration = 0;
    const jsEvalLogs: logBarOptions[] = [];
    this.trace
      .filter((event: ITraceEvent) => event.name === "EvaluateScript")
      .filter((event: any) => event.args.data.url)
      .forEach((event: any) => {
        const url = event.args.data.url;
        const durationInMs = event.dur / 1000;
        totalJSDuration += durationInMs;
        jsEvalLogs.push({
          totalDuration: totalJSDuration,
          duration: durationInMs,
          title: url,
        });
      });

    logHeading(`JS Evaluation :: Total Duration ${totalJSDuration} ms`);

    // log js-eval-time
    jsEvalLogs
      .sort((a, b) => {
        return a.duration - b.duration;
      })
      .forEach((log) => {
        this.log(logBar(log));
      });
  }

  private logCSSEvalTime(): void {
    let totalCSSDuration = 0;
    const cssEvalLogs: logBarOptions[] = [];

    this.trace
      .filter((event: ITraceEvent) => event.name === "ParseAuthorStyleSheet")
      .filter((event: any) => event.args.data.styleSheetUrl)
      .forEach((event: any) => {
        const url = event.args.data.styleSheetUrl;
        const durationInMs = event.dur / 1000;
        totalCSSDuration += durationInMs;
        cssEvalLogs.push({
          totalDuration: totalCSSDuration,
          duration: durationInMs,
          title: url,
        });
      });

    logHeading(`CSS Evaluation :: Total Duration ${totalCSSDuration} ms`);

    // log css-parse-time
    cssEvalLogs
      .sort((a, b) => {
        return a.duration - b.duration;
      })
      .forEach((log) => {
        this.log(logBar(log));
      });
  }

  // tracerbench marker-timings cmd moved here
  private async markerTimings(
    traceJSONPath: string,
    url: string
  ): Promise<void> {
    let frame: string;
    let startTime = -1;
    let rawTraceData: any = null;
    let customTrace: ITraceEventFrame[];
    const markerLogs: markerLogMeta[] = [];

    if (!url) {
      this.error(
        `Could not extract the URL from the HAR. Explicitly pass via "--url" flag and rerun.`
      );
    }

    try {
      rawTraceData = await readJson(resolve(traceJSONPath));
    } catch (e) {
      this.error(e);
    }

    try {
      customTrace = setTraceEvents(rawTraceData);
    } catch (e) {
      this.error(e);
    }

    if (url.startsWith("http")) {
      frame = findFrame(customTrace, url);
    } else {
      frame = url;
    }

    if (!frame) {
      this.error(
        `Could not extract frame from trace. Explicitly opt-out of usertimings via "--usertimings" boolean flag and rerun.`
      );
    }

    customTrace
      .filter((event: ITraceEventFrame) => isMark(event) || isCommitLoad(event))
      .sort(byTime)
      .forEach((event: ITraceEventFrame) => {
        if (isFrameNavigationStart(frame, event, url)) {
          startTime = event.ts;
          markerLogs.push(this.buildMarkerLogs(event, startTime));
        } else if (
          isFrameMark(frame, event) &&
          event.name !== "navigationStart"
        ) {
          if (startTime === -1) {
            return;
          }
          markerLogs.push(this.buildMarkerLogs(event, startTime));
        }
      });

    this.logMarkerTimings(markerLogs);
  }

  private buildMarkerLogs(
    event: ITraceEventFrame,
    startTime: number
  ): markerLogMeta {
    return {
      name: event.name,
      sentanceCaseName: convertToSentCase(event.name),
      duration: formatToDuration(event.ts, startTime),
      startTime,
      bar: "",
    };
  }

  private logMarkerTimings(markerLogs: markerLogMeta[]): void {
    const totalDuration = markerLogs[markerLogs.length - 1].duration;

    logHeading(`Marker Timings :: Total Duration ${totalDuration} ms`);
    markerLogs.forEach((log) => {
      this.log(
        logBar({
          totalDuration,
          duration: log.duration,
          title: log.sentanceCaseName,
        })
      );
    });
  }
}
