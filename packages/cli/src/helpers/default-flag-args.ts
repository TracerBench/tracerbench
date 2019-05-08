import { ITBConfig } from './tb-config';

export const fidelityLookup = {
  test: 2,
  low: 25,
  medium: 35,
  high: 50,
};

export type PerformanceTimingMark = keyof PerformanceTiming;

interface IMarkerSets {
  ember: string[];
  performanceTiming: PerformanceTimingMark[];
}

// todo: flesh these out
export const markerSets: IMarkerSets = {
  ember: [
    'fetchStart',
    'emberLoaded',
    'startRouting',
    'willTransition',
    'didTransition',
    'renderEnd',
  ],
  performanceTiming: ['domComplete'],
};

// these default flag args are
// **auto documented** in the README.md
export const defaultFlagArgs: ITBConfig = {
  cpuThrottleRate: 4,
  markers: 'domComplete',
  browserArgs: [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--v8-cache-options=none',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--crash-dumps-dir=./tmp',
  ],
  methods: '""',
  fidelity: 'low',
  tbResultsFile: './tracerbench-results',
  url: 'http://localhost:8000/',
  controlURL: 'http://localhost:8000/',
  experimentURL: 'http://localhost:8001/',
  iterations: 1,
  tracingLocationSearch: '?tracing',
  network: 'none',
  runtimeStats: 'false',
  routes: ['/'],
};
