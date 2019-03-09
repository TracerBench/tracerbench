import * as fs from 'fs-extra';

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
      fidelity,
      experiment,
      control,
      markers,
      url
    } = flags;
    // todo
    // tracerbench compare --control sha -experiment sha --cpu 4 --url https://www.tracerbench.com --marker renderEnd --fidelity low --output ./results.json
    // har-remix, chrome-debugging-client dep?
    // init initial render benchmark for control and experiment
    // init runner
    // we might need to append ?trace

    const benchmarks = {
      control: new InitialRenderBenchmark({
        browser: {
          additionalArguments: browserArgs
        },
        cpuThrottleRate,
        delay: 100,
        markers,
        name: 'control',
        runtimeStats: true,
        saveTraces: () => `control-${output}-trace.json`,
        url
      }),
      experiment: new InitialRenderBenchmark({
        browser: {
          additionalArguments: browserArgs
        },
        delay: 100,
        markers,
        name: 'experiment',
        runtimeStats: true,
        saveTraces: () => `experiment-${output}-trace.json`,
        url
      })
    };

    const runner = new Runner([benchmarks.control, benchmarks.experiment]);
    await runner
      .run(2)
      .then(results => {
        this.log(`Success! Results available here ${output}.json`);
        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));
      })
      .catch(err => {
        this.error(err);
      });
  }
}
