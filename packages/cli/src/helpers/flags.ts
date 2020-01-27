/* tslint:disable:no-console*/
import { flags } from '@oclif/command';
import { networkConditions } from '@tracerbench/core';
import Protocol from 'devtools-protocol';
import {
  fidelityLookup,
  getDefaultValue,
} from '../command-config/default-flag-args';
import { parseMarkers } from './utils';
import deviceSettings, {
  EmulateDeviceSettingCliOption,
} from './simulate-device-options';
/*
! oclif flags.build#parse will only execute when the flag:string is passed directly
! from the cli. thus when passed via the tbconfig.json or the defaultFlagArgs
! the parse method will never execute
! todo: mitigate above by either extending the flags oclif command calling parse
! and type checking in all circumstances
*/
export const isCIEnv = flags.build({
  description: `Provides a drastically slimmed down stdout report for CI workflows. However does NOT hide analysis.`,
  default: () => getDefaultValue('isCIEnv'),
  parse: (ci): boolean => {
    // if boolean return
    if (typeof ci === 'boolean') {
      return ci;
    }
    // if string return boolean value
    return ci === 'true';
  },
});

export const runtimeStats = flags.boolean({
  description: `Compare command output deep-dive stats during run.`,
  default: false,
});

export const servers = flags.build({
  description: `Optional servers config for A/B testing with har-remix dist slicing with socks proxy. All paths within this config are relative.`,
});

export const plotTitle = flags.build({
  default: () => getDefaultValue('plotTitle'),
  description: `Specify the title of the report pdf file.`,
});

export const config = flags.build({
  description: `Specify an alternative directory rather than the project root for the tbconfig.json. This explicit config will overwrite all.`,
});

export const report = flags.boolean({
  description: `Generate a PDF report directly after running the compare command.`,
  default: false,
});

export const headless = flags.boolean({
  description: `Run with headless chrome flags`,
  default: false,
});

export const insights = flags.boolean({
  description: `Analyze insights from command.`,
  default: false,
});

export const debug = flags.boolean({
  description: `Debug flag per command. Will output noisy command`,
  default: false,
});

export const regressionThreshold = flags.build({
  default: () => getDefaultValue('regressionThreshold'),
  description: `The upper limit the experiment can regress slower in milliseconds. eg 100`,
  parse: (ms): number => {
    return parseInt(ms, 10);
  },
});

export const iterations = flags.build({
  default: () => getDefaultValue('iterations'),
  description: `Number of runs`,
  parse: iterations => {
    parseInt(iterations, 10);
  },
});

export const browserArgs = flags.build({
  default: () => getDefaultValue('browserArgs'),
  description: `(Default Recommended) Additional chrome flags for the TracerBench render benchmark. TracerBench includes many non-configurable defaults in this category.`,
  parse: (s): string[] => {
    return s.split(',');
  },
});

export const tracingLocationSearch = flags.build({
  default: () => getDefaultValue('tracingLocationSearch'),
  description: `The document location search param.`,
});

export const appName = flags.build({
  default: () => getDefaultValue('appName'),
  description: 'The name of your application',
});

export const event = flags.build({
  default: () => getDefaultValue('event'),
  description: 'Slice time and see the events before and after the time slice',
});

export const methods = flags.build({
  default: () => getDefaultValue('methods'),
  description: 'List of methods to aggregate',
});

export const cpuThrottleRate = flags.build({
  default: () => getDefaultValue('cpuThrottleRate'),
  description: 'CPU throttle multiplier',
  parse: (cpuThrottleRate): number => {
    return parseInt(cpuThrottleRate, 10);
  },
});

