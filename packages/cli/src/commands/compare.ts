import * as fs from 'fs-extra';
import * as path from 'path';
import { Network } from 'chrome-debugging-client/dist/protocol/tot';
import { Command } from '@oclif/command';
import {
  IInitialRenderBenchmarkParams,
  InitialRenderBenchmark,
  Runner,
  networkConditions,
  IMarker,
} from 'tracerbench';
import {
  browserArgs,
  controlURL,
  cpuThrottleRate,
  experimentURL,
  fidelity,
  markers,
  network,
  tbResultsFolder,
  tracingLocationSearch,
  runtimeStats,
  json,
  debug,
  emulateDevice,
  emulateDeviceOrientation,
  socksPorts,
  regressionThreshold,
} from '../helpers/flags';
import { fidelityLookup } from '../helpers/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import { checkEnvironmentSpecificOverride, convertMSToMicroseconds, getTBConfigFromFile, parseMarkers } from '../helpers/utils';
import { getEmulateDeviceSettingForKeyAndOrientation } from '../helpers/simulate-device-options';
import { CONTROL_ENV_OVERRIDE_ATTR, EXPERIMENT_ENV_OVERRIDE_ATTR } from '../helpers/tb-config';

export interface ICompareFlags {
  browserArgs: string[];
  cpuThrottleRate: number;
  fidelity: number;
  markers: IMarker[];
  network: Network.EmulateNetworkConditionsParameters;
  tbResultsFolder: string;
  controlURL: string;
  experimentURL: string;
  tracingLocationSearch: string;
  runtimeStats: boolean;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [string, string] | undefined;
  json: boolean;
  debug: boolean;
  regressionThreshold?: number;
}

export default class Compare extends Command {
  public static description = 'Compare the performance delta between an experiment and control';
  public static flags = {
    browserArgs: browserArgs({ required: true }),
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    fidelity: fidelity({ required: true }),
    markers: markers({ required: true }),
    network: network({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    controlURL: controlURL({ required: true }),
    experimentURL: experimentURL({ required: true }),
    tracingLocationSearch: tracingLocationSearch({ required: true }),
    runtimeStats: runtimeStats({ required: true }),
    emulateDevice: emulateDevice(),
    emulateDeviceOrientation: emulateDeviceOrientation(),
    socksPorts: socksPorts(),
    regressionThreshold: regressionThreshold(),
    json,
    debug,
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      tbResultsFolder,
      debug,
      fidelity,
      markers,
      regressionThreshold
    } = flags as ICompareFlags;

    // modifies properties of flags that were not set
    // during flag.parse(). these are intentionally
    // not deconstructed as to maintain the mutable
    // flags object state
    // if (controlURL.startsWith('file:/')) {
    //   if (!fs.existsSync(controlURL)) {
    //     this.error(`controlURL file not found: ${controlURL}`);
    //   }
    // }
    // if (experimentURL.startsWith('file:/')) {
    //   if (!fs.existsSync(controlURL)) {
    //     this.error(`controlURL file not found: ${controlURL}`);
    //   }
    // }
    if (typeof fidelity === 'string') {
      flags.fidelity = parseInt((fidelityLookup as any)[fidelity], 10);
    }
    if (typeof markers === 'string') {
      flags.markers = parseMarkers(markers);
    }
    if (typeof regressionThreshold === 'string') {
      flags.regressionThreshold = convertMSToMicroseconds(regressionThreshold);
    }
    if (typeof regressionThreshold === 'number') {
      flags.regressionThreshold =
        regressionThreshold <= -1000
          ? regressionThreshold
          : convertMSToMicroseconds(regressionThreshold);
    }

    // if the folder for the tracerbench results file
    // does not exist then create it
    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder);
    }

    const [controlSettings, experimentSettings] = this.generateControlExperimentEnvironmentSettings(flags);
    // if debug flag then log X post mutations
    if (debug) {
      this.log(`\n FLAGS: ${JSON.stringify(flags)}`);
    }

