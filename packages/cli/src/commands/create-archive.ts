import { Command } from '@oclif/command';
import { harTrace } from 'tracerbench';
import { tbResultsFile, url } from '../helpers/flags';
import * as path from 'path';

export default class CreateArchive extends Command {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    tbResultsFile: tbResultsFile({ required: true }),
    url: url({ required: true }),
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { url, tbResultsFile } = flags;
    const archiveOutput = path.join(tbResultsFile, 'trace.har');
    const cookiesJSON = path.join(tbResultsFile, 'cookies.json');

    await harTrace(url, tbResultsFile);
    return this.log(
      `HAR & cookies.json successfully generated from ${url} and available here: ${archiveOutput} and ${cookiesJSON}`
    );
  }
}
