import Protocol from 'devtools-protocol';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Command } from '@oclif/command';
import {
  IInitialRenderBenchmarkParams,
  InitialRenderBenchmark,
  Runner,
  networkConditions,
  IMarker,
} from '@tracerbench/core';
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
  headless,
  config,
} from '../helpers/flags';
import { fidelityLookup, headlessFlags } from '../helpers/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import {
  checkEnvironmentSpecificOverride,
  getRootTBConfigOrOverride,
  parseMarkers,
  mergeLeft,
} from '../helpers/utils';
import { getEmulateDeviceSettingForKeyAndOrientation } from '../helpers/simulate-device-options';
import {
  CONTROL_ENV_OVERRIDE_ATTR,
  EXPERIMENT_ENV_OVERRIDE_ATTR,
} from '../helpers/tb-config';

export interface ICompareFlags {
  browserArgs: string[];
  cpuThrottleRate: number;
  fidelity: number;
  markers: IMarker[];
  network: Protocol.Network.EmulateNetworkConditionsRequest;
  tbResultsFolder: string;
  controlURL: string;
  experimentURL: string;
  tracingLocationSearch: string;
  runtimeStats: boolean;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [string, string] | [number, number] | undefined;
  json: boolean;
  debug: boolean;
  regressionThreshold?: number;
  headless: boolean;
  config?: string;
}

