/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint:disable:no-console*/
import { flags as oclifFlags } from "@oclif/command";

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

export const hideUsertimings = oclifFlags.boolean({
  description: `Hide stdout of user-timings.`,
  default: false,
});

export const runtimeStats = oclifFlags.boolean({
  description: `Compare command output deep-dive stats during run.`,
  default: false,
});

export const servers = oclifFlags.build({
  description: `Optional servers config for A/B testing with har-remix dist slicing with socks proxy. All paths within this config are relative.`,
});

export const plotTitle = oclifFlags.build({
  default: () => getDefaultValue("plotTitle"),
  description: `Specify the title of the report pdf/html files.`,
});

export const config = oclifFlags.build({
  description: `Specify an alternative directory rather than the project root for the tbconfig.json. This explicit config will overwrite all.`,
});

export const report = oclifFlags.boolean({
  description: `Generate a PDF report directly after running the compare command.`,
  default: false,
});

export const headless = oclifFlags.boolean({
  description: `Run with headless chrome flags`,
  default: false,
});

export const debug = oclifFlags.boolean({
  description: `Debug flag per command. Will output noisy command`,
  default: false,
});

export const regressionThreshold: oclifFlags.Definition<
  string | number
> = oclifFlags.build({
  default: () => getDefaultValue("regressionThreshold"),
  description: `The upper limit the experiment can regress slower in milliseconds. eg 50`,
  parse: (ms): number => {
    return parseInt(ms, 10);
  },
});

export const sampleTimeout: oclifFlags.Definition<number> = oclifFlags.build({
  default: () => getDefaultValue("sampleTimeout"),
  description: `The number of seconds to wait for a sample.`,
  parse: (ms): number => {
    return parseInt(ms, 10);
  },
});

export const browserArgs = oclifFlags.build({
  default: () => getDefaultValue("browserArgs"),
  description: `(Default Recommended) Additional chrome flags for the TracerBench render benchmark. TracerBench includes many non-configurable defaults in this category.`,
  parse: (s): string[] => {
    return s.split(",");
  },
});

export const appName = oclifFlags.build({
  default: () => getDefaultValue("appName"),
  description: "The name of your application",
});

export const event = oclifFlags.build({
  default: () => getDefaultValue("event"),
  description: "Slice time and see the events before and after the time slice",
});

export const methods = oclifFlags.build({
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

export const fidelity = oclifFlags.build({
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

export const markers = oclifFlags.build({
  default: () => getDefaultValue("markers"),
  description: "User Timing Markers",
  parse: parseMarkers,
});

export const network = oclifFlags.build({
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
});

export const tbResultsFolder = oclifFlags.build({
  default: () => getDefaultValue("tbResultsFolder"),
  description: "The output folder path for all tracerbench results",
});

export const url = oclifFlags.build({
  default: () => getDefaultValue("url"),
  description: "URL to visit for record-har, auth, timings & trace commands",
});

export const controlURL = oclifFlags.build({
  default: () => getDefaultValue("controlURL"),
  description: "Control URL to visit for compare command",
});

export const experimentURL = oclifFlags.build({
  default: () => getDefaultValue("experimentURL"),
  description: "Experiment URL to visit for compare command",
});

export const socksPorts = oclifFlags.build({
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

export const emulateDevice = oclifFlags.build({
  default: () => getDefaultValue("emulateDevice"),
  description: `Emulate a mobile device screen size.`,
  options: deviceSettings.map(
    (setting: EmulateDeviceSettingCliOption) => `${setting.typeable}`
  ),
});

export const emulateDeviceOrientation = oclifFlags.build({
  default: () => getDefaultValue("emulateDeviceOrientation"),
  description: `Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.`,
  options: ["horizontal", "vertical"],
});

export const cookiespath = oclifFlags.build({
  description: `The path to a JSON file containing cookies to authenticate against the correlated URL`,
  default: () => getDefaultValue("cookiespath"),
});

export const tbconfigpath = oclifFlags.build({
  description: `The path to a TracerBench configuration file (tbconfig.json)`,
});

export const tracepath = oclifFlags.build({
  description: `The path to the generated trace.json file`,
});

export const dest = oclifFlags.build({
  default: () => getDefaultValue("dest"),
  description: `The destination path for the generated file. Default process.cwd()`,
});

export const filename = oclifFlags.build({
  description: `The filename for the generated file`,
});

export const marker = oclifFlags.build({
  description: `The last marker before ending a HAR recording`,
  default: "loadEventEnd",
});

export const username = oclifFlags.build({
  description: `The username to login to the form`,
  required: true,
});

export const password = oclifFlags.build({
  description: `The password to login to the form`,
  required: true,
});

export const screenshots = oclifFlags.boolean({
  description: `Include chrome screenshots from command execution`,
  default: false,
});

export const proxy = oclifFlags.build({
  description: `Uses a specified proxy server, overrides system settings. Only affects HTTP and HTTPS requests.`,
  required: false,
});
