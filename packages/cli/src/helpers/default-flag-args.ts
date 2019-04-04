import { ITBConfig, parseMarkers } from './utils';

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

export const defaultFlagArgs: ITBConfig = {
  cpuThrottleRate: 4,
  markers: parseMarkers(markerSets.ember),
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
  harsPath: './hars',
  archive: './trace.har',
  harOutput: './trace.har',
  archiveOutput: './trace.har',
  traceJSONOutput: './trace.json',
  methods: '""',
  fidelity: 'low',
  output: './tracerbench-results',
  url: 'http://localhost:8000/?tracing',
  controlURL: 'http://localhost:8000/?tracing',
  experimentURL: 'http://localhost:8001/?tracing',
  iterations: 1,
};
