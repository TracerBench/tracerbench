import { Command } from '@oclif/command';
import { harTrace } from 'parse-profile';
import { archiveOutput, url } from '../flags';

export default class CreateArchive extends Command {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    archiveOutput: archiveOutput({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { url, archiveOutput } = flags;

    await harTrace(url, archiveOutput);
    return this.log(`
      HAR successfully generated from ${url} and available here: ${archiveOutput}
      Cookies successfully generated and available here: "./cookies.json"
    `);
  }
}
