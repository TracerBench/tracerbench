import { ITBConfig } from './tb-config';

export const fidelityLookup = {
  test: 2,
  low: 11,
  medium: 18,
  high: 25,
};

export type PerformanceTimingMark = keyof PerformanceNavigationTiming;

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
// auto documented in the README.md
// in-addition to these we are defaulting
// chrome-debugging-client#defaultFlags.ts
export const defaultFlagArgs: ITBConfig = {
  cpuThrottleRate: 2,
  markers: 'domComplete',
  browserArgs: [
    '--crash-dumps-dir=./tmp',
    '--disable-background-timer-throttling',
    '--disable-dev-shm-usage',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--disable-breakpad',
    '--disable-notifications',
    '--disable-hang-monitor',
    '--safebrowsing-disable-auto-update',
    '--setIgnoreCertificateErrors=true',
    '--v8-cache-options=none',
  ],
  methods: '""',
  fidelity: 'low',
  tbResultsFolder: './tracerbench-results',
  url: 'http://localhost:8000/',
  controlURL: 'http://localhost:8000/',
  experimentURL: 'http://localhost:8001/',
  iterations: 1,
  tracingLocationSearch: '?tracing',
  network: 'none',
  runtimeStats: 'false',
  emulateDevice: '',
  emulateDeviceOrientation: 'vertical',
  regressionThreshold: '0ms',
};

// specify with --headless flag
export const headlessFlags = [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--disable-logging',
];
