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
} from '../helpers/flags';
import { fidelityLookup } from '../helpers/default-flag-args';
import { logCompareResults } from '../helpers/log-compare-results';
import { parseMarkers } from '../helpers/utils';

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
    } = flags;
    let { markers, fidelity, network } = flags;

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

    if (!fs.existsSync(tbResultsFile)) {
      fs.mkdirSync(tbResultsFile);
    }

    const delay = 100;
    const browser = {
      additionalArguments: browserArgs,
    };

    // todo: leverage har-remix

    const benchmarks = {
      control: new InitialRenderBenchmark({
        browser,
        cpuThrottleRate,
        delay,
        markers,
        networkConditions: network,
        name: 'control',
        runtimeStats,
        saveTraces: () => `${tbResultsFile}/control.json`,
        url: path.join(controlURL + tracingLocationSearch),
      }),
      experiment: new InitialRenderBenchmark({
        browser,
        delay,
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
