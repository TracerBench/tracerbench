import * as fs from 'fs-extra';
import * as path from 'path';
import { Emulation, Network } from 'chrome-debugging-client/dist/protocol/tot';
import { Command } from '@oclif/command';
import {
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
  tbResultsFile,
  tracingLocationSearch,
  runtimeStats,
  json,
  debug,
  emulateDevice,
  socksPorts,
  regressionThreshold,
} from '../helpers/flags';
import { fidelityLookup } from '../helpers/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import { parseMarkers, convertMSToMicroseconds } from '../helpers/utils';
import deviceSettings from '../helpers/simulate-device-options';

export interface ICompareFlags {
  browserArgs: string[];
  cpuThrottleRate: number;
  fidelity: number;
  markers: IMarker[];
  network: Network.EmulateNetworkConditionsParameters;
  tbResultsFile: string;
  controlURL: string;
  experimentURL: string;
  tracingLocationSearch: string;
  runtimeStats: boolean;
  emulateDevice?:
    | Emulation.SetDeviceMetricsOverrideParameters &
        Emulation.SetUserAgentOverrideParameters
    | undefined;
  socksPorts?: [string, string] | undefined;
  json: boolean;
  debug: boolean;
  regressionThreshold?: number;
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
    tbResultsFile: tbResultsFile({ required: true }),
    controlURL: controlURL({ required: true }),
    experimentURL: experimentURL({ required: true }),
    tracingLocationSearch: tracingLocationSearch({ required: true }),
    runtimeStats: runtimeStats({ required: true }),
    emulateDevice: emulateDevice(),
    socksPorts: socksPorts(),
    regressionThreshold: regressionThreshold(),
    json,
    debug,
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      tbResultsFile,
      debug,
      fidelity,
      network,
      markers,
      emulateDevice,
      regressionThreshold,
    } = flags as ICompareFlags;
    const delay = 100;

    // modifies properties of flags that were not set
    // during flag.parse(). these are intentionally
    // not deconstructed as to maintain the mutable
    // flags object state
    if (typeof fidelity === 'string') {
      flags.fidelity = parseInt((fidelityLookup as any)[fidelity], 10);
    }
    if (typeof network === 'string') {
      flags.network = networkConditions[network];
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
    if (typeof emulateDevice === 'string') {
      for (const option of deviceSettings) {
        if (emulateDevice === option.typeable) {
          flags.emulateDevice = option;
          break;
        }
      }
    }

    // if the folder for the tracerbench results file
    // does not exist then create it
    if (!fs.existsSync(tbResultsFile)) {
      fs.mkdirSync(tbResultsFile);
    }

    // config for the browsers
    const controlBrowser = {
      additionalArguments: flags.browserArgs,
    };
    const experimentBrowser = {
      additionalArguments: flags.browserArgs,
    };
    // config for the browswers to leverage socks proxy
    if (flags.socksPorts) {
      controlBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${flags.socksPorts[0]}`
      );
      experimentBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${flags.socksPorts[1]}`
      );
    }

    // if debug flag then log X post mutations
    if (debug) {
      this.log(`\n FLAGS: ${JSON.stringify(flags)}`);
    }

    // todo: leverage har-remix?
    const benchmarks = {
      control: new InitialRenderBenchmark({
        browser: controlBrowser,
        cpuThrottleRate: flags.cpuThrottleRate,
        delay,
        emulateDeviceSettings: flags.emulateDevice,
        markers: flags.markers,
        networkConditions: flags.network,
        name: 'control',
        runtimeStats: flags.runtimeStats,
        saveTraces: () => `${flags.tbResultsFile}/control.json`,
        url: path.join(flags.controlURL + flags.tracingLocationSearch),
      }),
      experiment: new InitialRenderBenchmark({
        browser: experimentBrowser,
        cpuThrottleRate: flags.cpuThrottleRate,
        delay,
        emulateDeviceSettings: flags.emulateDevice,
        markers: flags.markers,
        networkConditions: flags.network,
        name: 'experiment',
        runtimeStats: flags.runtimeStats,
        saveTraces: () => `${flags.tbResultsFile}/experiment.json`,
        url: path.join(flags.experimentURL + flags.tracingLocationSearch),
      }),
    };

    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(flags.fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${
              flags.controlURL
            }\nEXPERIMENT: ${flags.experimentURL}.`
          );
        }

        fs.writeFileSync(
          `${flags.tbResultsFile}/compare.json`,
          JSON.stringify(results, null, 2)
        );

        fs.writeFileSync(
          `${flags.tbResultsFile}/compare-stat-results.json`,
          JSON.stringify(logCompareResults(results, flags, this), null, 2)
        );
      })
      .catch((err: any) => {
        this.error(err);
      });
  }
}
