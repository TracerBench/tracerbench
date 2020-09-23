/* eslint-disable filenames/match-exported */
import { authClient } from "@tracerbench/core";
import Protocol from "devtools-protocol";
import { mkdirpSync, writeFileSync } from "fs-extra";
import { join, resolve } from "path";

import { getConfig, TBBaseCommand } from "../../command-config";
import { headlessFlags } from "../../command-config/default-flag-args";
import {
  config,
  dest,
  filename,
  headless,
  password,
  proxy,
  screenshots,
  url,
  username,
} from "../../helpers/flags";

type RecordHARAuthOptions = {
  url: string;
  dest: string;
  filename: string;
  username: string;
  config: string;
  headless: boolean;
  password: string;
  screenshots: boolean;
  proxy?: string;
};

export default class RecordHARAuth extends TBBaseCommand {
  public static description =
    "Authenticate with a given login URL, username, password and retrieve auth cookies";
  public static flags = {
    url: url({ required: true, default: undefined }),
    dest: dest({ required: true }),
    filename: filename({ required: true, default: "cookies" }),
    username: username({ required: true }),
    password: password({ required: true }),
    config: config(),
    headless,
    screenshots,
    proxy: proxy(),
  };
  public async init(): Promise<void> {
    const { flags } = this.parse(RecordHARAuth);
    flags.dest = !flags.dest ? process.cwd() : flags.dest;
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);
  }

  public async run(): Promise<Protocol.Network.CookieParam[]> {
    const {
      headless,
      url,
      username,
      password,
      filename,
      dest,
      screenshots,
      proxy,
    } = this.parsedConfig as RecordHARAuthOptions;
    let { browserArgs } = this.parsedConfig;

    // if headless flag is true include the headless flags
    if (headless) {
      browserArgs = Array.isArray(browserArgs)
        ? browserArgs.concat(headlessFlags)
        : headlessFlags;
    }

    // if using a proxy server include the chrome switch with proxy url
    if (proxy) {
      const proxyServer = [`--proxy-server=${proxy}`];
      browserArgs = Array.isArray(browserArgs)
        ? browserArgs.concat(proxyServer)
        : proxyServer;
    }

    mkdirpSync(dest);

    this.log(`Retrieving cookies ...`);

    // login to the url provided and retrieve the cookies
    const authClientResponse = await authClient(
      url,
      username,
      password,
      headless,
      browserArgs,
      screenshots
    );

    const cookiesPath = resolve(join(dest, `${filename}.json`));

    if (screenshots && authClientResponse.screenshotData) {
      authClientResponse.screenshotData.map((screenshot) => {
        const screenshotName = `record-har-auth-${screenshot.name}-screenshot.png`;
        const screenshotPath = resolve(join(dest, screenshotName));

        writeFileSync(screenshotPath, screenshot.data, {
          encoding: "base64",
        });

        this.log(`  ✔ ${screenshot.name} screenshot: ${screenshotPath}`);
      });
    }

    writeFileSync(cookiesPath, JSON.stringify(authClientResponse.cookies));

    this.log(`  ✔ Cookies: ${cookiesPath}`);

    return authClientResponse.cookies;
  }
}
