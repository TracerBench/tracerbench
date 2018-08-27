import * as finder from "chrome-launcher/dist/chrome-finder";
import { getPlatform } from "chrome-launcher/dist/utils";
import { IResolveOptions } from "./types";

const CANARY_PATTERN = /Canary|unstable|SxS/i;

export default function resolveBrowser(options?: IResolveOptions): string {
  let executablePath =
    (options && options.executablePath) ||
    process.env.LIGHTHOUSE_CHROMIUM_PATH ||
    process.env.CHROME_PATH ||
    process.env.CHROME_BIN;
  let browserType = options && options.browserType;
  if (browserType === undefined) {
    browserType = executablePath === undefined ? "system" : "exact";
  }

  if (browserType === "exact") {
    if (executablePath === undefined) {
      throw new Error(
        `browserType exact requires the executablePath be specified or set as CHROME_PATH`,
      );
    }
  } else {
    executablePath = findExecutablePath(browserType);
  }

  return executablePath;
}

function findExecutablePath(browserType: "system" | "canary") {
  const platform = getPlatform();

  let executablePaths: string[] | undefined;
  if (isFinder(platform)) {
    executablePaths = finder[platform]();
  }

  if (executablePaths !== undefined) {
    if (browserType === "canary") {
      executablePaths = executablePaths.filter(p => CANARY_PATTERN.test(p));
    }
  }

  if (executablePaths === undefined || executablePaths.length === 0) {
    throw new Error(`Unable to find browser for type ${browserType}`);
  }

  return executablePaths[0];
}

function isFinder(platform: string): platform is "darwin" | "linux" {
  return typeof (finder as any)[platform] === "function";
}
