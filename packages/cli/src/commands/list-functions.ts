import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import { loadTrace } from 'tracerbench';
import { traceJSONOutput, locations } from '../flags';
import { normalizeFnName } from '../utils';

export default class ListFunctions extends Command {
  public static description =
    'Lists all the functions and source locations from a trace.';
  public static flags = {
    traceJSONOutput: traceJSONOutput({ required: true }),
    locations: locations()
  };

  public async run() {
    let events: any = '';
    let trace: any = null;
    let profile: any = null;

    const { flags } = this.parse(ListFunctions);
    const { traceJSONOutput, locations } = flags;
    const methods = new Set();

    try {
      events = JSON.parse(fs.readFileSync(traceJSONOutput, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace file at path ${traceJSONOutput}, ${error}`
      );
    }

    try {
      trace = loadTrace(events.traceEvents);
    } catch (error) {
      this.error(error);
    }

    try {
      profile = trace.cpuProfile(-1, -1);
    } catch (error) {
      this.error(error);
    }

    if (locations) {
      profile.nodeMap.forEach((node: any) => {
        const { functionName, url, lineNumber, columnNumber } = node.callFrame;

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

    methods.forEach(method =>
      this.log(`Successfully listed method: ${method}`)
    );
  }
}
