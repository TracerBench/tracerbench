/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  analyze,
  IAnalyze,
  IConditions,
  ITraceEvent,
  liveTrace,
  loadTrace,
} from "@tracerbench/core";
import { existsSync, mkdirSync, readJson, writeFileSync } from "fs-extra";
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

export default class Profile extends TBBaseCommand {
  // include backwards compat to trace cmd
  static aliases = ["trace"];
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

  public async run() {
    const { flags, args } = this.parse(Profile);
    const {
      cpuThrottleRate,
      cookiespath,
      tbResultsFolder,
      network,
      usertimings,
    } = flags;
    const { harpath } = args;
    let { url } = flags;
    let cookies = [
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
    if (cookiespath.length) {
      cookies = await readJson(resolve(cookiespath));
    }
    // if the folder for the tracerbench results file
    // does not exist then create it
    try {
      if (!existsSync(tbResultsFolder)) {
        mkdirSync(tbResultsFolder);
      }
    } catch (error) {
      this.error(error);
    }
    // validate har and clone it to trace.json which will be mutated
    const harJSON = await readJson(resolve(harpath));
    const traceJSONPath = join(tbResultsFolder, "trace.json");
    writeFileSync(traceJSONPath, JSON.stringify(harJSON, null, 2));

    // if no url get url from har
    if (!url.length) {
      try {
        url = harJSON.log.entries[0].request.url;
      } catch (error) {
        this.error(
          `${error}. Could not extract the URL from the HAR. Explicitly pass via "--url" flag and rerun.`
        );
      }
    }

    // run the liveTrace
    const { traceEvents } = await liveTrace(
      url,
      tbResultsFolder,
      cookies,
      conditions
    );

    const analyzeOptions: IAnalyze = {
      traceEvents,
      traceHARJSON: harJSON,
      methods,
    };

    // analyze the liveTrace
    await analyze(analyzeOptions);

    // js-eval-time
    let trace: any;
    let totalJSDuration = 0;
    let totalCSSDuration = 0;

    const methodsSet = new Set();

    try {
      trace = setTraceEvents(traceEvents);
    } catch (error) {
      this.error(`${error}`);
    }

    trace
      .filter((event: ITraceEvent) => event.name === "EvaluateScript")
      .filter((event: any) => event.args.data.url)
      .forEach((event: any) => {
        const url = event.args.data.url;
        const durationInMs = (event.dur as number) / 1000;
        totalJSDuration += durationInMs;
        this.log(`JS: ${url}: ${durationInMs.toFixed(2)}`);
      });

    // log js-eval-time
    this.log(
      `JS: Evaluation Total Duration: ${totalJSDuration.toFixed(2)}ms \n\n`
    );

    // css-parse
    trace
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
      `CSS: Evaluation Total Duration: ${totalCSSDuration.toFixed(2)}ms \n\n`
    );

    // list-functions
    try {
      const profile = loadTrace(trace).cpuProfile(-1, -1);
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
      trace = setTraceEvents(traceEvents);
      const traceLoad = trace.filter(isCommitLoad);
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

    if (usertimings) {
      await this.markerTimings(traceJSONPath, url);
    }
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
    let trace: any = null;

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
      this.error(
        `Could not extract frame from trace. Explicitly opt-out of usertimings via "--usertimings" boolean flag and rerun.`
      );
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
