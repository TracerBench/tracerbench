/* eslint-disable filenames/match-exported */
import { authClient } from "@tracerbench/core";
import Protocol from "devtools-protocol";
import { writeFileSync } from "fs-extra";
import { join, resolve } from "path";

import { getConfig, TBBaseCommand } from "../../command-config";
import { headlessFlags } from "../../command-config/default-flag-args";
import {
  config,
  dest,
  filename,
  headless,
  password,
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
  };
  public async init(): Promise<void> {
    const { flags } = this.parse(RecordHARAuth);
    flags.dest = !flags.dest ? process.cwd() : flags.dest;
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);
  }

  public async run(): Promise<Protocol.Network.CookieParam[]> {
    const { headless, url, username, password, filename, dest } = this
      .parsedConfig as RecordHARAuthOptions;
    let { browserArgs } = this.parsedConfig;

    // if headless flag is true include the headless flags
    if (headless) {
      browserArgs = Array.isArray(browserArgs)
        ? browserArgs.concat(headlessFlags)
        : headlessFlags;
    }

    this.log(`Retrieving cookies...`);
    // login to the url provided and retrieve the cookies
    const cookies = await authClient(
      url,
      username,
      password,
      headless,
      browserArgs
    );

    const cookiesPath = resolve(join(dest, `${filename}.json`));

    writeFileSync(cookiesPath, JSON.stringify(cookies));

    this.log(`  ✔ Cookies retrieved: ${cookiesPath}`);

    return cookies;
  }
}
