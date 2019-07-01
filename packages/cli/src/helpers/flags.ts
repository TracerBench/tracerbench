/* tslint:disable:no-console*/

import { flags } from '@oclif/command';
import { networkConditions } from '@tracerbench/core';
import Protocol from 'devtools-protocol';
import {
  fidelityLookup,
  getDefaultValue,
} from '../command-config/default-flag-args';
import { parseMarkers } from './utils';
import deviceSettings from './simulate-device-options';
/*
! oclif flags.build#parse will only execute when the flag:string is passed directly
! from the cli. thus when passed via the tbconfig.json or the defaultFlagArgs
! the parse method will never execute
! todo: mitigate above by either extending the flags oclif command calling parse
! and type checking in all circumstances
*/

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

export const json = flags.boolean({
  description: `If supported output the command stdout with json rather than formatted results`,
  default: false,
});

export const debug = flags.boolean({
  description: `Debug flag per command. Will output noisy command`,
  default: false,
});

export const regressionThreshold = flags.build({
  default: () => getDefaultValue('regressionThreshold'),
  description: `Regression threshold in negative milliseconds. eg -100ms`,
  parse: (ms): number => {
    return parseInt(ms, 10);
  },
});

export const runtimeStats = flags.build({
  default: () => getDefaultValue('runtimeStats'),
  description: `Compare command output stats during run`,
  parse: runtimeStats => {
    return runtimeStats === 'true';
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
  options: Object.keys(fidelityLookup),
  parse: (fidelity: string): number => {
    return parseInt((fidelityLookup as any)[fidelity], 10);
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
  options: [`${Object.keys(networkConditions).join(' | ')}`],
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
  description: 'URL to visit for create-archive, timings & trace commands',
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
  options: deviceSettings.map(setting => `${setting.typeable}`),
});

export const emulateDeviceOrientation = flags.build({
  default: () => getDefaultValue('emulateDeviceOrientation'),
  description: `Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.`,
  options: ['horizontal', 'vertical'],
});
