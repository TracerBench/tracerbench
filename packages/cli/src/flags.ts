import { flags } from '@oclif/command';
import { networkConditions } from 'parse-profile';
import { IMarker } from 'tracerbench';
import { getConfigDefault } from './utils';

enum FidelityLookup {
  test = 2,
  low = 20,
  medium = 30,
  high = 40
}

export const defaultFlagArgs = {
  cpuThrottleRate: 1,
  markers: [
    { start: 'fetchStart', label: 'jquery' },
    { start: 'jqueryLoaded', label: 'ember' },
    { start: 'emberLoaded', label: 'application' },
    { start: 'startRouting', label: 'routing' },
    { start: 'willTransition', label: 'transition' },
    { start: 'didTransition', label: 'render' },
    { start: 'renderEnd', label: 'afterRender' }
  ],
  browserArgs: [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--v8-cache-options=none',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--crash-dumps-dir=./tmp'
  ],
  harsPath: './hars',
  archive: './trace.har',
  harOutput: './trace.har',
  archiveOutput: './trace.har',
  traceJSONOutput: './trace.json',
  methods: '""',
  fidelity: 'low',
  output: 'tracerbench-results'
};

export const browserArgs = flags.build({
  default: () =>
    getConfigDefault('browserArgs', defaultFlagArgs.browserArgs) ||
    defaultFlagArgs.browserArgs,
  description: `(Default Recommended) Browser additional options for the TracerBench render benchmark`,
  parse: browserArgs => {
    if (typeof browserArgs === 'string') {
      return browserArgs.split(',');
    }
  }
});

export const routes = flags.build({
  default: () => getConfigDefault('routes'),
  description: `All routes to be analyzed by TracerBench. A HAR will be created for each route.`
});

export const appName = flags.build({
  default: () => getConfigDefault('appName'),
  description: 'The name of your application'
});

export const harsPath = flags.build({
  default: () =>
    getConfigDefault('harsPath', defaultFlagArgs.harsPath) ||
    defaultFlagArgs.harsPath,
  description: 'The output directory for recorded har files'
});

export const archiveOutput = flags.build({
  default: () =>
    getConfigDefault('archiveOutput', defaultFlagArgs.archiveOutput) ||
    defaultFlagArgs.archiveOutput,
  description: 'The output filepath/name to save the HAR to'
});

export const harOutput = flags.build({
  default: () =>
    getConfigDefault('harOutput', defaultFlagArgs.harOutput) ||
    defaultFlagArgs.archiveOutput,
  description: 'The output filepath/name to save the HAR to'
});

export const archive = flags.build({
  char: 'a',
  default: () =>
    getConfigDefault('archive', defaultFlagArgs.archive) ||
    defaultFlagArgs.archive,
  description: 'Path to the existing HAR file'
});

export const event = flags.build({
  default: () => getConfigDefault('event'),
  description: 'Slice time and see the events before and after the time slice'
});

export const traceJSONOutput = flags.build({
  char: 'f',
  default: () =>
    getConfigDefault('traceJSONOutput', defaultFlagArgs.traceJSONOutput) ||
    defaultFlagArgs.traceJSONOutput,
  description: 'Path to the existing trace JSON file'
});

export const methods = flags.build({
  char: 'm',
  default: () =>
    getConfigDefault('methods', defaultFlagArgs.methods) ||
    defaultFlagArgs.methods,
  description: 'List of methods to aggregate'
});

export const report = flags.build({
  char: 'r',
  default: () => getConfigDefault('report'),
  description: `Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics`
});

export const cpuThrottleRate = flags.build({
  default: () =>
    getConfigDefault('cpuThrottleRate', defaultFlagArgs.cpuThrottleRate) ||
    defaultFlagArgs.cpuThrottleRate,
  description: 'CPU throttle multiplier',
  parse: (cpuThrottleRate): number => {
    return parseInt(cpuThrottleRate, 10);
  }
});

export const control = flags.build({
  char: 'c',
  default: () => getConfigDefault('control'),
  description: 'The path to the control SHA'
});

export const experiment = flags.build({
  char: 'e',
  default: () => getConfigDefault('experiment'),
  description: 'The path to the experiment SHA'
});

export const fidelity = flags.build({
  default: () =>
    getConfigDefault('fidelity', defaultFlagArgs.fidelity) ||
    defaultFlagArgs.fidelity,
  description: `Directly correlates to the number of samples per trace. High means a longer trace time.`,
  options: [
    `${Object.keys(FidelityLookup).filter(
      k => typeof FidelityLookup[k as any] === 'number'
    )}`
  ],
  parse: (fidelity: any): number => {
    return parseInt(FidelityLookup[fidelity], 10);
  }
});

export const markers = flags.build({
  default: () =>
    getConfigDefault('markers', defaultFlagArgs.markers) ||
    defaultFlagArgs.markers,
  description: 'DOM markers',
  parse: (markers): IMarker[] => {
    const markerArray = markers.split(',');
    const a: IMarker[] = [];
    markerArray.forEach(marker => {
      a.push({
        label: marker,
        start: marker
      });
    });
    return a;
  }
});

export const network = flags.build({
  char: 'n',
  default: () => getConfigDefault('network'),
  description: 'Simulated network conditions.',
  options: [`${Object.keys(networkConditions).join(', ')}`]
});

export const output = flags.build({
  char: 'o',
  default: () =>
    getConfigDefault('output', defaultFlagArgs.output) ||
    defaultFlagArgs.output,
  description: 'The output filename for compare results'
});

export const url = flags.build({
  char: 'u',
  default: () => getConfigDefault('url'),
  description: 'URL to visit'
});

export const locations = flags.build({
  char: 'l',
  default: () => getConfigDefault('locations'),
  description: 'include locations in names'
});

export const har = flags.build({
  char: 'h',
  default: () => getConfigDefault('har', null) || null,
  description: 'Filepath to the existing HAR file'
});

export const filter = flags.build({
  default: () => getConfigDefault('filter'),
  description: 'User timing marks start with'
});

export const marks = flags.build({
  default: () => getConfigDefault('marks'),
  description: 'Show user timing marks'
});

export const urlOrFrame = flags.build({
  default: () => getConfigDefault('urlOrFrame'),
  description: 'URL or Frame'
});
