import * as fs from 'fs-extra';
import * as path from 'path';

import { Command } from '@oclif/command';
import { InitialRenderBenchmark, Runner, networkConditions } from 'tracerbench';
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
} from '../helpers/flags';
import { fidelityLookup } from '../helpers/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import { parseMarkers } from '../helpers/utils';
import deviceSettings from '../helpers/simulate-device-options';

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
    json,
    debug,
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      browserArgs,
      cpuThrottleRate,
      tbResultsFile,
      controlURL,
      experimentURL,
      tracingLocationSearch,
      runtimeStats,
      json,
      debug,
      socksPorts,
    } = flags;
    let { markers, fidelity, network, emulateDevice } = flags;
    const delay = 100;

    if (debug) {
      this.log(`\n FLAGS: ${JSON.stringify(flags)}`);
    }

    if (typeof fidelity === 'string') {
      fidelity = parseInt((fidelityLookup as any)[fidelity], 10);
    }

    if (typeof network === 'string') {
      network = networkConditions[network];
    }

    if (typeof markers === 'string') {
      markers = parseMarkers(markers);
    }

    if (typeof emulateDevice === 'string') {
      for (const option of deviceSettings) {
        if (emulateDevice === option.typeable) {
          emulateDevice = option;
          break;
        }
      }
    }

    if (!fs.existsSync(tbResultsFile)) {
      fs.mkdirSync(tbResultsFile);
    }

    const controlBrowser = {
      additionalArguments: browserArgs as string[],
    };
    const experimentBrowser = {
      additionalArguments: browserArgs as string[],
    };

    if (socksPorts) {
      controlBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${socksPorts[0]}`
      );
      experimentBrowser.additionalArguments.push(
        `--proxy-server=socks5://0.0.0.0:${socksPorts[1]}`
      );
    }

    // todo: leverage har-remix

    const benchmarks = {
      control: new InitialRenderBenchmark({
        browser: controlBrowser,
        cpuThrottleRate,
        delay,
        emulateDeviceSettings: emulateDevice,
        markers,
        networkConditions: network,
        name: 'control',
        runtimeStats,
        saveTraces: () => `${tbResultsFile}/control.json`,
        url: path.join(controlURL + tracingLocationSearch),
      }),
      experiment: new InitialRenderBenchmark({
        browser: experimentBrowser,
        delay,
        emulateDeviceSettings: emulateDevice,
        markers,
        networkConditions: network,
        name: 'experiment',
        runtimeStats,
        saveTraces: () => `${tbResultsFile}/experiment.json`,
        url: path.join(experimentURL + tracingLocationSearch),
      }),
    };

    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(
            `Could not sample from provided urls\nCONTROL: ${controlURL}\nEXPERIMENT: ${experimentURL}.`
          );
        }

        fs.writeFileSync(
          `${tbResultsFile}/compare.json`,
          JSON.stringify(results, null, 2)
        );

        fs.writeFileSync(
          `${tbResultsFile}/compare-stat-results.json`,
          JSON.stringify(
            logCompareResults(
              results,
              markers,
              fidelity,
              tbResultsFile,
              this,
              json
            ),
            null,
            2
          )
        );
      })
      .catch((err: any) => {
        this.error(err);
      });
  }
}
