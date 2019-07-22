import { Command } from '@oclif/command';
import { harTrace } from '@tracerbench/core';
import { browserArgs, tbResultsFolder, url } from '../helpers/flags';
import * as path from 'path';
import * as fs from 'fs-extra';

export default class CreateArchive extends Command {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    browserArgs: browserArgs({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { browserArgs, url, tbResultsFolder } = flags;
    const archiveOutput = path.join(tbResultsFolder, 'trace.har');
    const cookiesJSON = path.join(tbResultsFolder, 'cookies.json');

    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder);
    }

    await harTrace(url, tbResultsFolder, browserArgs);
    return this.log(
      `HAR & cookies.json successfully generated from ${url} and available here: ${archiveOutput} and ${cookiesJSON}`
    );
  }
}