    // todo: leverage har-remix?
    const benchmarks = {
      control: new InitialRenderBenchmark(controlSettings),
      experiment: new InitialRenderBenchmark(experimentSettings),
    };

    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(flags.fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${
              flags.controlURL
              }\nEXPERIMENT: ${flags.experimentURL}.`,
          );
        }

        fs.writeFileSync(
          `${flags.tbResultsFolder}/compare.json`,
          JSON.stringify(results, null, 2),
        );

        fs.writeFileSync(
          `${flags.tbResultsFolder}/compare-stat-results.json`,
          JSON.stringify(logCompareResults(results, flags, this), null, 2),
        );
      })
      .catch((err: any) => {
        this.error(err);
      });
  }


  /**
   * Final result of the configs are in the following order:
   *
   * controlConfigs = tbconfig:controlBenchmarkEnvironment > command line > tbconfig > default
   * experimentConfigs = tbconfig:experimentBenchmarkEnvironment > command line > tbconfig > default
   *
   * This functions handles the tsconfig:** part since it is assumed that parent function that passed input "flags"
   * would've handled "command line > tbconfig > default"
   *
   * @param flags - Object containing configs parsed from the Command class
   */
  private generateControlExperimentEnvironmentSettings(flags: ICompareFlags): [IInitialRenderBenchmarkParams, IInitialRenderBenchmarkParams] {
    const delay = 100;
    const controlBrowser = { additionalArguments: flags.browserArgs };
    const experimentBrowser = { additionalArguments: flags.browserArgs };
    let controlNetwork: string;
    let experimentNetwork: string;
    let experimentEmulateDevice;
    let experimentEmulateDeviceOrientation;
    let controlEmulateDevice;
    let controlEmulateDeviceOrientation;
    let controlSettings;
    let experimentSettings;
    let tbConfig;

    try {
      [ tbConfig ] = getTBConfigFromFile();
    } catch {
      tbConfig = undefined;
    }

    // config for the browsers to leverage socks proxy
    if (flags.socksPorts) {
      controlBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${flags.socksPorts[0]}`,
      );
      experimentBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${flags.socksPorts[1]}`,
      );
    }

    controlNetwork = checkEnvironmentSpecificOverride('network', flags, CONTROL_ENV_OVERRIDE_ATTR, tbConfig);
    controlEmulateDevice = checkEnvironmentSpecificOverride('emulateDevice', flags, CONTROL_ENV_OVERRIDE_ATTR, tbConfig);
    controlEmulateDeviceOrientation = checkEnvironmentSpecificOverride('emulateDeviceOrientation', flags, CONTROL_ENV_OVERRIDE_ATTR, tbConfig);
    experimentNetwork = checkEnvironmentSpecificOverride('network', flags, EXPERIMENT_ENV_OVERRIDE_ATTR, tbConfig);
    experimentEmulateDevice = checkEnvironmentSpecificOverride('emulateDevice', flags, EXPERIMENT_ENV_OVERRIDE_ATTR, tbConfig);
    experimentEmulateDeviceOrientation = checkEnvironmentSpecificOverride('emulateDeviceOrientation', flags, EXPERIMENT_ENV_OVERRIDE_ATTR, tbConfig);

    controlSettings = {
      browser: controlBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride('cpuThrottleRate', flags, CONTROL_ENV_OVERRIDE_ATTR, tbConfig),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(controlEmulateDevice, controlEmulateDeviceOrientation),
      markers: flags.markers,
      networkConditions: controlNetwork ? networkConditions[controlNetwork] : flags.network,
      name: 'control',
      runtimeStats: flags.runtimeStats,
      saveTraces: () => `${flags.tbResultsFolder}/control.json`,
      url: path.join(flags.controlURL + flags.tracingLocationSearch),
    };

    experimentSettings = {
      browser: experimentBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride('cpuThrottleRate', flags, EXPERIMENT_ENV_OVERRIDE_ATTR, tbConfig),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(experimentEmulateDevice, experimentEmulateDeviceOrientation),
      markers: flags.markers,
      networkConditions: experimentNetwork ? networkConditions[experimentNetwork] : flags.network,
      name: 'experiment',
      runtimeStats: flags.runtimeStats,
      saveTraces: () => `${flags.tbResultsFolder}/experiment.json`,
      url: path.join(flags.experimentURL + flags.tracingLocationSearch),
    };

    return [controlSettings, experimentSettings];
  }}
