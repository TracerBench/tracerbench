/* tslint:disable:no-console*/

import chalk from 'chalk';
import * as logSymbols from 'log-symbols';
import { IMarker, ITraceEvent } from '@tracerbench/core';
import {
  IBenchmarkEnvironmentOverride,
  ITBConfig,
} from '../command-config/tb-config';
import { ICompareFlags } from '../commands/compare';

/**
 * Handles checking if there is a specific override for the attributeName in the tbConfigs for the given overrideObjectName.
 * Defaults to whatever is in the flags object if there is no override.
 *
 * @param attributeName - Attribute name to check if there is an override in overrideObjectName from tbConfig
 * @param flags - Object containing configs parsed from the Command class
 * @param overrideObjectName - Either "controlBenchmarkEnvironment" or "experimentBenchmarkEnvironment"
 * @param tbConfig - This refers to the parsed JSON from the config file if it exists
 */
export function checkEnvironmentSpecificOverride(
  attributeName: keyof ICompareFlags,
  flags: ICompareFlags,
  overrideObjectName: string,
  tbConfig?: ITBConfig
) {
  if (!tbConfig || !tbConfig[overrideObjectName]) {
    return flags[attributeName];
  }
  const environmentSpecificConfigs: IBenchmarkEnvironmentOverride = tbConfig[
    overrideObjectName
  ]!;

  if (!environmentSpecificConfigs[attributeName]) {
    return flags[attributeName];
  }

  return environmentSpecificConfigs[attributeName];
}

/**
 * Merge the contents of the right object into the left. Simply replace numbers, strings, arrays
 * and recursively call this function with objects.
 *
 * Note that typeof null == 'object'
 *
 * @param left - Destination object
 * @param right - Content of this object takes precedence
 */
export function mergeLeft(
  left: { [key: string]: any },
  right: { [key: string]: any }
): { [key: string]: any } {
  Object.keys(right).forEach(key => {
    const leftValue = left[key];
    const rightValue = left[key];
    const matchingObjectType =
      typeof leftValue === 'object' && typeof rightValue === 'object';
    const isOneArray = Array.isArray(leftValue) || Array.isArray(rightValue);

    if (matchingObjectType && (left[key] || right[key]) && !isOneArray) {
      mergeLeft(left[key], right[key]);
    } else {
      left[key] = right[key];
    }
  });

  return left;
}

export function convertMicrosecondsToMS(ms: string | number): number {
  ms = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return Math.floor(ms * 100) / 100000;
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

export function setTraceEvents(
  file: ITraceEvent[] | { metadata: {}; traceEvents: ITraceEvent[] }
) {
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

export const chalkScheme = {
  white: chalk.rgb(255, 255, 255),
  warning: chalk.rgb(255, 174, 66),
  header: chalk.rgb(255, 255, 255),
  regress: chalk.rgb(239, 100, 107),
  neutral: chalk.rgb(225, 225, 225),
  significant: chalk.rgb(0, 191, 255),
  imprv: chalk.rgb(135, 197, 113),
  phase: chalk.rgb(225, 225, 225),
  faint: chalk.rgb(80, 80, 80),
  checkmark: chalk.rgb(133, 153, 36)(`${logSymbols.success}`),
  blackBgGreen: chalk.green.bgGreen,
  blackBgRed: chalk.rgb(239, 100, 107).bgRed,
  blackBgBlue: chalk.rgb(24, 132, 228).bgRgb(24, 132, 228),
  blackBgYellow: chalk.rgb(255, 174, 66).bgRgb(255, 174, 66),
  tbBranding: {
    lime: chalk.rgb(199, 241, 106),
    blue: chalk.rgb(24, 132, 228),
    aqua: chalk.rgb(56, 210, 211),
    dkBlue: chalk.rgb(10, 45, 70),
    grey: chalk.rgb(153, 153, 153),
  },
};