export default class Compare extends Command {
  public static description =
    'Compare the performance delta between an experiment and control';
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
    config: config(),
    json,
    debug,
    headless,
  };
  public mergedFlags: ICompareFlags = this.parse(Compare).flags;

  // instantiated before this.run()
  public async init() {
    const { flags } = this.parse(Compare);

    this.mergedFlags = flags;
    if (typeof flags.config === 'string') {
      // merge the dominant customTBConfig
      // into flags which is defaults, rootTBConfig and inline flags
      // the customTBConfig will overwrite all
      const [customTBConfig] = getRootTBConfigOrOverride(flags.config);
      this.mergedFlags = mergeLeft(flags, customTBConfig) as ICompareFlags;
    }

    await this.parseFlags();
  }

  public async run() {
    const [
      controlSettings,
      experimentSettings,
    ] = this.generateControlExperimentServerConfig();

    // ! this should be directly above the instantiation of the InitialRenderBenchmarks
    // if debug flag then log X post mutations
    if (this.mergedFlags.debug) {
      Object.entries(this.mergedFlags).forEach(([key, value]) => {
        if (value) {
          this.log(`${key}: ${JSON.stringify(value)}`);
        }
      });
    }

    const benchmarks = {
      control: new InitialRenderBenchmark(controlSettings),
      experiment: new InitialRenderBenchmark(experimentSettings),
    };
    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(this.mergedFlags.fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${
              this.mergedFlags.controlURL
            }\nEXPERIMENT: ${this.mergedFlags.experimentURL}.`
          );
        }

        fs.writeFileSync(
          `${this.mergedFlags.tbResultsFolder}/compare.json`,
          JSON.stringify(results, null, 2)
        );

        fs.writeFileSync(
          `${this.mergedFlags.tbResultsFolder}/compare-stat-results.json`,
          JSON.stringify(
            logCompareResults(results, this.mergedFlags, this),
            null,
            2
          )
        );

        // with debug flag output three files
        // on config specifics
        if (this.mergedFlags.debug) {
          fs.writeFileSync(
            `${this.mergedFlags.tbResultsFolder}/server-control-settings.json`,
            JSON.stringify(Object.assign(controlSettings), null, 2)
          );

          fs.writeFileSync(
            `${
              this.mergedFlags.tbResultsFolder
            }/server-experiment-settings.json`,
            JSON.stringify(Object.assign(experimentSettings), null, 2)
          );

          fs.writeFileSync(
            `${this.mergedFlags.tbResultsFolder}/compare-flags-settings.json`,
            JSON.stringify(Object.assign(this.mergedFlags), null, 2)
          );
        }
      })
      .catch((err: any) => {
        this.error(err);
      });
  }

  private async parseFlags() {
    const {
      tbResultsFolder,
      fidelity,
      markers,
      regressionThreshold,
      headless,
    } = this.mergedFlags as ICompareFlags;

    // modifies properties of flags that were not set
    // during flag.parse(). these are intentionally
    // not deconstructed as to maintain the mutable
    // flags object state
    if (typeof fidelity === 'string') {
      this.mergedFlags.fidelity = parseInt(
        (fidelityLookup as any)[fidelity],
        10
      );
    }
    if (typeof markers === 'string') {
      this.mergedFlags.markers = parseMarkers(markers);
    }
    if (typeof regressionThreshold === 'string') {
      this.mergedFlags.regressionThreshold = parseInt(regressionThreshold, 10);
    }
    // if headless flag is true include the headless flags
    if (headless) {
      this.mergedFlags.browserArgs = this.mergedFlags.browserArgs.concat(
        headlessFlags
      );
    }

    // if the folder for the tracerbench results file
    // does not exist then create it
    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder);
    }
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
   * @param this.mergedFlags - Object containing configs parsed from the Command class
   */
  private generateControlExperimentServerConfig(): [
    IInitialRenderBenchmarkParams,
    IInitialRenderBenchmarkParams
  ] {
    const delay = 100;
    const controlBrowser = {
      additionalArguments: this.mergedFlags.browserArgs,
    };
    const experimentBrowser = {
      additionalArguments: this.mergedFlags.browserArgs,
    };
    let controlNetwork: string;
    let experimentNetwork: string;
    let experimentEmulateDevice;
    let experimentEmulateDeviceOrientation;
    let controlEmulateDevice;
    let controlEmulateDeviceOrientation;
    let controlSettings: IInitialRenderBenchmarkParams;
    let experimentSettings: IInitialRenderBenchmarkParams;
    let tbConfig;

    try {
      [tbConfig] = getRootTBConfigOrOverride();
    } catch {
      tbConfig = undefined;
    }

    // config for the browsers to leverage socks proxy
    if (this.mergedFlags.socksPorts) {
      controlBrowser.additionalArguments = controlBrowser.additionalArguments.concat(
        [`--proxy-server=socks5://0.0.0.0:${this.mergedFlags.socksPorts[0]}`]
      );
      experimentBrowser.additionalArguments = experimentBrowser.additionalArguments.concat(
        [`--proxy-server=socks5://0.0.0.0:${this.mergedFlags.socksPorts[1]}`]
      );
    }
    controlNetwork = checkEnvironmentSpecificOverride(
      'network',
      this.mergedFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      tbConfig
    );
    controlEmulateDevice = checkEnvironmentSpecificOverride(
      'emulateDevice',
      this.mergedFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      tbConfig
    );
    controlEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      'emulateDeviceOrientation',
      this.mergedFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      tbConfig
    );
    experimentNetwork = checkEnvironmentSpecificOverride(
      'network',
      this.mergedFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      tbConfig
    );
    experimentEmulateDevice = checkEnvironmentSpecificOverride(
      'emulateDevice',
      this.mergedFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      tbConfig
    );
    experimentEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      'emulateDeviceOrientation',
      this.mergedFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      tbConfig
    );

    controlSettings = {
      browser: controlBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        'cpuThrottleRate',
        this.mergedFlags,
        CONTROL_ENV_OVERRIDE_ATTR,
        tbConfig
      ),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(
        controlEmulateDevice,
        controlEmulateDeviceOrientation
      ),
      markers: this.mergedFlags.markers,
      networkConditions: controlNetwork
        ? networkConditions[controlNetwork as keyof typeof networkConditions]
        : this.mergedFlags.network,
      name: 'control',
      runtimeStats: this.mergedFlags.runtimeStats,
      saveTraces: () => `${this.mergedFlags.tbResultsFolder}/control.json`,
      url: path.join(
        this.mergedFlags.controlURL + this.mergedFlags.tracingLocationSearch
      ),
    };

    experimentSettings = {
      browser: experimentBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        'cpuThrottleRate',
        this.mergedFlags,
        EXPERIMENT_ENV_OVERRIDE_ATTR,
        tbConfig
      ),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(
        experimentEmulateDevice,
        experimentEmulateDeviceOrientation
      ),
      markers: this.mergedFlags.markers,
      networkConditions: experimentNetwork
        ? networkConditions[experimentNetwork as keyof typeof networkConditions]
        : this.mergedFlags.network,
      name: 'experiment',
      runtimeStats: this.mergedFlags.runtimeStats,
      saveTraces: () => `${this.mergedFlags.tbResultsFolder}/experiment.json`,
      url: path.join(
        this.mergedFlags.experimentURL + this.mergedFlags.tracingLocationSearch
      ),
    };

    return [controlSettings, experimentSettings];
  }
}
