/* tslint:disable:no-console*/

import chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import { IMarker, ITraceEvent } from 'tracerbench';
import * as fs from 'fs-extra';
import * as path from 'path';
import { IBenchmarkEnvironmentOverride, ITBConfig } from './tb-config';
import * as JSON5 from 'json5';
import { ICompareFlags } from '../commands/compare';

type ITBConfigKeys = keyof ITBConfig;

export const chalkScheme = {
  header: chalk.rgb(255, 255, 255),
  regress: chalk.rgb(239, 100, 107),
  neutral: chalk.rgb(225, 225, 225),
  significant: chalk.rgb(0, 191, 255),
  imprv: chalk.rgb(135, 197, 113),
  phase: chalk.rgb(225, 225, 225),
  faint: chalk.rgb(80, 80, 80),
  checkmark: chalk.rgb(133, 153, 36)(`${logSymbols.success}`),
  tbBranding: {
    lime: chalk.rgb(199, 241, 106),
    blue: chalk.rgb(24, 132, 228),
    aqua: chalk.rgb(56, 210, 211),
    dkBlue: chalk.rgb(10, 45, 70),
    grey: chalk.rgb(153, 153, 153)
  }
};

/**
 * Handles checking if there is a specific override for the attributeName in the tbConfigs for the given overrideObjectName.
 * Defaults to whatever is in the flags object if there is no override.
 *
 * @param attributeName - Attribute name to check if there is an override in overrideObjectName from tbConfig
 * @param flags - Object containing configs parsed from the Command class
 * @param overrideObjectName - Either "controlBenchmarkEnvironment" or "experimentBenchmarkEnvironment"
 * @param tbConfig - This refers to the parsed JSON from the config file if it exists
 */
export function checkEnvironmentSpecificOverride(attributeName: keyof ICompareFlags, flags: ICompareFlags, overrideObjectName: string, tbConfig?: ITBConfig) {
  if (!tbConfig || !tbConfig[overrideObjectName]) {
    return flags[attributeName];
  }
  const environmentSpecificConfigs: IBenchmarkEnvironmentOverride = tbConfig[overrideObjectName]!;

  if (!environmentSpecificConfigs[attributeName]) {
    return flags[attributeName];
  }

  return environmentSpecificConfigs[attributeName];
}

/**
 * Attempt to read tbconfig json file
 *
 * @param altTBconfigPath - Override default path with this parameter
 */
export function getTBConfigFromFile (altTBconfigPath?: string): [ITBConfig, string] {
  const tbConfigPath = altTBconfigPath ? altTBconfigPath : path.join(process.cwd(), 'tbconfig.json');
  try {
    return [JSON5.parse(fs.readFileSync(tbConfigPath, 'utf8')), tbConfigPath];
  } catch(error) {
    throw error;
  }
}

export function getConfigDefault(
  id: ITBConfigKeys,
  defaultValue?: any,
  altTBconfigPath?: string
) {
  let tbConfigPath;
  let tbConfig;

  try {
    [tbConfig, tbConfigPath] = getTBConfigFromFile(altTBconfigPath);
    if (tbConfig[id]) {
      console.warn(
        `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON5.stringify(
          tbConfig[id]
        )} from ${tbConfigPath}`
      );
      return tbConfig[id];
    } else if (defaultValue) {
      console.warn(
        `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON5.stringify(
          defaultValue
        )} from defaults`
      );
      return defaultValue;
    } else {
      return undefined;
    }
  } catch (error) {
    try {
      if (defaultValue) {
        console.warn(
          `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON5.stringify(
            defaultValue
          )} from defaults`
        );
        return defaultValue;
      }
      return undefined;
    } catch (error) {
      // throw new CLIError(error);
    }
  }
}

export function convertMSToMicroseconds(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 1000);
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

export function isMark(event: ITraceEvent) {
  return event.ph === 'R';
}

export function isFrameMark(frame: any, event: any) {
  return event.ph === 'R' && event.args.frame === frame;
}

export function isFrameNavigationStart(frame: any, event: ITraceEvent) {
  return isFrameMark(frame, event) && event.name === 'navigationStart';
}

export function isUserMark(event: ITraceEvent) {
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

export function findFrame(events: any[], url: any) {
  const event = events
    .filter(isCommitLoad)
    .find((e: any) => e.args.data.url.startsWith(url));
  if (event) {
    return event.args.data.frame;
  }
  return null;
}

export function parseMarkers(m: string | string[]): IMarker[] {
  const a: IMarker[] = [];
  if (typeof m === 'string') {
    m = m.split(',');
  }

  m.forEach(marker => {
    a.push({
      label: marker,
      start: marker,
    });
  });
  return a;
}

export function removeDuplicates<T>(collection: T[]) {
  return [...new Set(collection)];
}

export function fillArray(
  arrLngth: number,
  incr: number = 1,
  strt: number = 0
): number[] {
  const a = [];
  while (a.length < arrLngth) {
    if (a.length < 1) {
      a.push(strt);
    }
    a.push(strt + incr);
    strt = strt + incr;
  }
  return a;
}
/**
 * "name" is expected to be a titlecased string. We want something the user can type easily so the passed string
 * is converted into lowercased words dasherized. Any extra "/" will also be removed.
 *
 * @param str - String to be converted to dasherized case
 */
export function convertToTypable(name: string): string {
  const split = name.split(' ');
  const lowercasedWords = split.map(word =>
    word.toLowerCase().replace(/\//g, '')
  );
  return lowercasedWords.join('-');
}

export function toNearestHundreth(n: number): number {
  return Math.round(n * 100) / 100;
}