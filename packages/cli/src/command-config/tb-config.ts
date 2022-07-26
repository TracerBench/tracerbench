/* eslint-disable @typescript-eslint/no-explicit-any */
import { INetworkConditions, Marker } from "@tracerbench/core";

import { PerformanceTimingMark } from "./default-flag-args";

export const CONTROL_ENV_OVERRIDE_ATTR = "controlBenchmarkEnvironment";
export const EXPERIMENT_ENV_OVERRIDE_ATTR = "experimentBenchmarkEnvironment";
export const EXTENDS = "extends";

export interface ITBConfig {
  [EXTENDS]?: string;
  plotTitle?: string;
  methods?: string;
  cpuThrottleRate?: number | string;
  fidelity?: "test" | "low" | "medium" | "high" | number;
  report?: string;
  event?: string;
  markers?: string | string[] | Marker[] | PerformanceTimingMark[];
  network?: keyof INetworkConditions & string;
  tbResultsFolder?: string;
  url?: string;
  controlURL?: string;
  experimentURL?: string;
  locations?: string;
  filter?: string;
  traceFrame?: string;
  appName?: string;
  browserArgs?: string[];
  runtimeStats?: boolean;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [number, number];
  inputFilePath?: string;
  outputFilePath?: string;
  regressionThreshold?: number | string;
  sampleTimeout?: number;
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
  regressionThresholdStat?: RegressionThresholdStat;
  //default to false, if it's true
  //it overrides the default loadEventEnd or the last marker in markers array as trace end
  traceEndAtLcp?: boolean;
  //the regex pattern to the LCP candidate element user want to measure, if undefined, we use the first LCP candidate
  lcpRegex?: string;
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

export type RegressionThresholdStat = "estimator" | "ci-lower" | "ci-upper";
