import { IMarker } from 'tracerbench';
import { PerformanceTimingMark } from './default-flag-args';
import { Network } from 'chrome-debugging-client/dist/protocol/tot';

export interface ITBConfig {
  plotTitle?: string;
  methods?: string;
  cpuThrottleRate?: number | string;
  fidelity?: 'test' | 'low' | 'medium' | 'high';
  report?: string;
  event?: string;
  markers?: string | string[] | IMarker[] | PerformanceTimingMark[];
  network?: keyof INetworkConditions;
  tbResultsFile?: string;
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
  emulateDevice?: string | null;
  socksPorts?: [string, string];
  regressionThreshold?: number | string;
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
