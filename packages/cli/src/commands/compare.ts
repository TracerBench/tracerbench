import * as fs from 'fs-extra';

import { outputCompareResults } from '../output-compare-results';
import { fidelityLookup } from '../flags';
import { Command } from '@oclif/command';
import { InitialRenderBenchmark, Runner } from 'tracerbench';
import {
  browserArgs,
  control,
  cpuThrottleRate,
  experiment,
  fidelity,
  markers,
  network,
  output,
  url
} from '../flags';

export default class Compare extends Command {
  public static description =
    'Compare the performance delta between an experiment and control';
  public static flags = {
    browserArgs: browserArgs({ required: true }),
    control: control(),
    cpuThrottleRate: cpuThrottleRate({ required: true }),
    experiment: experiment(),
    fidelity: fidelity({ required: true }),
    markers: markers({ required: true }),
    network: network(),
    output: output({ required: true }),
    url: url({ required: true })
  };

  public async run() {
    const { flags } = this.parse(Compare);
    const {
      browserArgs,
      cpuThrottleRate,
      output,
      network,
      experiment,
      control,
      markers,
      url
    } = flags;
    let { fidelity } = flags;

    if (typeof fidelity === 'string') {
      fidelity = parseInt((fidelityLookup as any)[fidelity], 10);
    }

    const delay = 100;
    const runtimeStats = true;
    const browser = {
      additionalArguments: browserArgs
    };

    const benchmarks = {
      control: new InitialRenderBenchmark({
        browser,
        cpuThrottleRate,
        delay,
        markers,
        name: 'control',
        runtimeStats,
        saveTraces: () => `control-${output}-trace.json`,
        url
      }),
      experiment: new InitialRenderBenchmark({
        browser,
        delay,
        markers,
        name: 'experiment',
        runtimeStats,
        saveTraces: () => `experiment-${output}-trace.json`,
        url
      })
    };

    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(fidelity)
      .then((results: any) => {
        if (!results[0].samples[0]) {
          this.error(`Could not sample from provided url: ${url}.`);
        }

        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));

        outputCompareResults(results, markers, fidelity, output, this);
      })
      .catch((err: any) => {
        this.error(err);
      });
  }
}
