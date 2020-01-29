import { IMarker, INetworkConditions } from '@tracerbench/core';
import { PerformanceTimingMark } from './default-flag-args';

export const CONTROL_ENV_OVERRIDE_ATTR = 'controlBenchmarkEnvironment';
export const EXPERIMENT_ENV_OVERRIDE_ATTR = 'experimentBenchmarkEnvironment';
export const EXTENDS = 'extends';

export interface ITBConfig {
  [EXTENDS]?: string;
  plotTitle?: string;
  methods?: string;
  cpuThrottleRate?: number | string;
  fidelity?: 'test' | 'low' | 'medium' | 'high' | number;
  report?: string;
  event?: string;
  markers?: string | string[] | IMarker[] | PerformanceTimingMark[];
  network?: keyof INetworkConditions;
  tbResultsFolder?: string;
  url?: string;
  controlURL?: string;
  experimentURL?: string;
  locations?: string;
  filter?: string;
  traceFrame?: string;
  appName?: string;
  browserArgs?: string[];
  iterations?: number | string;
  tracingLocationSearch?: string;
  runtimeStats?: boolean;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [number, number];
  inputFilePath?: string;
  outputFilePath?: string;
  regressionThreshold?: number | string;
  servers?: [IHARServer, IHARServer];
  headless?: boolean;
  debug?: boolean;
  // Optional overrides specific to control or experiment benchmark environments
  [CONTROL_ENV_OVERRIDE_ATTR]?: IBenchmarkEnvironmentOverride;
  [EXPERIMENT_ENV_OVERRIDE_ATTR]?: IBenchmarkEnvironmentOverride;
  [key: string]: any;
  cookiespath?: string;
  isCIEnv?: boolean | string;
  marker?: string;
}

export interface IHARServer {
  name: string;
  url: string;
  dist: string;
  socksPort: number;
  har: string;
}

export interface IBenchmarkEnvironmentOverride {
  cpuThrottle?: number;
  network?: keyof INetworkConditions;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  [key: string]: any;
}
