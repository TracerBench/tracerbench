import { ITBConfig } from "./tb-config";

export const fidelityLookup = {
  test: 2,
  low: 20,
  medium: 30,
  high: 50,
};

export type PerformanceTimingMark = keyof PerformanceNavigationTiming;

// these default flag args are
// auto documented in the README.md
// in-addition to these we are defaulting
// chrome-debugging-client#defaultFlags.ts
export const defaultFlagArgs: ITBConfig = {
  plotTitle: "TracerBench",
  cpuThrottleRate: 2,
  fidelity: "low",
  markers: "domComplete",
  marker: "loadEventEnd",
  browserArgs: [
    "--crash-dumps-dir=./tmp",
    "--disable-background-timer-throttling",
    "--disable-dev-shm-usage",
    "--disable-cache",
    "--disable-v8-idle-tasks",
    "--disable-breakpad",
    "--disable-notifications",
    "--disable-hang-monitor",
    "--safebrowsing-disable-auto-update",
    "--ignore-certificate-errors",
    "--v8-cache-options=none",
  ],
  methods: '""',
  tbResultsFolder: "./tracerbench-results",
  network: "none",
  emulateDevice: "",
  emulateDeviceOrientation: "vertical",
  dest: "",
  regressionThreshold: 50,
  isCIEnv: false,
  cookiespath: "",
  url: "",
  sampleTimeout: 30,
  regressionThresholdStat: "estimator",
};

// specify with --headless flag
// ! --disable-gpu might cause issues with RHEL7
export const headlessFlags = [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--mute-audio",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDefaultValue(key: string): any {
  if (key in defaultFlagArgs) {
    return defaultFlagArgs[key];
  }
}
