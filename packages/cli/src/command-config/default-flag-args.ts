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
  tracingLocationSearch: "?tracing",
  network: "none",
  emulateDevice: "",
  emulateDeviceOrientation: "vertical",
  dest: "",
  regressionThreshold: 100,
  isCIEnv: false,
  cookiespath: "",
  url: "",
};

// specify with --headless flag
// ! --disable-gpu might cause issues with RHEL7
export const headlessFlags = [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--mute-audio",
  "--disable-logging",
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getDefaultValue(key: string) {
  if (key in defaultFlagArgs) {
    return defaultFlagArgs[key];
  }
}
