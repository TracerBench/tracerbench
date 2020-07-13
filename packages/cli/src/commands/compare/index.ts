/* eslint-disable @typescript-eslint/no-explicit-any */

import { flags as oclifFlags } from "@oclif/command";
import { IConfig } from "@oclif/config";
import {
  IInitialRenderBenchmarkParams,
  IMarker,
  InitialRenderBenchmark,
  networkConditions,
  Runner,
} from "@tracerbench/core";
import type { ChromeSpawnOptions } from "@tracerbench/spawn-chrome";
import Protocol from "devtools-protocol";
import * as fs from "fs-extra";
import * as path from "path";

import { getConfig, TBBaseCommand } from "../../command-config";
import {
  defaultFlagArgs,
  fidelityLookup,
  headlessFlags,
} from "../../command-config/default-flag-args";
import {
  CONTROL_ENV_OVERRIDE_ATTR,
  EXPERIMENT_ENV_OVERRIDE_ATTR,
  ITBConfig,
} from "../../command-config/tb-config";
import { getEmulateDeviceSettingForKeyAndOrientation } from "../../helpers/device-settings";
import {
  browserArgs,
  config,
  controlURL,
  cpuThrottleRate,
  debug,
  emulateDevice,
  emulateDeviceOrientation,
  experimentURL,
  fidelity,
  headless,
  isCIEnv,
  markers,
  network,
  regressionThreshold,
  report,
  runtimeStats,
  socksPorts,
  tbResultsFolder,
  tracingLocationSearch,
} from "../../helpers/flags";
import {
  chalkScheme,
  checkEnvironmentSpecificOverride,
  durationInSec,
  parseMarkers,
  timestamp,
} from "../../helpers/utils";
import CompareAnalyze from "./analyze";
import CompareReport from "./report";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const archiver = require("archiver");
export interface ICompareFlags {
  hideAnalysis: boolean;
  browserArgs: string[];
  cpuThrottleRate: number;
  fidelity: number;
  markers: IMarker[];
  network: Protocol.Network.EmulateNetworkConditionsRequest;
  tbResultsFolder: string;
  controlURL: string | undefined;
  experimentURL: string | undefined;
  tracingLocationSearch: string;
  runtimeStats: boolean;
  emulateDevice?: string;
  emulateDeviceOrientation?: string;
  socksPorts?: [string, string] | [number, number] | undefined;
  debug: boolean;
  regressionThreshold?: number;
  headless: boolean;
  config?: string;
  report?: boolean;
  isCIEnv?: boolean;
}

export default class Compare extends TBBaseCommand {
  public static description =
    "Compare the performance delta between an experiment and control";
  public static flags: oclifFlags.Input<any> = {
    hideAnalysis: oclifFlags.boolean({
      default: false,
      description: "Hide the the analysis output in terminal",
    }),
    browserArgs: browserArgs({ required: true }),
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    fidelity: fidelity({ required: true }),
    markers: markers({ required: true }),
    network: network({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    controlURL: controlURL({ required: false }),
    experimentURL: experimentURL({ required: false }),
    tracingLocationSearch: tracingLocationSearch({ required: true }),
    emulateDevice: emulateDevice(),
    emulateDeviceOrientation: emulateDeviceOrientation(),
    socksPorts: socksPorts(),
    regressionThreshold: regressionThreshold(),
    config: config(),
    runtimeStats,
    report,
    debug,
    headless,
    isCIEnv: isCIEnv(),
  };
  public compareFlags: ICompareFlags;
  public parsedConfig: ITBConfig = defaultFlagArgs;
  // flags explicitly specified within the cli when
  // running the command. these will override all
  public explicitFlags: string[];
  public analyzedJSONString = "";
  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    const { flags } = this.parse(Compare);
    this.explicitFlags = argv;
    this.compareFlags = flags as ICompareFlags;
  }

  // instantiated before this.run()
  public async init(): Promise<void> {
    const { flags } = this.parse(Compare);
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);
    this.compareFlags = flags as ICompareFlags;
    await this.parseFlags();
  }

