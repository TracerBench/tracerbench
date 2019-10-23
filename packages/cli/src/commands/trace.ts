import { TBBaseCommand } from '../command-config';
import { readJson } from 'fs-extra';
import * as path from 'path';
import {
  liveTrace,
  analyze,
  loadTrace,
  ITraceEvent,
  IConditions,
  IAnalyze,
} from '@tracerbench/core';
import {
  tbResultsFolder,
  cpuThrottleRate,
  iterations,
  network,
  url,
  insights,
  locations,
  harpath,
  cookiespath,
} from '../helpers/flags';
import {
  normalizeFnName,
  isCommitLoad,
  setTraceEvents,
} from '../helpers/utils';

export default class Trace extends TBBaseCommand {
  public static description = `Parses a CPU profile and aggregates time across heuristics. Can optinally be vertically sliced with event names.`;
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

    const methods = [''];

    const traceJSONFile = path.resolve(tbResultsFolder, 'trace.json');
    const traceJSON = await readJson(traceJSONFile);
    const cookiesJSON = await readJson(path.resolve(cookiespath));
    const traceHAR = path.resolve(harpath);
    const traceHARJSON = await readJson(traceHAR);
    const conditions: IConditions = {
      cpu: cpuThrottleRate,
      network,
    };
    const analyzeOptions: IAnalyze = {
      traceJSON,
      traceHARJSON,
      methods,
    };

    // run the liveTrace
    await liveTrace(url, traceJSONFile, cookiesJSON, conditions);

    // analyze the liveTrace
    await analyze(analyzeOptions);

    if (insights) {
      // js-eval-time
      let trace: any;
      let totalJSDuration: number = 0;
      let totalCSSDuration: number = 0;

      const methods = new Set();

      try {
        trace = setTraceEvents(traceJSON);
      } catch (error) {
        this.error(`${error}`);
      }

      trace
        .filter((event: ITraceEvent) => event.name === 'EvaluateScript')
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
        .filter((event: ITraceEvent) => event.name === 'ParseAuthorStyleSheet')
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
        trace = setTraceEvents(traceJSON);
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
    return this.log(`${traceJSON}`);
  }
}
