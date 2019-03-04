import { CLIError } from '@oclif/errors';

import * as fs from 'fs-extra';
import * as path from 'path';

interface ITBConfig {
  archive?: string;
  file?: string;
  methods?: string;
  control?: string;
  cpu?: string;
  experiment?: string;
  fidelity?: string;
  report?: string;
  event?: string;
  marker?: string;
  network?: string;
  output?: string;
  url?: string;
  archiveOutput?: string;
  locations?: string;
  har?: string;
  filter?: string;
  marks?: string;
  urlOrFrame?: string;
}

type ITBConfigKeys = keyof ITBConfig;

export function getConfigDefault(id: ITBConfigKeys) {
  try {
    const file = path.join(process.cwd(), 'tbconfig.json');
    const tbconfig = JSON.parse(fs.readFileSync(file, 'utf8'));
    return tbconfig[id];
  } catch (error) {
    throw new CLIError(
      `TracerBench tbconfig.json default value not found for ${id}`
    );
  }
}

export function getCookiesFromHAR(har: any) {
  let cookies: any = [];
  har.log.entries.forEach((entry: any) => {
    if (entry.response.cookies.length > 0) {
      cookies.push(entry.response.cookies);
    }
  });
  return (cookies = [].concat.apply([], cookies));
}

export function normalizeFnName(name: string) {
  if (name === '') {
    name = '(anonymous)';
  }
  return name;
}

export function loadTraceFile(file: any) {
  if (!Array.isArray(file)) {
    file = file.traceEvents;
  }
  return file;
}

export function collect(val: any, memo: any) {
  memo.push(val);
  return memo;
}

export function format(ts: number, start: number) {
  let ms = ((ts - start) / 1000).toFixed(2).toString();
  while (ms.length < 10) {
    ms = ' ' + ms;
  }
  return `${ms} ms`;
}

export function isMark(event: any) {
  return event.ph === 'R';
}

export function isFrameMark(frame: any, event: any) {
  return event.ph === 'R' && event.args.frame === frame;
}

export function isFrameNavigationStart(frame: any, event: any) {
  return isFrameMark(frame, event) && event.name === 'navigationStart';
}

export function isUserMark(event: any) {
  return (
    event.ph === 'R' &&
    event.cat === 'blink.user_timing' &&
    Object.keys(event.args).length === 0
  );
}

export function isCommitLoad(event: any) {
  return (
    event.ph === 'X' &&
    event.name === 'CommitLoad' &&
    event.args.data !== undefined &&
    event.args.data.isMainFrame
  );
}

export function byTime(a: any, b: any) {
  return a.ts - b.ts;
}

export function findFrame(events: any, url: any) {
  const event = events
    .filter(isCommitLoad)
    .find((e: any) => e.args.data.url.startsWith(url));
  if (event) {
    return event.args.data.frame;
  }
  return null;
}
