import { flags } from '@oclif/command';
import { networkConditions } from 'tracerbench';
import { Network } from 'chrome-debugging-client/dist/protocol/tot';
import { defaultFlagArgs, fidelityLookup } from './default-flag-args';
import { getConfigDefault } from './tb-config';
import { parseMarkers } from './utils';
import deviceSettings, { EmulateDeviceSetting } from './simulate-device-options';

/*
! oclif flags.build#parse will only execute when the flag:string is passed directly
! from the cli. thus when passed via the tbconfig.json or the defaultFlagArgs 
! the parse method will never execute
! todo: mitigate above by either extending the flags oclif command calling parse
! and type checking in all circumstances
*/

export const json = flags.boolean({
  description: `compare command will stdout json rather than formatted results`,
});

export const debug = flags.boolean({
  description: `Debug flag per command. Will output noisy command`,
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
  description: `(Default Recommended) Browser additional options for the TracerBench render benchmark`,
  parse: browserArgs => {
    if (typeof browserArgs === 'string') {
      return browserArgs.split(',');
    }
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

export const routes = flags.build({
  default: () => getConfigDefault('routes'),
  description: `All routes to be analyzed by TracerBench. A HAR will be created for each route.`,
});

export const appName = flags.build({
  default: () => getConfigDefault('appName'),
  description: 'The name of your application',
});

export const harsPath = flags.build({
  default: () => getConfigDefault('harsPath', defaultFlagArgs.harsPath),
  description: 'The output directory for recorded har files',
});

export const archiveOutput = flags.build({
  default: () =>
    getConfigDefault('archiveOutput', defaultFlagArgs.archiveOutput),
  description: 'The output filepath/name to save the HAR to',
});

export const harOutput = flags.build({
  default: () => getConfigDefault('harOutput', defaultFlagArgs.harOutput),
  description: 'The output filepath/name to save the HAR to',
});

export const archive = flags.build({
  char: 'a',
  default: () => getConfigDefault('archive', defaultFlagArgs.archive),
  description: 'Path to the existing HAR file',
});

export const event = flags.build({
  default: () => getConfigDefault('event'),
  description: 'Slice time and see the events before and after the time slice',
});

export const traceJSONOutput = flags.build({
  char: 'f',
  default: () =>
    getConfigDefault('traceJSONOutput', defaultFlagArgs.traceJSONOutput),
  description: 'Output path for the trace JSON file',
});

export const methods = flags.build({
  char: 'm',
  default: () => getConfigDefault('methods', defaultFlagArgs.methods),
  description: 'List of methods to aggregate',
});

export const report = flags.build({
  char: 'r',
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
  description: `Directly correlates to the number of samples per trace. High means a longer trace time.`,
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
  char: 'n',
  default: () => getConfigDefault('network', defaultFlagArgs.network),
  description: 'Simulated network conditions.',
  options: [`${Object.keys(networkConditions).join(' | ')}`],
  parse: (n: string): Network.EmulateNetworkConditionsParameters => {
    return (networkConditions as any)[n];
  },
});

export const output = flags.build({
  char: 'o',
  default: () => getConfigDefault('output', defaultFlagArgs.output),
  description: 'The output filepath for compare results',
});

export const url = flags.build({
  default: () => getConfigDefault('url', defaultFlagArgs.url),
  description: 'URL to visit',
});

export const controlURL = flags.build({
  default: () => getConfigDefault('controlURL', defaultFlagArgs.controlURL),
  description: 'Control URL to visit',
});

export const experimentURL = flags.build({
  default: () =>
    getConfigDefault('experimentURL', defaultFlagArgs.experimentURL),
  description: 'Experiment URL to visit',
});

export const locations = flags.build({
  char: 'l',
  default: () => getConfigDefault('locations'),
  description: 'include locations in names',
});

export const har = flags.build({
  char: 'h',
  default: () => getConfigDefault('har', null) || null,
  description: 'Filepath to the existing HAR file',
});

export const filter = flags.build({
  default: () => getConfigDefault('filter'),
  description: 'User timing marks start with',
});

export const marks = flags.build({
  default: () => getConfigDefault('marks'),
  description: 'Show user timing marks',
});

export const urlOrFrame = flags.build({
  default: () => getConfigDefault('urlOrFrame'),
  description: 'URL or Frame',
});

export const emulateDevice = flags.build({
  char: 'e',
  default: () => getConfigDefault('emulateDevice', defaultFlagArgs.emulateDevice),
  description: 'Simulate a device\'s screen size.',
  options: deviceSettings.map(setting => `${setting.typeable}`),
  parse: (s: string): EmulateDeviceSetting | undefined => {
    for(const option of deviceSettings) {
      if (s === option.typeable) {
        return option;
      }
    }
  },
});