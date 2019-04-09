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
  output,
  tracingLocationSearch,
} from '../helpers/flags';
import { fidelityLookup } from '../helpers/default-flag-args';
import { outputCompareResults } from '../helpers/output-compare-results';
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
    output: output({ required: true }),
    controlURL: controlURL({ required: true }),
    experimentURL: experimentURL({ required: true }),
    tracingLocationSearch: tracingLocationSearch({ required: true }),
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      browserArgs,
      cpuThrottleRate,
      output,
      controlURL,
      experimentURL,
      tracingLocationSearch,
    } = flags;
    let { markers, fidelity, network } = flags;

    if (typeof fidelity === 'string') {
      fidelity = parseInt((fidelityLookup as any)[fidelity], 10);
    }

    if (typeof network === 'string') {
      network = networkConditions[network];
    }

    if (typeof markers === 'string') {
      markers = parseMarkers(markers);
    }

    if (!fs.existsSync(output)) {
      fs.mkdirSync(output);
    }

    const delay = 100;
    const runtimeStats = true;
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
        saveTraces: () => `${output}/control.json`,
        url: path.join(controlURL + tracingLocationSearch),
      }),
      experiment: new InitialRenderBenchmark({
        browser,
        delay,
        markers,
        networkConditions: network,
        name: 'experiment',
        runtimeStats,
        saveTraces: () => `${output}/experiment.json`,
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
          `${output}/compare.json`,
          JSON.stringify(results, null, 2)
        );

        outputCompareResults(results, markers, fidelity, output, this);
      })
      .catch((err: any) => {
        this.error(err);
      });
  }
}
