import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import * as mkdirp from 'mkdirp';
import { join } from 'path';
import * as tar from 'tar';
import { getResponse, waitForFinish } from './util';

const buildMeta: {
  [channel: string]: IBuildMeta;
} = {
  release: {
    version: '3.10.2-release+41f1657f',
    buildType: 'release',
    SHA: '41f1657f68735f214efeaa96eac96e8e093b4981',
    assetPath: '/release/shas/41f1657f68735f214efeaa96eac96e8e093b4981.tgz',
  },
  beta: {
    version: '3.11.0-beta.4.beta+a1f5523c',
    buildType: 'beta',
    SHA: 'a1f5523cda5f12e4046b367744276de842cf1e45',
    assetPath: '/beta/shas/a1f5523cda5f12e4046b367744276de842cf1e45.tgz',
  },
  alpha: {
    version: '3.12.0-alpha+68ef63c7',
    buildType: 'alpha',
    SHA: '68ef63c7b2307ba35034132aa36a26cabc61fd0a',
    assetPath: '/alpha/shas/68ef63c7b2307ba35034132aa36a26cabc61fd0a.tgz',
  },
};

// tslint:disable:no-console
export default async function downloadEmbers(channels: string[]) {
  for (const channel of channels) {
    await downloadEmber(channel, `test/vendor/ember-${channel}`);
  }
}

async function downloadEmber(channel: string, to: string) {
  console.debug(`fetching ${channel}`);
  const meta = buildMeta[channel];
  if (alreadyDownloaded(meta.version, join(to, 'package.json'))) {
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
    },
  });
  tarball.pipe(extract);
  await waitForFinish(extract);
}

export function alreadyDownloaded(version: string, packagePath: string) {
  try {
    return JSON.parse(readFileSync(packagePath, 'utf8')).version === version;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw e;
    }
  }
  return false;
}

export function getTarBar(assetPath: string): Promise<IncomingMessage> {
  const url = `https://s3.amazonaws.com/builds.emberjs.com${assetPath}`;
  console.debug(`downloading ${url}`);
  return getResponse(url);
}

// export function getBuildMeta(channel: string): Promise<IBuildMeta> {
//   return getJSON(`https://s3.amazonaws.com/builds.emberjs.com/${channel}.json`);
// }

export interface IBuildMeta {
  version: string;
  buildType: string;
  SHA: string;
  assetPath: string;
}
