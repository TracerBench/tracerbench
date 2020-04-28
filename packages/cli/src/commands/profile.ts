/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  analyze,
  IConditions,
  ITraceEvent,
  liveTrace,
} from "@tracerbench/core";
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
  usertimings,
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
  ITraceEventFrame,
  setTraceEvents,
} from "../helpers/utils";

interface ProfileContext {
  cookies: Protocol.Network.CookieParam[];
  harJSON: any;
  traceJSONPath: string;
  traceEvents: ITraceEventFrame[];
  url: string;
  analyzeResults: { node: string; hierarchyReports: string[] };
}

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
    usertimings,
  };

  public async run(): Promise<void> {
    const { flags, args } = this.parse(Profile);
    const {
      cpuThrottleRate,
      cookiespath,
      tbResultsFolder,
      network,
      usertimings,
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
    const methods = [""];
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
        title: "Analyzing the live trace",
        task: async (ctx: ProfileContext) => {
          const { traceEvents, harJSON } = ctx;

          try {
            // analyze the liveTrace
            ctx.analyzeResults = await analyze({
              traceEvents,
              traceHARJSON: harJSON,
              methods,
            });
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
        // log logAnalyzeReports
        this.log(`\n`);
        this.logAnalyzeReports(ctx.analyzeResults);
        // log js-eval-time
        this.log(`\n`);
        this.logJSEvalTime();
        // log css-parse
        this.log(`\n`);
        this.logCSSEvalTime();
        // log user timings
        if (usertimings) {
          this.log(`\n`);
          await this.markerTimings(ctx.traceJSONPath, ctx.url);
        }
      });
  }

  private logAnalyzeReports(analyzeResults: {
    node: string;
    hierarchyReports: string[];
  }): void {
    this.log(`${analyzeResults.node}`);
    analyzeResults.hierarchyReports.forEach((report) => {
      this.log(`${report}`);
    });
  }

  private logCSSEvalTime(): void {
    let totalCSSDuration = 0;

    this.trace
      .filter((event: ITraceEvent) => event.name === "ParseAuthorStyleSheet")
      .filter((event: any) => event.args.data.styleSheetUrl)
      .forEach((event: any) => {
        const url = event.args.data.styleSheetUrl;
        const durationInMs = event.dur / 1000;
        totalCSSDuration += durationInMs;
        this.log(`CSS: ${url}: ${durationInMs.toFixed(2)}`);
      });

    // log css-parse-time
    this.log(
      `CSS: Evaluation Total Duration: ${totalCSSDuration.toFixed(2)}ms`
    );
  }

  private logJSEvalTime(): void {
    let totalJSDuration = 0;

    this.trace
      .filter((event: ITraceEvent) => event.name === "EvaluateScript")
      .filter((event: any) => event.args.data.url)
      .forEach((event: any) => {
        const url = event.args.data.url;
        const durationInMs = (event.dur as number) / 1000;
        totalJSDuration += durationInMs;
        this.log(`JS: ${url}: ${durationInMs.toFixed(2)}`);
      });

    // log js-eval-time
    this.log(`JS: Evaluation Total Duration: ${totalJSDuration.toFixed(2)}ms`);
  }

  // tracerbench marker-timings cmd moved here
  private async markerTimings(
    traceJSONPath: string,
    url: string
  ): Promise<void> {
    type markerLogMeta = {
      name: string;
      duration: number;
      eventTS: number;
      startTime: number;
    };
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
        const barTick = "■";
        const maxBarLength = 60;
        if (isFrameNavigationStart(frame, event, url)) {
          startTime = event.ts;
          markerLogs.push(
            `${convertToSentCase(
              event.name
            )}\n ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■${formatToDuration(
              event.ts,
              startTime
            )}\n`
          );
        } else if (
          isFrameMark(frame, event) &&
          event.name !== "navigationStart"
        ) {
          if (startTime === -1) {
            return;
          }
          markerLogs.push(
            `${convertToSentCase(
              event.name
            )}\n ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■${formatToDuration(
              event.ts,
              startTime
            )}\n`
          );
        }
      });

    markerLogs.forEach((log) => {
      this.log(log);
    });
  }
}

function getBar(maxTicks = 60, duration: number): string {}
