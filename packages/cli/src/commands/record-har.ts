import { readJson, writeFileSync } from 'fs-extra';
import { resolve, join } from 'path';
import { setGracefulCleanup } from 'tmp';
import { recordHARClient, getBrowserArgs } from '@tracerbench/core';

import { TBBaseCommand, getConfig } from '../command-config';
import {
  dest,
  url,
  cookiespath,
  filename,
  marker,
  config,
} from '../helpers/flags';

setGracefulCleanup();

export default class RecordHAR extends TBBaseCommand {
  public static description = 'Generates a HAR file from a URL.';
  public static flags = {
    url: url({ required: true, default: undefined }),
    dest: dest({ required: true }),
    cookiespath: cookiespath({ required: true }),
    filename: filename({ required: true, default: 'tracerbench' }),
    marker: marker({ required: true }),
    config: config(),
  };
  public async init() {
    const { flags } = this.parse(RecordHAR);
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);
  }

  public async run() {
    const { flags } = this.parse(RecordHAR);
    const { url, dest, cookiespath, filename, marker } = flags;
    let browserArgs;

    try {
      browserArgs = this.parsedConfig.browserArgs;
    } catch (e) {
      //
    }

    // grab the auth cookies
    const cookies = await readJson(resolve(cookiespath));

    // record the actual HAR and return the archive file
    const harArchive = await recordHARClient(
      url,
      cookies,
      marker,
      getBrowserArgs(browserArgs)
    );

    const harPath = join(dest, `${filename}.har`);

    writeFileSync(harPath, JSON.stringify(harArchive));

    this.log(`HAR recorded and available here: ${harPath}`);
  }
}
