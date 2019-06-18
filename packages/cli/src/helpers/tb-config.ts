import { IMarker } from 'tracerbench';
import { PerformanceTimingMark } from './default-flag-args';
import { Network } from 'chrome-debugging-client/dist/protocol/tot';

export const CONTROL_ENV_OVERRIDE_ATTR = 'controlBenchmarkEnvironment';
export const EXPERIMENT_ENV_OVERRIDE_ATTR = 'experimentBenchmarkEnvironment';

export interface ITBConfig {
  plotTitle?: string;
  methods?: string;
  cpuThrottleRate?: number | string;
  fidelity?: 'test' | 'low' | 'medium' | 'high';
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
  routes?: string[];
  appName?: string;
  browserArgs?: string[];
  iterations?: number | string;
  tracingLocationSearch?: string;
  runtimeStats?: 'true' | 'false';
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [string, string];
  regressionThreshold?: number | string;

  // Optional overrides specific to control or experiment benchmark environments
  [CONTROL_ENV_OVERRIDE_ATTR]?: IBenchmarkEnvironmentOverride;
  [EXPERIMENT_ENV_OVERRIDE_ATTR]?: IBenchmarkEnvironmentOverride;
  [key: string]: any;
}

export interface IBenchmarkEnvironmentOverride {
  cpuThrottle?: number;
  network?: keyof INetworkConditions;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  [key: string]: any;
}

export interface INetworkConditions {
  none: Network.EmulateNetworkConditionsParameters;
  dialup: Network.EmulateNetworkConditionsParameters;
  '2g': Network.EmulateNetworkConditionsParameters;
  '3g': Network.EmulateNetworkConditionsParameters;
  offline: Network.EmulateNetworkConditionsParameters;
  cable: Network.EmulateNetworkConditionsParameters;
  dsl: Network.EmulateNetworkConditionsParameters;
  edge: Network.EmulateNetworkConditionsParameters;
  'slow-3g': Network.EmulateNetworkConditionsParameters;
  'em-3g': Network.EmulateNetworkConditionsParameters;
  'fast-3g': Network.EmulateNetworkConditionsParameters;
  '4g': Network.EmulateNetworkConditionsParameters;
  LTE: Network.EmulateNetworkConditionsParameters;
  FIOS: Network.EmulateNetworkConditionsParameters;
}
