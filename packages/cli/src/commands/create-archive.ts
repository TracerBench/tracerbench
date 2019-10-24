import { TBBaseCommand } from '../command-config';
import { harTrace } from '@tracerbench/core';
import { browserArgs, tbResultsFolder, url } from '../helpers/flags';
import * as path from 'path';
import * as fs from 'fs-extra';

export default class CreateArchive extends TBBaseCommand {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    browserArgs: browserArgs({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    url: url({ required: true }),
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { browserArgs, url, tbResultsFolder } = flags;
    const archiveOutput = path.join(tbResultsFolder, 'trace.har');
    const cookiesJSON = path.join(tbResultsFolder, 'cookies.json');
    let cookies;
    let harArchive;

    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder);
    }

    [cookies, harArchive] = await harTrace(url, browserArgs);
    fs.writeFileSync(cookiesJSON, JSON.stringify(cookies));
    fs.writeFileSync(archiveOutput, JSON.stringify(harArchive));

    this.log(
      `Captured ${harArchive.log.entries.length} request responses in har file.`
    );
    return this.log(
      `HAR & cookies.json successfully generated from ${url} and available here: ${archiveOutput} and ${cookiesJSON}`
    );
  }
}
