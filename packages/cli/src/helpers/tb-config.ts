import { IMarker } from 'tracerbench';
import { PerformanceTimingMark } from './default-flag-args';
import Protocol from 'devtools-protocol';

export const CONTROL_ENV_OVERRIDE_ATTR = 'controlBenchmarkEnvironment';
export const EXPERIMENT_ENV_OVERRIDE_ATTR = 'experimentBenchmarkEnvironment';
export const EXTENDS = 'extends';

export interface ITBConfig {
  [EXTENDS]?: string;
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
  appName?: string;
  browserArgs?: string[];
  iterations?: number | string;
  tracingLocationSearch?: string;
  runtimeStats?: 'true' | 'false';
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [string, string];
  inputFilePath?: string;
  outputFilePath?: string;
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
  none: Protocol.Network.EmulateNetworkConditionsRequest;
  dialup: Protocol.Network.EmulateNetworkConditionsRequest;
  '2g': Protocol.Network.EmulateNetworkConditionsRequest;
  '3g': Protocol.Network.EmulateNetworkConditionsRequest;
  offline: Protocol.Network.EmulateNetworkConditionsRequest;
  cable: Protocol.Network.EmulateNetworkConditionsRequest;
  dsl: Protocol.Network.EmulateNetworkConditionsRequest;
  edge: Protocol.Network.EmulateNetworkConditionsRequest;
  'slow-3g': Protocol.Network.EmulateNetworkConditionsRequest;
  'em-3g': Protocol.Network.EmulateNetworkConditionsRequest;
  'fast-3g': Protocol.Network.EmulateNetworkConditionsRequest;
  '4g': Protocol.Network.EmulateNetworkConditionsRequest;
  LTE: Protocol.Network.EmulateNetworkConditionsRequest;
  FIOS: Protocol.Network.EmulateNetworkConditionsRequest;
}
