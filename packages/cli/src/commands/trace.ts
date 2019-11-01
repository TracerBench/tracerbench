import { TBBaseCommand } from '../command-config';
import * as fs from 'fs-extra';
import * as path from 'path';
import { liveTrace, analyze, loadTrace, ITraceEvent } from '@tracerbench/core';
import {
  tbResultsFolder,
  cpuThrottleRate,
  iterations,
  network,
  url,
  insights,
  locations,
} from '../helpers/flags';
import {
  getCookiesFromHAR,
  normalizeFnName,
  isCommitLoad,
  setTraceEvents,
} from '../helpers/utils';

export default class Trace extends TBBaseCommand {
  public static description = `Parses a CPU profile and aggregates time across heuristics. Can optinally be vertically sliced with event names.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    network: network(),
    url: url({ required: true }),
    iterations: iterations({ required: true }),
    locations: locations(),
    insights,
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const {
      url,
      cpuThrottleRate,
      tbResultsFolder,
      insights,
      locations,
    } = flags;
    const network = 'none';
    const cpu = cpuThrottleRate;
    const file = tbResultsFolder;
    const event = undefined;
    const report = undefined;
    const methods = [''];
    const traceJSON = path.join(tbResultsFolder, 'trace.json');
    const traceHAR = path.join(tbResultsFolder, 'trace.har');
    const cookiesJSON = path.join(tbResultsFolder, 'cookies.json');

    let archiveFile;
    let rawTraceData;
    let cookies: any = '';

    try {
      cookies = JSON.parse(fs.readFileSync(cookiesJSON, 'utf8'));
    } catch (error) {
      try {
        cookies = getCookiesFromHAR(
          JSON.parse(fs.readFileSync(traceHAR, 'utf8'))
        );
      } catch (error) {
        this.error(
          `Could not extract cookies from cookies.json or HAR file at path ${traceHAR}, ${error}`
        );
        cookies = null;
      }
    }

    await liveTrace(url, traceJSON, cookies, {
      cpu,
      network,
    });

    try {
      rawTraceData = JSON.parse(fs.readFileSync(traceJSON, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from '${traceJSON}', ${error}`
      );
    }

    try {
      archiveFile = JSON.parse(fs.readFileSync(traceHAR, 'utf8'));
    } catch (error) {
      this.error(
        `Could not find trace har file at path: ${traceHAR}, ${error}`
      );
    }

    await analyze({
      archiveFile,
      event,
      file,
      methods,
      rawTraceData,
      report,
    });

    if (insights) {
      // js-eval-time
      let trace: any;
      let totalJSDuration: number = 0;
      let totalCSSDuration: number = 0;

      const methods = new Set();

      try {
        trace = setTraceEvents(rawTraceData);
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
        trace = setTraceEvents(rawTraceData);
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

    return this.log(`Trace file successfully generated: ${traceJSON}`);
  }
}
