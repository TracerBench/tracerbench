import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { loadTrace } from 'parse-profile';
import { normalizeFnName } from '../utils';

export default class ListFunctions extends Command {
  public static description =
    'Lists all the functions and source locations from a trace.';
  public static flags = {
    file: flags.string({
      char: 'f',
      default: './trace.json',
      description: 'Path to trace json file',
      required: true
    }),
    locations: flags.string({
      char: 'l',
      description: 'include locations in names'
    })
  };

  public async run() {
    let events: any = '';
    let trace: any = null;
    let profile: any = null;

    const { flags } = this.parse(ListFunctions);
    const { file, locations } = flags;
    const methods = new Set();

    try {
      events = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace file at path ${file}, ${error}`
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
