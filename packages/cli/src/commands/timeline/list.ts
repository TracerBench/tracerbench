import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import { isCommitLoad, loadTraceFile } from '../../utils';

interface ITrace {
  args: {
    data: {
      frame: any;
      url: any;
    };
  };
}

export default class List extends Command {
  public static description = 'list main frame loads';
  public static flags = {
    file: flags.string({
      char: 'f',
      default: './trace.json',
      description: 'Path to trace json file',
      required: true
    })
  };

  public async run() {
    const { flags } = this.parse(List);
    const file = flags.file;
    let traceFile: any = null;
    let trace: any = null;
    try {
      traceFile = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      this.error(
        `Could not extract trace events from trace file at path ${file}, ${error}`
      );
    }

    try {
      trace = loadTraceFile(traceFile);
      const traceLoad = trace.filter(isCommitLoad);
      traceLoad.forEach(({ args: { data: { frame, url } } }: ITrace) => {
        this.log('frame %s url %s', frame, url);
      });
    } catch (error) {
      this.error(`${error}`);
    }
  }
}
