import { readFileSync } from "fs";
import * as mkdirp from "mkdirp";
import { join } from "path";
import * as tar from "tar";
import { getJSON, getResponse, waitForFinish } from "./util";
// tslint:disable:no-console
export default async function downloadEmbers(channels: string[]) {
  for (const channel of channels) {
    await downloadEmber(channel, `test/vendor/ember-${channel}`);
  }
}

async function downloadEmber(channel: string, to: string) {
  console.debug(`fetching ${channel} meta`);
  const meta = await getBuildMeta(channel);
  if (alreadyDownloaded(meta.version, join(to, "package.json"))) {
    console.debug(`version ${meta.version} already downloaded`);
    return;
  }
  const tarball = await getTarBar(meta.assetPath);
  mkdirp.sync(to);
  const extract = tar.x({
    cwd: to,
    strip: 1,
    filter(p: string) {
      return /^package\/(?:dist\/ember|package\.json)/.test(p);
    }
  });
  tarball.pipe(extract);
  await waitForFinish(extract);
}

export function alreadyDownloaded(version: string, packagePath: string) {
  try {
    return JSON.parse(readFileSync(packagePath, "utf8")).version === version;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
      throw e;
    }
  }
  return false;
}

export function getTarBar(assetPath: string) {
  const url = `https://s3.amazonaws.com/builds.emberjs.com${assetPath}`;
  console.debug(`downloading ${url}`);
  return getResponse(url);
}

export function getBuildMeta(channel: string): Promise<IBuildMeta> {
  return getJSON(`https://s3.amazonaws.com/builds.emberjs.com/${channel}.json`);
}

export interface IBuildMeta {
  version: string;
  buildType: string;
  SHA: string;
  assetPath: string;
}
