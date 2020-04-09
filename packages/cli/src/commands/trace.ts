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
import * as path from "path";

import { TBBaseCommand } from "../command-config";
import {
  cookiespath,
  cpuThrottleRate,
  harpath,
  insights,
  iterations,
  locations,
  network,
  tbResultsFolder,
  url,
} from "../helpers/flags";
import {
  isCommitLoad,
  normalizeFnName,
  setTraceEvents,
} from "../helpers/utils";

export default class Trace extends TBBaseCommand {
  public static description = `Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    harpath: harpath({ required: true }),
    network: network(),
    url: url({ required: true }),
    cookiespath: cookiespath({ required: true }),
    iterations: iterations({ required: true }),
    locations: locations(),
    insights,
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const {
      url,
      cpuThrottleRate,
      cookiespath,
      tbResultsFolder,
      insights,
      locations,
      network,
      harpath,
    } = flags;

    const methods = [""];
    const cookiesJSON = await readJson(path.resolve(cookiespath));
    const traceHAR = path.resolve(harpath);
    const traceHARJSON = await readJson(traceHAR);
    const conditions: IConditions = {
      cpu: cpuThrottleRate,
      network,
    };
    // if the folder for the tracerbench results file
    // does not exist then create it
    try {
      if (!existsSync(tbResultsFolder)) {
        mkdirSync(tbResultsFolder);
      }
    } catch (error) {
      this.error(error);
    }
    // write the trace.json
    writeFileSync(
      path.join(tbResultsFolder, "trace.json"),
      JSON.stringify(traceHARJSON, null, 2)
    );

    // run the liveTrace
    const { traceEvents } = await liveTrace(
      url,
      tbResultsFolder,
      cookiesJSON,
      conditions
    );

    const analyzeOptions: IAnalyze = {
      traceEvents,
      traceHARJSON,
      methods,
    };

    // analyze the liveTrace
    await analyze(analyzeOptions);

    if (insights) {
      // js-eval-time
      let trace: any;
      let totalJSDuration = 0;
      let totalCSSDuration = 0;

      const methods = new Set();

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
        if (locations) {
          profile.nodeMap.forEach((node: any) => {
            const {
              functionName,
              url,
              lineNumber,
              columnNumber,
            } = node.callFrame;

            methods.add(
              `${url}:${lineNumber}:${columnNumber}.${normalizeFnName(
                functionName
              )}`
            );
          });
        } else {
          profile.nodeMap.forEach((node: any) => {
            methods.add(normalizeFnName(node.callFrame.functionName));
          });
        }
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
    }
  }
}
