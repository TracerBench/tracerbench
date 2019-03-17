import * as fs from 'fs-extra';
import * as Table from 'cli-table2';
import * as jsonQuery from 'json-query';

import { StatDisplay, IStatDisplayOptions } from '../stats';
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
import { chalkScheme } from '../utils';

const displayedStats: StatDisplay[] = [];

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

    const phaseTableConfig: Table.TableConstructorOptions = {
      colWidths: [30, 20, 20, 20, 20],
      head: [
        chalkScheme.header('Phase'),
        chalkScheme.header('Control p50'),
        chalkScheme.header('Experiment p50'),
        chalkScheme.header('Delta p50'),
        chalkScheme.header('Significance')
      ],
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
      .run(fidelity)
      .then(results => {
        if (!results[0].samples[0]) {
          this.error(`Could not sample from provided url: ${url}.`);
        }

        const message = {
          output: `Success! A detailed report and JSON file are available at ${output}.json`,
          ext: `${fidelity} test samples were run and the results are significant in ${
            results[0].meta.browserVersion
          }. A recommended high-fidelity analysis should be performed.`
        };

        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));

        function getQueryData(id: string, marker?: any): IStatDisplayOptions {
          const query = !marker
            ? `[samples][**][*${id}]`
            : `[samples][**][${id}][*phase=${marker.start}]`;
          const name = !marker ? id : marker.start;
          return {
            control: jsonQuery(`[*set=control]${query}`, {
              data: results
            }).value,
            experiment: jsonQuery(`[*set=experiment]${query}`, {
              data: results
            }).value,
            name
          };
        }

        displayedStats.push(new StatDisplay(getQueryData('duration')));
        displayedStats.push(new StatDisplay(getQueryData('js')));

        // TODO this is coming off a default set of markers
        // this might not be ideal
        markers.forEach(marker => {
          const o = getQueryData('phases', marker);
          o.control = jsonQuery(`duration`, { data: o.control }).value;
          o.experiment = jsonQuery(`duration`, { data: o.experiment }).value;
          displayedStats.push(new StatDisplay(o));
        });

        // ITERATE OVER ARRAY OF STATDISPLAY AND OUTPUT
        displayedStats.forEach(stat => {
          phaseTable.push([
            chalkScheme.phase(`${stat.name}`),
            chalkScheme.neutral(`${stat.controlQ}μs`),
            chalkScheme.neutral(`${stat.experimentQ}μs`),
            chalkScheme.neutral(`${stat.deltaQ}μs`),
            chalkScheme.neutral(`${stat.significance}`)
          ]);
        });

        // LOG JS, DURATION & PHASES AS SINGLE TABLE
        this.log(`\n\n${phaseTable.toString()}`);

        // LOG MESSAGE
        this.log(
          chalkScheme.neutral(`\n\n${message.output}\n\n${message.ext}\n\n`)
        );
      })
      .catch(err => {
        this.error(err);
      });
  }
}
