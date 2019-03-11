import { Command } from '@oclif/command';
import { harTrace } from 'parse-profile';
import * as fs from 'fs-extra';
import { har, url } from '../flags';

export default class CreateArchive extends Command {
  public static description = 'Creates an automated HAR file from a URL.';
  public static flags = {
    har: har({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(CreateArchive);
    const { url, har } = flags;

    let cookies: any = '';

    try {
      cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    } catch (error) {
      this.log(
        `Could not extract cookies from cookies.json. ${error}`
      );
      cookies = null;
    }

    await harTrace(url, har, cookies);
    return this.log(
      `HAR successfully generated from ${url} and available here: ${har}`
    );
  }
}