  public async run(): Promise<string> {
    const { hideAnalysis } = this.compareFlags;
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
    const startTime = timestamp();
    await runner
      .run(this.compareFlags.fidelity, this.log)
      .then(async (results: any) => {
        const endTime = timestamp();
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${this.parsedConfig.controlURL}\nEXPERIMENT: ${this.parsedConfig.experimentURL}.`
          );
        }
        const resultJSONPath = `${this.parsedConfig.tbResultsFolder}/compare.json`;

        fs.writeFileSync(resultJSONPath, JSON.stringify(results, null, 2));

        const tracesDir = `${this.parsedConfig.tbResultsFolder}/traces`;
        const zipOutput = fs.createWriteStream(
          `${this.parsedConfig.tbResultsFolder}/traces.zip`
        );
        const archive = archiver("zip", {
          zlib: { level: 9 },
        });
        archive.directory(tracesDir, "traces");
        archive.pipe(zipOutput);
        archive.finalize();

        // eslint:disable-next-line: max-line-length
        const message = `${chalkScheme.blackBgGreen(
          `    ${chalkScheme.white("SUCCESS!")}    `
        )} ${this.parsedConfig.fidelity} test samples took ${durationInSec(
          endTime,
          startTime
        )} seconds`;

        this.log(`\n${message}`);

        if (!hideAnalysis) {
          this.analyzedJSONString = await CompareAnalyze.run([
            resultJSONPath,
            "--fidelity",
            `${this.parsedConfig.fidelity}`,
            "--regressionThreshold",
            `${this.parsedConfig.regressionThreshold}`,
            "--isCIEnv",
            `${this.parsedConfig.isCIEnv}`,
          ]);

          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/report.json`,
            this.analyzedJSONString
          );
        }

        // if we want to run the CompareReport without calling a separate command
        if (this.parsedConfig.report) {
          await CompareReport.run([
            "--tbResultsFolder",
            `${this.parsedConfig.tbResultsFolder}`,
            "--config",
            `${this.parsedConfig.config}`,
          ]);
        }

        // with debug flag output three files
        // on config specifics
        if (this.parsedConfig.debug) {
          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/server-control-settings.json`,
            JSON.stringify(Object.assign(controlSettings), null, 2)
          );

          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/server-experiment-settings.json`,
            JSON.stringify(Object.assign(experimentSettings), null, 2)
          );

          fs.writeFileSync(
            `${this.parsedConfig.tbResultsFolder}/compare-flags-settings.json`,
            JSON.stringify(Object.assign(this.parsedConfig), null, 2)
          );
        }
      })
      .catch((err: any) => {
        this.error(err);
      });

    return this.analyzedJSONString;
  }

  private async parseFlags(): Promise<void> {
    const {
      tbResultsFolder,
      fidelity,
      markers,
      regressionThreshold,
      headless,
      controlURL,
      experimentURL,
    } = (this.parsedConfig as unknown) as ICompareFlags;

    // modifies properties of flags that were not set
    // during flag.parse(). these are intentionally
    // not deconstructed as to maintain the mutable
    // flags object state
    if (typeof fidelity === "string") {
      this.compareFlags.fidelity = parseInt(
        (fidelityLookup as any)[fidelity],
        10
      );
    }
    if (typeof markers === "string") {
      this.parsedConfig.markers = parseMarkers(markers);
    }
    if (typeof regressionThreshold === "string") {
      this.parsedConfig.regressionThreshold = parseInt(regressionThreshold, 10);
    }
    if (typeof controlURL === undefined) {
      this.error(
        "controlURL is required either in the tbconfig.json or as cli flag"
      );
    }

    if (typeof experimentURL === undefined) {
      this.error(
        "experimentURL is required either in the tbconfig.json or as cli flag"
      );
    }

    // if headless flag is true include the headless flags
    if (headless) {
      this.parsedConfig.browserArgs = this.compareFlags.browserArgs.concat(
        headlessFlags
      );
    }

    // if the folder for the tracerbench results file
    // does not exist then create it
    fs.mkdirpSync(path.join(tbResultsFolder, "traces"));
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
    // delay in ms times the number of samples. this improves variance.
    // eg 100 total samples X 200ms per sample = 20 seconds total added to the trace time
    const delay = 200;
    const controlBrowser: Partial<ChromeSpawnOptions> = {
      additionalArguments: this.compareFlags.browserArgs,
    };
    const experimentBrowser: Partial<ChromeSpawnOptions> = {
      additionalArguments: this.compareFlags.browserArgs,
    };

    // config for the browsers to leverage socks proxy
    if (this.parsedConfig.socksPorts) {
      if (controlBrowser.additionalArguments) {
        controlBrowser.additionalArguments = controlBrowser.additionalArguments.concat(
          [`--proxy-server=socks5://0.0.0.0:${this.parsedConfig.socksPorts[0]}`]
        );
      }
      if (experimentBrowser.additionalArguments) {
        experimentBrowser.additionalArguments = experimentBrowser.additionalArguments.concat(
          [`--proxy-server=socks5://0.0.0.0:${this.parsedConfig.socksPorts[1]}`]
        );
      }
    }
    const controlNetwork: string = checkEnvironmentSpecificOverride(
      "network",
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    const controlEmulateDevice = checkEnvironmentSpecificOverride(
      "emulateDevice",
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    const controlEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      "emulateDeviceOrientation",
      this.compareFlags,
      CONTROL_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    const experimentNetwork: string = checkEnvironmentSpecificOverride(
      "network",
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    const experimentEmulateDevice = checkEnvironmentSpecificOverride(
      "emulateDevice",
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );
    const experimentEmulateDeviceOrientation = checkEnvironmentSpecificOverride(
      "emulateDeviceOrientation",
      this.compareFlags,
      EXPERIMENT_ENV_OVERRIDE_ATTR,
      this.parsedConfig
    );

    const controlSettings: IInitialRenderBenchmarkParams = {
      browser: controlBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        "cpuThrottleRate",
        this.compareFlags,
        CONTROL_ENV_OVERRIDE_ATTR,
        this.parsedConfig
      ),
      delay,
      emulateDeviceSettings: controlEmulateDevice
        ? getEmulateDeviceSettingForKeyAndOrientation(
            controlEmulateDevice,
            controlEmulateDeviceOrientation
          )
        : undefined,
      markers: this.compareFlags.markers,
      networkConditions: controlNetwork
        ? networkConditions[controlNetwork as keyof typeof networkConditions]
        : this.compareFlags.network,
      name: "control",
      runtimeStats: this.compareFlags.runtimeStats,
      saveTraces: (i) =>
        `${this.compareFlags.tbResultsFolder}/traces/control${i}.json`,
      url: path.join(
        this.compareFlags.controlURL + this.compareFlags.tracingLocationSearch
      ),
    };

    const experimentSettings: IInitialRenderBenchmarkParams = {
      browser: experimentBrowser,
      cpuThrottleRate: checkEnvironmentSpecificOverride(
        "cpuThrottleRate",
        this.compareFlags,
        EXPERIMENT_ENV_OVERRIDE_ATTR,
        this.parsedConfig
      ),
      delay,
      emulateDeviceSettings: experimentEmulateDevice
        ? getEmulateDeviceSettingForKeyAndOrientation(
            experimentEmulateDevice,
            experimentEmulateDeviceOrientation
          )
        : undefined,
      markers: this.compareFlags.markers,
      networkConditions: experimentNetwork
        ? networkConditions[experimentNetwork as keyof typeof networkConditions]
        : this.compareFlags.network,
      name: "experiment",
      runtimeStats: this.compareFlags.runtimeStats,
      saveTraces: (i) =>
        `${this.compareFlags.tbResultsFolder}/traces/experiment${i}.json`,
      url: path.join(
        this.compareFlags.experimentURL +
          this.compareFlags.tracingLocationSearch
      ),
    };

    return [controlSettings, experimentSettings];
  }
}
