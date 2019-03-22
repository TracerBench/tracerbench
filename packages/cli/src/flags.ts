import { flags } from '@oclif/command';
import { IMarker, networkConditions } from 'tracerbench';
import { getConfigDefault, ITBConfig } from './utils';

export const fidelityLookup = {
  test: 2,
  low: 25,
  medium: 35,
  high: 50
};

export const defaultFlagArgs: ITBConfig = {
  cpuThrottleRate: 1,
  markers: [
    { start: 'fetchStart', label: 'fetchStart' },
    { start: 'jqueryLoaded', label: 'jqueryLoaded' },
    { start: 'emberLoaded', label: 'emberLoaded' },
    { start: 'startRouting', label: 'startRouting' },
    { start: 'willTransition', label: 'willTransition' },
    { start: 'didTransition', label: 'didTransition' },
    { start: 'renderEnd', label: 'renderEnd' }
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
  output: 'tracerbench-results',
  url: 'http://localhost:8000/?tracing',
  iterations: 1
};

interface ICpuProfileNode {
  id: number;
  children?: number[];
  positionTicks?: {
    line: number;
    ticks: number;
  };
}

export const iterations = flags.build({
  default: () => getConfigDefault('iterations', defaultFlagArgs.iterations),
  description: `Number of runs`,
  parse: iterations => {
    parseInt(iterations, 10);
  }
});

export const browserArgs = flags.build({
  default: () => getConfigDefault('browserArgs', defaultFlagArgs.browserArgs),
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
  default: () => getConfigDefault('harsPath', defaultFlagArgs.harsPath),
  description: 'The output directory for recorded har files'
});

export const archiveOutput = flags.build({
  default: () =>
    getConfigDefault('archiveOutput', defaultFlagArgs.archiveOutput),
  description: 'The output filepath/name to save the HAR to'
});

export const harOutput = flags.build({
  default: () => getConfigDefault('harOutput', defaultFlagArgs.harOutput),
  description: 'The output filepath/name to save the HAR to'
});

export const archive = flags.build({
  char: 'a',
  default: () => getConfigDefault('archive', defaultFlagArgs.archive),
  description: 'Path to the existing HAR file'
});

export const event = flags.build({
  default: () => getConfigDefault('event'),
  description: 'Slice time and see the events before and after the time slice'
});

export const traceJSONOutput = flags.build({
  char: 'f',
  default: () =>
    getConfigDefault('traceJSONOutput', defaultFlagArgs.traceJSONOutput),
  description: 'Path to the existing trace JSON file'
});

export const methods = flags.build({
  char: 'm',
  default: () => getConfigDefault('methods', defaultFlagArgs.methods),
  description: 'List of methods to aggregate'
});

export const report = flags.build({
  char: 'r',
  default: () => getConfigDefault('report'),
  description: `Directory path to generate a report with aggregated sums for each heuristic category and aggregated sum across all heuristics`
});

export const cpuThrottleRate = flags.build({
  default: () =>
    getConfigDefault('cpuThrottleRate', defaultFlagArgs.cpuThrottleRate),
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
  default: () => getConfigDefault('fidelity', defaultFlagArgs.fidelity),
  description: `Directly correlates to the number of samples per trace. High means a longer trace time.`,
  options: Object.keys(fidelityLookup),
  parse: (fidelity: string): number => {
    return parseInt((fidelityLookup as any)[fidelity], 10);
  }
});

export const markers = flags.build({
  default: () => getConfigDefault('markers', defaultFlagArgs.markers),
  description: 'DOM markers',
  parse: (markers: string): IMarker[] => {
    const a: IMarker[] = [];
    const m = markers.split(',');

    m.forEach(marker => {
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
  options: [`${Object.keys(networkConditions).join('|')}`]
});

export const output = flags.build({
  char: 'o',
  default: () => getConfigDefault('output', defaultFlagArgs.output),
  description: 'The output filename for compare results'
});

export const url = flags.build({
  char: 'u',
  default: () => getConfigDefault('url', defaultFlagArgs.url),
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
