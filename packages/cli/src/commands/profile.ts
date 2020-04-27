import {
  analyze,
  IConditions,
  ITraceEvent,
  liveTrace,
  loadTrace,
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
  collect,
  findFrame,
  format,
  IEvent,
  isCommitLoad,
  isFrameMark,
  isFrameNavigationStart,
  isMark,
  isUserMark,
  normalizeFnName,
  setTraceEvents,
} from "../helpers/utils";

interface ProfileContext {
  cookies: Protocol.Network.CookieParam[];
  harJSON: any;
  traceJSONPath: string;
  traceEvents: ITraceEvent[];
  url: string;
  analyzeResults: { node: string; hierarchyReports: string[] };
}

export default class Profile extends TBBaseCommand {
  // include backwards compat to trace cmd
  static aliases = ["trace"];
  public trace: ITraceEvent[] = [];
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
            ctx.traceEvents = traceEvents;
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
        // log list-functions
        this.log(`\n`);
        this.listFrames();
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

  private listFrames(): void {
    const methodsSet = new Set();
    let clonedTrace: any = null;

    try {
      const profile = loadTrace(this.trace).cpuProfile(-1, -1);
      profile.nodeMap.forEach((node: any) => {
        const { functionName, url, lineNumber, columnNumber } = node.callFrame;

        methodsSet.add(
          `${url}:${lineNumber}:${columnNumber}.${normalizeFnName(
            functionName
          )}`
        );
      });
    } catch (error) {
      this.error(error);
    }

    try {
      clonedTrace = this.trace;
      const traceLoad = clonedTrace.filter(isCommitLoad);
      traceLoad.forEach(
        ({
          args: {
            data: { frame, url },
          },
        }: {
          args: { data: { frame: any; url: any } };
        }) => {
          this.log(`Frame-URL: ${url} | Frame-ID: ${frame}`);
        }
      );
    } catch (error) {
      this.error(`${error}`);
    }
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
    const traceFrame: string = url;
    const filter = collect("", []);

    let frame: any = null;
    let startTime = -1;
    let rawTraceData: any = null;
    let customTrace: any = null;

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

    if (traceFrame.startsWith("http")) {
      frame = findFrame(customTrace, traceFrame);
    } else {
      frame = traceFrame;
    }
    if (!frame) {
      this.error(
        `Could not extract frame from trace. Explicitly opt-out of usertimings via "--usertimings" boolean flag and rerun.`
      );
    }

    customTrace
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
