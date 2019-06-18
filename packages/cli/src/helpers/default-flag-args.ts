import { ITBConfig } from './tb-config';

export const fidelityLookup = {
  test: 2,
  low: 11,
  medium: 18,
  high: 25,
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
    '--crash-dumps-dir=./tmp',
    '--disable-background-timer-throttling',
    '--disable-gpu',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--disable-translate',
    '--disable-breakpad',
    '--disable-sync',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-notifications',
    '--disable-hang-monitor',
    '--headless',
    '--hide-scrollbars',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-experiments',
    '--no-sandbox',
    '--noerrdialogs',
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
  routes: ['/'],
  regressionThreshold: '0ms',
};
