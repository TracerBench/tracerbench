/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint:disable:no-console*/
import { flags as oclifFlags } from "@oclif/command";
import * as Parser from "@oclif/parser";
import { networkConditions } from "@tracerbench/core";
import Protocol from "devtools-protocol";

import {
  fidelityLookup,
  getDefaultValue,
} from "../command-config/default-flag-args";
import deviceSettings, {
  EmulateDeviceSettingCliOption,
} from "./device-settings";
import { parseMarkers } from "./utils";
/*
! oclif oclifFlags.build#parse will only execute when the flag:string is passed directly
! from the cli. thus when passed via the tbconfig.json or the defaultFlagArgs
! the parse method will never execute
! todo: mitigate above by either extending the flags oclif command calling parse
! and type checking in all circumstances
*/
export const isCIEnv = oclifFlags.build({
  description: `Provides a drastically slimmed down stdout report for CI workflows. However does NOT hide analysis.`,
  default: () => getDefaultValue("isCIEnv"),
  parse: (ci): boolean => {
    // if boolean return
    if (typeof ci === "boolean") {
      return ci;
    }
    // if string return boolean value
    return ci === "true";
  },
});

export const hideUsertimings: Parser.flags.IBooleanFlag<boolean> = oclifFlags.boolean(
  {
    description: `Hide stdout of user-timings.`,
    default: false,
  }
);

export const runtimeStats: Parser.flags.IBooleanFlag<boolean> = oclifFlags.boolean(
  {
    description: `Compare command output deep-dive stats during run.`,
    default: false,
  }
);

export const servers: oclifFlags.Definition<string> = oclifFlags.build({
  description: `Optional servers config for A/B testing with har-remix dist slicing with socks proxy. All paths within this config are relative.`,
});

export const plotTitle: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("plotTitle"),
  description: `Specify the title of the report pdf file.`,
});

export const config: oclifFlags.Definition<string> = oclifFlags.build({
  description: `Specify an alternative directory rather than the project root for the tbconfig.json. This explicit config will overwrite all.`,
});

export const report: Parser.flags.IBooleanFlag<boolean> = oclifFlags.boolean({
  description: `Generate a PDF report directly after running the compare command.`,
  default: false,
});

export const headless: Parser.flags.IBooleanFlag<boolean> = oclifFlags.boolean({
  description: `Run with headless chrome flags`,
  default: false,
});

export const debug: Parser.flags.IBooleanFlag<boolean> = oclifFlags.boolean({
  description: `Debug flag per command. Will output noisy command`,
  default: false,
});

export const regressionThreshold: oclifFlags.Definition<string> = oclifFlags.build(
  {
    default: () => getDefaultValue("regressionThreshold"),
    description: `The upper limit the experiment can regress slower in milliseconds. eg 50`,
    parse: (ms): number => {
      return parseInt(ms, 10);
    },
  }
);

export const browserArgs: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("browserArgs"),
  description: `(Default Recommended) Additional chrome flags for the TracerBench render benchmark. TracerBench includes many non-configurable defaults in this category.`,
  parse: (s): string[] => {
    return s.split(",");
  },
});

export const tracingLocationSearch: oclifFlags.Definition<string> = oclifFlags.build(
  {
    default: () => getDefaultValue("tracingLocationSearch"),
    description: `The document location search param.`,
  }
);

export const appName: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("appName"),
  description: "The name of your application",
});

export const event: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("event"),
  description: "Slice time and see the events before and after the time slice",
});

export const methods: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("methods"),
  description: "List of methods to aggregate",
});

export const cpuThrottleRate: oclifFlags.Definition<number> = oclifFlags.build({
  default: () => getDefaultValue("cpuThrottleRate"),
  description: "CPU throttle multiplier",
  parse: (cpuThrottleRate): number => {
    return parseInt(cpuThrottleRate, 10);
  },
});

export const fidelity: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("fidelity"),
  description: `Directly correlates to the number of samples per trace. eg. ${Object.keys(
    fidelityLookup
  )} OR any number between 2-100`,
  parse: (fidelity: string | number): number => {
    const warnMessage = `Expected --fidelity=${fidelity} to be either a number or one of: ${Object.keys(
      fidelityLookup
    )}. Defaulting to ${getDefaultValue("fidelity")}`;

    if (typeof fidelity === "string") {
      // integers are coming as string from oclif
      if (Number.isInteger(parseInt(fidelity, 10))) {
        return parseInt(fidelity, 10);
      }
      // is a string and is either test/low/med/high
      if (Object.keys(fidelityLookup).includes(fidelity)) {
        return parseInt((fidelityLookup as any)[fidelity], 10);
      } else {
        console.warn(`${warnMessage}`);
      }
    }
    return fidelity === "number" ? fidelity : getDefaultValue("fidelity");
  },
});

export const markers: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("markers"),
  description: "User Timing Markers",
  parse: parseMarkers,
});

export const network: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("network"),
  description: "Simulated network conditions.",
  options: [
    "none",
    "offline",
    "dialup",
    "slow-2g",
    "2g",
    "slow-edge",
    "edge",
    "slow-3g",
    "dsl",
    "3g",
    "fast-3g",
    "4g",
    "cable",
    "LTE",
    "FIOS",
  ],
  parse: (n: string): Protocol.Network.EmulateNetworkConditionsRequest => {
    return networkConditions[n as keyof typeof networkConditions];
  },
});

export const tbResultsFolder: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("tbResultsFolder"),
  description: "The output folder path for all tracerbench results",
});

export const url: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("url"),
  description: "URL to visit for record-har, timings & trace commands",
});

export const controlURL: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("controlURL"),
  description: "Control URL to visit for compare command",
});

export const experimentURL: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("experimentURL"),
  description: "Experiment URL to visit for compare command",
});

export const socksPorts: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("socksPorts"),
  description:
    "Specify a socks proxy port as browser option for control and experiment",
  parse: (s: string): [number, number] | undefined => {
    if (typeof s === "string") {
      const a = s.split(",");
      if (a.length > 2) {
        console.error(`Maximium of two socks ports can be passed`);
      }

      return [parseInt(a[0], 10), parseInt(a[1], 10)] as [number, number];
    }
  },
});

export const emulateDevice: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("emulateDevice"),
  description: `Emulate a mobile device screen size.`,
  options: deviceSettings.map(
    (setting: EmulateDeviceSettingCliOption) => `${setting.typeable}`
  ),
});

export const emulateDeviceOrientation: oclifFlags.Definition<string> = oclifFlags.build(
  {
    default: () => getDefaultValue("emulateDeviceOrientation"),
    description: `Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.`,
    options: ["horizontal", "vertical"],
  }
);

export const cookiespath: oclifFlags.Definition<string> = oclifFlags.build({
  description: `The path to a JSON file containing cookies to authenticate against the correlated URL`,
  default: () => getDefaultValue("cookiespath"),
});

export const tbconfigpath: oclifFlags.Definition<string> = oclifFlags.build({
  description: `The path to a TracerBench configuration file (tbconfig.json)`,
});

export const tracepath: oclifFlags.Definition<string> = oclifFlags.build({
  description: `The path to the generated trace.json file`,
});

export const dest: oclifFlags.Definition<string> = oclifFlags.build({
  default: () => getDefaultValue("dest"),
  description: `The destination path for the generated file`,
});

export const filename: oclifFlags.Definition<string> = oclifFlags.build({
  description: `The filename for the generated file`,
});

export const marker: oclifFlags.Definition<string> = oclifFlags.build({
  description: `The last marker before ending a HAR recording`,
  default: "loadEventEnd",
});
