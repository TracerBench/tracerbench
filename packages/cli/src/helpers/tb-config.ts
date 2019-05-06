/* tslint:disable:no-console*/

import * as fs from 'fs-extra';
import * as path from 'path';
import { IMarker } from 'tracerbench';
import { PerformanceTimingMark } from './default-flag-args';
import { Network } from 'chrome-debugging-client/dist/protocol/tot';
import { chalkScheme } from './utils';

export interface ITBConfig {
  archive?: string;
  traceJSONOutput?: string;
  methods?: string;
  cpuThrottleRate?: number | string;
  fidelity?: 'test' | 'low' | 'med' | 'high';
  report?: string;
  event?: string;
  markers?: string | string[] | IMarker[] | PerformanceTimingMark[];
  network?: keyof INetworkConditions;
  output?: string;
  url?: string;
  controlURL?: string;
  experimentURL?: string;
  archiveOutput?: string;
  harOutput?: string;
  locations?: string;
  har?: string;
  filter?: string;
  marks?: string;
  urlOrFrame?: string;
  harsPath?: string;
  routes?: string[];
  appName?: string;
  browserArgs?: string[];
  iterations?: number | string;
  tracingLocationSearch?: string;
  runtimeStats?: 'true' | 'false';
}

type ITBConfigKeys = keyof ITBConfig;

export function getConfigDefault(id: ITBConfigKeys, defaultValue?: any) {
  let file;
  let tbconfig;

  try {
    file = path.join(process.cwd(), 'tbconfig.json');
    tbconfig = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (tbconfig[id]) {
      console.warn(
        `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON.stringify(
          tbconfig[id]
        )} from tbconfig.json`
      );
      return tbconfig[id];
    } else if (defaultValue) {
      console.warn(
        `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON.stringify(
          defaultValue
        )} from defaults`
      );
      return defaultValue;
    } else {
      return undefined;
    }
  } catch (error) {
    try {
      if (defaultValue) {
        console.warn(
          `${chalkScheme.checkmark} Fetching flag ${id} as ${JSON.stringify(
            defaultValue
          )} from defaults`
        );
        return defaultValue;
      }
      return undefined;
    } catch (error) {
      // throw new CLIError(error);
    }
  }
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
