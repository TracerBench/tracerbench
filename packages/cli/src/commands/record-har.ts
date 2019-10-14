import { Command } from '@oclif/command';
import { recordHARClient } from '@tracerbench/core';
import { readJson, writeFileSync } from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';

import { dest, url, cookiespath, filename } from '../helpers/flags';

tmp.setGracefulCleanup();

export default class RecordHAR extends Command {
  public static description = 'Generates a HAR file from a URL.';
  public static flags = {
    url: url({ required: true, default: undefined }),
    dest: dest({ required: true }),
    cookiespath: cookiespath({ required: true }),
    filename: filename({ required: true, default: 'tracerbench' }),
  };

  public async run() {
    const { flags } = this.parse(RecordHAR);
    const { url, dest, cookiespath, filename } = flags;

    // grab the auth cookies
    const cookies = await readJson(path.resolve(cookiespath));

    // record the actual HAR and return the archive file
    const harArchive = await recordHARClient(url, getBrowserArgs(), cookies);

    writeFileSync(
      path.join(dest, `${filename}.har`),
      JSON.stringify(harArchive)
    );

    this.log(
      `HAR recorded and available here: ${path.join(dest, filename)}.har`
    );
  }
}

function getBrowserArgs(): string[] {
  interface IViewOptions {
    windowSize: {
      width: number;
      height: number;
    };
    deviceScaleFactor: number;
    userAgent: string | undefined;
  }

  const tmpDir = tmp.dirSync({
    unsafeCleanup: true,
  });

  const options: IViewOptions = {
    windowSize: {
      width: 1280,
      height: 800,
    },
    deviceScaleFactor: 0,
    userAgent: undefined,
  };

  return [
    `--crash-dumps-dir=${tmpDir.name}`,
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-component-extensions-with-background-pages',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=NetworkPrediction',
    '--disable-features=site-per-process,TranslateUI,BlinkGenPropertyTrees',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-renderer-backgrounding',
    '--disable-sync',
    '--disable-translate',
    '--disable-v8-idle-tasks',
    `--device-scale-factor=${options.deviceScaleFactor}`,
    '--ignore-certificate-errors-spki-list=uU0W87bsSHNaY+g/o8S9PmyxIgf92JepLWrPg5bYb+s=',
    '--metrics-recording-only',
    '--no-pings',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-experiments',
    '--no-sandbox',
    '--password-store=basic',
    '--safebrowsing-disable-auto-update',
    '--use-mock-keychain',
    `--user-agent=${options.userAgent}`,
    `--user-data-dir=${tmpDir.name}`,
    '--v8-cache-options=none',
    `--window-size=${options.windowSize.width},${options.windowSize.height}`,
    '--headless',
  ];
}
