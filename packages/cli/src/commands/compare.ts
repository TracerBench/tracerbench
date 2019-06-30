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
  report,
} from '../helpers/flags';
import {
  fidelityLookup,
  headlessFlags,
  defaultFlagArgs,
} from '../command-config/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import {
  checkEnvironmentSpecificOverride,
  parseMarkers,
} from '../helpers/utils';
import { getEmulateDeviceSettingForKeyAndOrientation } from '../helpers/simulate-device-options';
import {
  CONTROL_ENV_OVERRIDE_ATTR,
  EXPERIMENT_ENV_OVERRIDE_ATTR,
  ITBConfig,
} from '../command-config/tb-config';
import Report from './report';
import { IConfig } from '@oclif/config';
import { getConfig } from '../command-config/build-config';
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
  report?: boolean;
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
    report,
    json,
    debug,
    headless,
  };
  public compareFlags: ICompareFlags;
  public parsedConfig: ITBConfig = defaultFlagArgs;
  // flags explicitly specified within the cli when
  // running the command. these will override all
  public explicitFlags: string[];
  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    const { flags } = this.parse(Compare);

    this.explicitFlags = argv;
    this.compareFlags = flags;
  }

  // instantiated before this.run()
  public async init() {
    const { flags } = this.parse(Compare);
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);

    this.compareFlags = flags;
    await this.parseFlags();
  }

  public async run() {
    const [
      controlSettings,
      experimentSettings,
    ] = this.generateControlExperimentServerConfig();

    // this should be directly above the instantiation of the InitialRenderBenchmarks
    if (this.parsedConfig.debug) {
      Object.entries(this.parsedConfig).forEach(([key, value]) => {
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
      .run(this.compareFlags.fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${
              this.parsedConfig.controlURL
            }\nEXPERIMENT: ${this.parsedConfig.experimentURL}.`
          );
        }


        // private determineOutputFileName(outputFolder: string): string {
        //   let count = 1;
        //   while (true) {
        //     const candidateHTML = join(
        //       this.parsedConfig.tbResultsFolder,
        //       `${ARTIFACT_FILE_NAME}-${count}.html`
        //     );
        //     const candidatePDF = join(
        //       this.parsedConfig.tbResultsFolder,
        //       `${ARTIFACT_FILE_NAME}-${count}.pdf`
        //     );
        //     if (!fs.existsSync(candidateHTML) && !fs.existsSync(candidatePDF)) {
        //       break;
        //     }
        //     count += 1;
        //   }
        //   return `artifact-${count}`;
        // }

        fs.writeFileSync(
          `${this.parsedConfig.tbResultsFolder}/compare.json`,
          JSON.stringify(results, null, 2)
        );

        fs.writeFileSync(
          `${this.parsedConfig.tbResultsFolder}/compare-stat-results.json`,
          JSON.stringify(
            logCompareResults(results, this.compareFlags, this),
            null,
            2
          )
        );

        // with debug flag output three files
        // on config specifics
        if (this.parsedConfig.debug) {
          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/server-control-settings.json`,
            JSON.stringify(Object.assign(controlSettings), null, 2)
          );

          fs.writeFileSync(
            `${
              this.parsedConfig.tbResultsFolder
            }/server-experiment-settings.json`,
            JSON.stringify(Object.assign(experimentSettings), null, 2)
          );

          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/compare-flags-settings.json`,
            JSON.stringify(Object.assign(this.parsedConfig), null, 2)
          );
        }

        // if we want to run the Report without calling a seperate command
        if (this.parsedConfig.report) {
          this.log('RUNNING A REPORT');
          Report.run([
            '--tbResultsFolder',
            `${this.parsedConfig.tbResultsFolder}`,
            '--config',
            `${this.parsedConfig.config}`,
          ]);
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
    } = (this.parsedConfig as unknown) as ICompareFlags;

    // modifies properties of flags that were not set
    // during flag.parse(). these are intentionally
    // not deconstructed as to maintain the mutable
    // flags object state
    if (typeof fidelity === 'string') {
      this.compareFlags.fidelity = parseInt(
        (fidelityLookup as any)[fidelity],
        10
      );
    }
    if (typeof markers === 'string') {
      this.parsedConfig.markers = parseMarkers(markers);
    }
    if (typeof regressionThreshold === 'string') {
      this.parsedConfig.regressionThreshold = parseInt(regressionThreshold, 10);
    }
    // if headless flag is true include the headless flags
    if (headless) {
      this.parsedConfig.browserArgs = this.compareFlags.browserArgs.concat(
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
   * @param this.parsedConfig - Object containing configs parsed from the Command class
   */
  private generateControlExperimentServerConfig(): [
    IInitialRenderBenchmarkParams,
    IInitialRenderBenchmarkParams
  ] {
    const delay = 100;
    const controlBrowser = {
      additionalArguments: this.compareFlags.browserArgs,
    };
    const experimentBrowser = {
      additionalArguments: this.compareFlags.browserArgs,
    };
    let controlNetwork: string;
    let experimentNetwork: string;
    let experimentEmulateDevice;
    let experimentEmulateDeviceOrientation;
    let controlEmulateDevice;
    let controlEmulateDeviceOrientation;
    let controlSettings: IInitialRenderBenchmarkParams;
    let experimentSettings: IInitialRenderBenchmarkParams;

    // config for the browsers to leverage socks proxy
    if (this.parsedConfig.socksPorts) {
      controlBrowser.additionalArguments = controlBrowser.additionalArguments.concat(
        [`--proxy-server=socks5://0.0.0.0:${this.parsedConfig.socksPorts[0]}`]
      );
      experimentBrowser.additionalArguments = experimentBrowser.additionalArguments.concat(
        [`--proxy-server=socks5://0.0.0.0:${this.parsedConfig.socksPorts[1]}`]
      );
    }
    controlNetwork = checkEnvironmentSpecificOverride(
      'network',
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    controlEmulateDevice = checkEnvironmentSpecificOverride(
      'emulateDevice',
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    controlEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      'emulateDeviceOrientation',
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    experimentNetwork = checkEnvironmentSpecificOverride(
      'network',
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    experimentEmulateDevice = checkEnvironmentSpecificOverride(
      'emulateDevice',
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    experimentEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      'emulateDeviceOrientation',
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );

    controlSettings = {
      browser: controlBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        'cpuThrottleRate',
        this.compareFlags,
        CONTROL_ENV_OVERRIDE_ATTR,
        this.parsedConfig
      ),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(
        controlEmulateDevice,
        controlEmulateDeviceOrientation
      ),
      markers: this.compareFlags.markers,
      networkConditions: controlNetwork
        ? networkConditions[controlNetwork as keyof typeof networkConditions]
        : this.compareFlags.network,
      name: 'control',
      runtimeStats: this.compareFlags.runtimeStats,
      saveTraces: () => `${this.compareFlags.tbResultsFolder}/control.json`,
      url: path.join(
        this.compareFlags.controlURL + this.compareFlags.tracingLocationSearch
      ),
    };

    experimentSettings = {
      browser: experimentBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        'cpuThrottleRate',
        this.compareFlags,
        EXPERIMENT_ENV_OVERRIDE_ATTR,
        this.parsedConfig
      ),
      delay,
      emulateDeviceSettings: getEmulateDeviceSettingForKeyAndOrientation(
        experimentEmulateDevice,
        experimentEmulateDeviceOrientation
      ),
      markers: this.compareFlags.markers,
      networkConditions: experimentNetwork
        ? networkConditions[experimentNetwork as keyof typeof networkConditions]
        : this.compareFlags.network,
      name: 'experiment',
      runtimeStats: this.compareFlags.runtimeStats,
      saveTraces: () => `${this.compareFlags.tbResultsFolder}/experiment.json`,
      url: path.join(
        this.compareFlags.experimentURL +
          this.compareFlags.tracingLocationSearch
      ),
    };

    return [controlSettings, experimentSettings];
  }
}
