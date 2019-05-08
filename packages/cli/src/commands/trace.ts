import { Command } from '@oclif/command';
import * as ora from 'ora';
import * as fs from 'fs-extra';
import { liveTrace, harTrace, analyze, loadTrace } from 'tracerbench';
import {
  archiveOutput,
  cpuThrottleRate,
  har,
  iterations,
  network,
  traceJSONOutput,
  url,
  insights,
  json,
  locations,
  insightsFindFrame,
  insightsListFrames,
} from '../helpers/flags';
import {
  getCookiesFromHAR,
  normalizeFnName,
  findFrame,
  isCommitLoad,
  loadTraceFile,
} from '../helpers/utils';

export default class Trace extends Command {
  public static description = `Parses a CPU profile and aggregates time across heuristics. Can optinally be vertically sliced with event names.`;
  public static flags = {
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    archiveOutput: archiveOutput({ required: true }),
    har: har(),
    network: network(),
    traceJSONOutput: traceJSONOutput({ required: true }),
    url: url({ required: true }),
    iterations: iterations({ required: true }),
    locations: locations(),
    insights,
    json,
    insightsFindFrame,
    insightsListFrames,
  };

  public async run() {
    const { flags } = this.parse(Trace);
    const {
      url,
      cpuThrottleRate,
      traceJSONOutput,
      archiveOutput,
      insights,
      json,
      locations,
      insightsFindFrame,
      insightsListFrames,
    } = flags;
    const network = 'none';
    const cpu = cpuThrottleRate;
    const spinner = ora().start(`Running Trace...\n`);
    let archiveFile;
    let rawTraceData;
    let { har } = flags;
    let cookies: any = '';

    // analyze flag variables
    const event = undefined;
    const report = undefined;
    const file = traceJSONOutput;
    const methods = [''];

    if (!har) {
      await harTrace(url, archiveOutput);
      har = archiveOutput;
    }

    try {
      cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    } catch (error) {
      try {
        if (har) {
          cookies = getCookiesFromHAR(JSON.parse(fs.readFileSync(har, 'utf8')));
        }
      } catch (error) {
        spinner.fail(
          `Could not extract cookies from cookies.json or HAR file at path ${har}, ${error}`
        );
        cookies = null;
      }
    }

    await liveTrace(url, traceJSONOutput, cookies, {
      cpu,
      network,
    });

    try {
      rawTraceData = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
    } catch (error) {
      spinner.fail(`Could not find file: ${traceJSONOutput}, ${error}`);
    }

    try {
      archiveFile = JSON.parse(fs.readFileSync(archiveOutput, 'utf8'));
    } catch (error) {
      spinner.fail(`Could not find archive file: ${archiveOutput}, ${error}`);
    }

    await analyze({
      archiveFile,
      event,
      file,
      methods,
      rawTraceData,
      report,
    });

    if (json) {
      return {
        // handle json response
      };
    }

    if (insights) {
      // js-eval-time
      let events;
      let trace: any;
      let totalJSDuration: number = 0;
      let totalCSSDuration: number = 0;

      const methods = new Set();

      try {
        events = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
      } catch (error) {
        this.error(
          `Could not extract trace events from trace JSON file at path ${traceJSONOutput}, ${error}`
        );
      }

      try {
        trace = loadTrace(events.traceEvents);
      } catch (error) {
        this.error(error);
      }

      trace.events
        .filter((event: any) => event.name === 'EvaluateScript')
        .filter((event: any) => event.args.data.url)
        .forEach((event: any) => {
          const url = event.args.data.url;
          const durationInMs = event.dur / 1000;
          totalJSDuration += durationInMs;
          this.log(`${url}: ${durationInMs.toFixed(2)}`);
        });

      // css-parse
      trace.events
        .filter((event: any) => event.name === 'ParseAuthorStyleSheet')
        .filter((event: any) => event.args.data.styleSheetUrl)
        .forEach((event: any) => {
          const url = event.args.data.styleSheetUrl;
          const durationInMs = event.dur / 1000;
          totalCSSDuration += durationInMs;
          this.log(`CSS: ${url}: ${durationInMs.toFixed(2)}`);
        });

      // list-functions
      try {
        const profile = trace.cpuProfile(-1, -1);
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

      // log js-eval-time
      this.log(`JS Evaluation Total Duration: ${totalJSDuration.toFixed(2)}ms`);
      // log css-parse-time
      this.log(
        `CSS Evaluation Total Duration: ${totalCSSDuration.toFixed(2)}ms`
      );
      // list-functions
      methods.forEach(method =>
        this.log(`Successfully listed method: ${method}`)
      );

      if (insightsFindFrame) {
        const frame = findFrame(trace, url);
        this.log(`Frame-ID: ${frame}`);
      }

      if (insightsListFrames) {
        try {
          trace = loadTraceFile(events);
          const traceLoad = trace.filter(isCommitLoad);
          traceLoad.forEach(
            ({
              args: {
                data: { frame, url },
              },
            }: {
              args: { data: { frame: any; url: any } };
            }) => {
              this.log(`Frame-ID: ${frame} - Frame-URL: ${url}`);
            }
          );
        } catch (error) {
          this.error(`${error}`);
        }
      }
    }

    spinner.stop();

    return this.log(
      `Trace JSON file successfully generated and available here: ${traceJSONOutput}`
    );
  }
}
