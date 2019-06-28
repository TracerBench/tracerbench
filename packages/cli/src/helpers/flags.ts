/* tslint:disable:no-console*/

import { flags } from '@oclif/command';
import { networkConditions } from 'tracerbench';
import Protocol from 'devtools-protocol';
import { defaultFlagArgs, fidelityLookup } from './default-flag-args';
import { parseMarkers, getConfigDefault } from './utils';
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
  default: () => getConfigDefault('plotTitle', defaultFlagArgs.plotTitle),
  description: `Specify the title of the report pdf file.`,
});

export const config = flags.build({
  description: `Specify an alternative tbconfig.json to extend from the root tbconfig.json. This explicit config will overwrite all.`,
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
  default: () =>
    getConfigDefault(
      'regressionThreshold',
      defaultFlagArgs.regressionThreshold
    ),
  description: `Regression threshold in negative milliseconds. eg -100ms`,
  parse: (ms): number => {
    return parseInt(ms, 10);
  },
});

export const runtimeStats = flags.build({
  default: () => getConfigDefault('runtimeStats', defaultFlagArgs.runtimeStats),
  description: `Compare command output stats during run`,
  parse: runtimeStats => {
    return runtimeStats === 'true';
  },
});

export const iterations = flags.build({
  default: () => getConfigDefault('iterations', defaultFlagArgs.iterations),
  description: `Number of runs`,
  parse: iterations => {
    parseInt(iterations, 10);
  },
});

export const browserArgs = flags.build({
  default: () => getConfigDefault('browserArgs', defaultFlagArgs.browserArgs),
  description: `(Default Recommended) Additional chrome flags for the TracerBench render benchmark. TracerBench includes many non-configurable defaults in this category.`,
  parse: (s): string[] => {
    return s.split(',');
  },
});

export const tracingLocationSearch = flags.build({
  default: () =>
    getConfigDefault(
      'tracingLocationSearch',
      defaultFlagArgs.tracingLocationSearch
    ),
  description: `The document location search param.`,
});

export const appName = flags.build({
  default: () => getConfigDefault('appName'),
  description: 'The name of your application',
});

export const event = flags.build({
  default: () => getConfigDefault('event'),
  description: 'Slice time and see the events before and after the time slice',
});

export const methods = flags.build({
  default: () => getConfigDefault('methods', defaultFlagArgs.methods),
  description: 'List of methods to aggregate',
});

export const report = flags.build({
  default: () => getConfigDefault('report'),
  description: `Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics`,
});

export const cpuThrottleRate = flags.build({
  default: () =>
    getConfigDefault('cpuThrottleRate', defaultFlagArgs.cpuThrottleRate),
  description: 'CPU throttle multiplier',
  parse: (cpuThrottleRate): number => {
    return parseInt(cpuThrottleRate, 10);
  },
});

export const fidelity = flags.build({
  default: () => getConfigDefault('fidelity', defaultFlagArgs.fidelity),
  description: `Directly correlates to the number of samples per trace. High is the longest trace time.`,
  options: Object.keys(fidelityLookup),
  parse: (fidelity: string): number => {
    return parseInt((fidelityLookup as any)[fidelity], 10);
  },
});

export const markers = flags.build({
  default: () => getConfigDefault('markers', defaultFlagArgs.markers),
  description: 'User Timing Markers',
  parse: parseMarkers,
});

export const network = flags.build({
  default: () => getConfigDefault('network', defaultFlagArgs.network),
  description: 'Simulated network conditions.',
  options: [`${Object.keys(networkConditions).join(' | ')}`],
  parse: (n: string): Protocol.Network.EmulateNetworkConditionsRequest => {
    return networkConditions[n as keyof typeof networkConditions];
  },
});

export const tbResultsFolder = flags.build({
  default: () =>
    getConfigDefault('tbResultsFolder', defaultFlagArgs.tbResultsFolder),
  description: 'The output folder path for all tracerbench results',
});

export const url = flags.build({
  default: () => getConfigDefault('url', defaultFlagArgs.url),
  description: 'URL to visit for create-archive, timings & trace commands',
});

export const controlURL = flags.build({
  default: () => getConfigDefault('controlURL', defaultFlagArgs.controlURL),
  description: 'Control URL to visit for compare command',
});

export const experimentURL = flags.build({
  default: () =>
    getConfigDefault('experimentURL', defaultFlagArgs.experimentURL),
  description: 'Experiment URL to visit for compare command',
});

export const locations = flags.build({
  default: () => getConfigDefault('locations'),
  description: 'include locations in names',
});

export const filter = flags.build({
  default: () => getConfigDefault('filter'),
  description: 'User timing marks start with',
});

export const traceFrame = flags.build({
  default: () => getConfigDefault('traceFrame'),
  description: 'Specify a trace insights frame',
});

export const socksPorts = flags.build({
  default: () => getConfigDefault('socksPorts'),
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
  default: () =>
    getConfigDefault('emulateDevice', defaultFlagArgs.emulateDevice),
  description: `Emulate a mobile device screen size.`,
  options: deviceSettings.map(setting => `${setting.typeable}`),
});

export const emulateDeviceOrientation = flags.build({
  default: () =>
    getConfigDefault(
      'emulateDeviceOrientation',
      defaultFlagArgs.emulateDeviceOrientation
    ),
  description: `Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.`,
  options: ['horizontal', 'vertical'],
});