export const fidelity = flags.build({
  default: () => getDefaultValue('fidelity'),
  description: `Directly correlates to the number of samples per trace. High is the longest trace time.`,
  parse: (fidelity: string | number): number => {
    const warnMessage = `Expected --fidelity=${fidelity} to be either a number or one of: ${Object.keys(
      fidelityLookup
    )}. Defaulting to ${getDefaultValue('fidelity')}`;

    if (typeof fidelity === 'string') {
      // integers are coming as string from oclif
      if (Number.isInteger(parseInt(fidelity, 10))) {
        return parseInt(fidelity, 10);
      }
      // is a string and is either test/low/med/high
      if (Object.keys(fidelityLookup).includes(fidelity)) {
        return parseInt((fidelityLookup as any)[fidelity], 10);
      } else {
        console.warn(`${warnMessage}`);
      }
    }
    return fidelity === 'number' ? fidelity : getDefaultValue('fidelity');
  },
});

export const markers = flags.build({
  default: () => getDefaultValue('markers'),
  description: 'User Timing Markers',
  parse: parseMarkers,
});

export const network = flags.build({
  default: () => getDefaultValue('network'),
  description: 'Simulated network conditions.',
  options: [
    'none',
    'offline',
    'dialup',
    'slow-2g',
    '2g',
    'slow-edge',
    'edge',
    'slow-3g',
    'dsl',
    '3g',
    'fast-3g',
    '4g',
    'cable',
    'LTE',
    'FIOS',
  ],
  parse: (n: string): Protocol.Network.EmulateNetworkConditionsRequest => {
    return networkConditions[n as keyof typeof networkConditions];
  },
});

export const tbResultsFolder = flags.build({
  default: () => getDefaultValue('tbResultsFolder'),
  description: 'The output folder path for all tracerbench results',
});

export const url = flags.build({
  default: () => getDefaultValue('url'),
  description: 'URL to visit for record-har, timings & trace commands',
});

export const controlURL = flags.build({
  default: () => getDefaultValue('controlURL'),
  description: 'Control URL to visit for compare command',
});

export const experimentURL = flags.build({
  default: () => getDefaultValue('experimentURL'),
  description: 'Experiment URL to visit for compare command',
});

export const locations = flags.build({
  default: () => getDefaultValue('locations'),
  description: 'include locations in names',
});

export const filter = flags.build({
  default: () => getDefaultValue('filter'),
  description: 'User timing marks start with',
});

export const traceFrame = flags.build({
  default: () => getDefaultValue('traceFrame'),
  description: 'Specify a trace insights frame',
});

export const socksPorts = flags.build({
  default: () => getDefaultValue('socksPorts'),
  description:
    'Specify a socks proxy port as browser option for control and experiment',
  parse: (s: string): [number, number] | undefined => {
    if (typeof s === 'string') {
      const a = s.split(',');
      if (a.length > 2) {
        console.error(`Maximium of two socks ports can be passed`);
      }

      return [parseInt(a[0], 10), parseInt(a[1], 10)] as [number, number];
    }
  },
});

export const emulateDevice = flags.build({
  default: () => getDefaultValue('emulateDevice'),
  description: `Emulate a mobile device screen size.`,
  options: deviceSettings.map(
    (setting: EmulateDeviceSettingCliOption) => `${setting.typeable}`
  ),
});

export const emulateDeviceOrientation = flags.build({
  default: () => getDefaultValue('emulateDeviceOrientation'),
  description: `Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.`,
  options: ['horizontal', 'vertical'],
});

export const cookiespath = flags.build({
  description: `The path to a JSON file containing cookies to authenticate against the correlated URL`,
});

export const tbconfigpath = flags.build({
  description: `The path to a TracerBench configuration file (tbconfig.json)`,
});

export const harpath = flags.build({
  description: `The path to the HTTP Archive File (HAR)`,
});

export const tracepath = flags.build({
  description: `The path to the generated trace.json file`,
});

export const dest = flags.build({
  default: () => getDefaultValue('dest'),
  description: `The destination path for the generated file`,
});

export const filename = flags.build({
  description: `The filename for the generated file`,
});

export const marker = flags.build({
  description: `The last marker before ending recording`,
  default: 'domComplete',
});
