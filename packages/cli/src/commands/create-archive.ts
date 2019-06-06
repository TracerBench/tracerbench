import { Command } from '@oclif/command';
import { harTrace } from 'tracerbench';
import { tbResultsFolder, url } from '../helpers/flags';
import * as path from 'path';

export default class CreateArchive extends Command {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    tbResultsFolder: tbResultsFolder({ required: true }),
    url: url({ required: true }),
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { url, tbResultsFolder } = flags;
    const archiveOutput = path.join(tbResultsFolder, 'trace.har');
    const cookiesJSON = path.join(tbResultsFolder, 'cookies.json');

    await harTrace(url, tbResultsFolder);
    return this.log(
      `HAR & cookies.json successfully generated from ${url} and available here: ${archiveOutput} and ${cookiesJSON}`
    );
  }
}
