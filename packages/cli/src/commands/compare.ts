import * as fs from 'fs-extra';
import * as Table from 'cli-table2';
import * as path from 'path';
import * as jsonQuery from 'json-query';

import { FidelityLookup } from '../flags';
import chalk from 'chalk';
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

const cHead = chalk.rgb(255, 255, 255);
const cRegress = chalk.rgb(239, 100, 107);
const cNeutral = chalk.rgb(165, 173, 186);
const cImprv = chalk.rgb(135, 197, 113);
const cPhase = chalk.rgb(165, 173, 186);

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
    const delay = 100;
    const runtimeStats = true;
    const browser = {
      additionalArguments: browserArgs
    };
    fidelity = parseInt(FidelityLookup[fidelity], 10);

    const phaseTableConfig: Table.TableConstructorOptions = {
      colWidths: [35, 15, 10],
      head: [cHead('Phase'), cHead('Status'), cHead('Duration')],
      style: {
        head: [],
        border: []
      }
    };
    const phaseTable = new Table(phaseTableConfig) as Table.HorizontalTable;

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
      .run(2)
      .then(results => {
        if (!results[0].samples[0]) {
          this.error(`Could not sample from provided url: ${url}.`);
        }

        const { js, duration, phases } = results[0].samples[0];
        const message = {
          output: `Success! A detailed report and JSON file are available at ${output}.json`,
          ext: `${fidelity} test samples were run and the result is significant in ${
            results[0].meta.browserVersion
          }. A recommended high-fidelity analysis should be performed.`
        };

        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));

        // format output: js
        phaseTable.push([
          cPhase(`js`),
          cNeutral('Neutral'),
          cNeutral(`${js}µs`)
        ]);

        // format output: duration
        phaseTable.push([
          cPhase(`duration`),
          cNeutral('Neutral'),
          cNeutral(`${duration}µs`)
        ]);

        // todo
        // dynamic however still placeholder
        // need to performance stat relevance on these
        phases.forEach(i => {
          phaseTable.push([
            cPhase(`${i.phase}`),
            cNeutral('Neutral'),
            cNeutral(`${i.duration}µs`)
          ]);
        });

        // control samples
        // controlSamples.forEach(sample => {
        //   // phases
        //   sample.phases.forEach(i => {
        //     // each phase (id, start, duration)
        //     const p = {
        //       id: i.phase,
        //       start: i.start,
        //       duration: i.duration
        //     };
        //   });
        // });

        this.log(`\n\n${phaseTable.toString()}`);
        this.log(cNeutral(`\n\n${message.output}\n\n${message.ext}\n\n`));
      })
      .catch(err => {
        this.error(err);
      });
  }
}
