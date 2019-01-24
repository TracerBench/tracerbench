import { Network } from 'chrome-debugging-client/dist/protocol/tot';

export interface IConditions {
  network: keyof INetworkConditions;
  cpu: number;
}

export interface INetworkConditions {
  none: Network.EmulateNetworkConditionsParameters;
  'dialup': Network.EmulateNetworkConditionsParameters;
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

export const networkConditions: INetworkConditions = {
  'none': {
    latency: 0,
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
  },
  'offline': {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  },
  'dialup': {
    offline: false,
    latency: 120,
    downloadThroughput: 49000,
    uploadThroughput: 30000,
  },
  '2g': {
    offline: false,
    latency: 800,
    downloadThroughput: 280000,
    uploadThroughput: 256000,
  },
  'edge': {
    offline: false,
    latency: 840,
    downloadThroughput: 240000,
    uploadThroughput: 200000,
  },
  'slow-3g': {
    latency: 400,
    offline: false,
    downloadThroughput: 400000,
    uploadThroughput: 400000,
  },
  'em-3g': {
    latency: 400,
    offline: false,
    downloadThroughput: 400000,
    uploadThroughput: 400000,
  },
  'dsl': {
    latency: 50,
    offline: false,
    downloadThroughput: 1500000,
    uploadThroughput: 384000,
  },
  '3g': {
    latency: 300,
    offline: false,
    downloadThroughput: 1600000,
    uploadThroughput: 768000,
  },
  'fast-3g': {
    latency: 150,
    offline: false,
    downloadThroughput: 1600000,
    uploadThroughput: 768000,
  },
  '4g': {
    latency: 170,
    offline: false,
    downloadThroughput: 9000000,
    uploadThroughput: 9000000,
  },
  'cable': {
    offline: false,
    latency: 28,
    downloadThroughput: 5000000,
    uploadThroughput: 1000000,
  },
  'LTE': {
    offline: false,
    latency: 70,
    downloadThroughput: 12000000,
    uploadThroughput: 12000000,
  },
  'FIOS': {
    offline: false,
    latency: 4,
    downloadThroughput: 20000000,
    uploadThroughput: 5000000,
  },
};
