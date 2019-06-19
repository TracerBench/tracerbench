import { IMarker } from 'tracerbench';
import { PerformanceTimingMark } from './default-flag-args';
import Protocol from 'devtools-protocol';

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
