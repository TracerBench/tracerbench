import { readJson, writeFileSync } from 'fs-extra';
import { resolve, join } from 'path';
import { setGracefulCleanup } from 'tmp';
import { recordHARClient, getBrowserArgs } from '@tracerbench/core';

import { TBBaseCommand } from '../command-config';
import { dest, url, cookiespath, filename, marker } from '../helpers/flags';

setGracefulCleanup();

export default class RecordHAR extends TBBaseCommand {
  public static description = 'Generates a HAR file from a URL.';
  public static flags = {
    url: url({ required: true, default: undefined }),
    dest: dest({ required: true }),
    cookiespath: cookiespath({ required: true }),
    filename: filename({ required: true, default: 'tracerbench' }),
    marker: marker({ required: true }),
  };

  public async run() {
    const { flags } = this.parse(RecordHAR);
    const { url, dest, cookiespath, filename, marker } = flags;

    // grab the auth cookies
    const cookies = await readJson(resolve(cookiespath));

    // record the actual HAR and return the archive file
    const harArchive = await recordHARClient(
      url,
      getBrowserArgs(),
      cookies,
      marker
    );

    const harPath = join(dest, `${filename}.har`);

    writeFileSync(harPath, JSON.stringify(harArchive));

    this.log(`HAR recorded and available here: ${harPath}`);
  }
}
