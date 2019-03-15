import * as fs from 'fs-extra';
import * as Table from 'cli-table2';
import * as path from 'path';
import * as jsonQuery from 'json-query';
// import * as mannWhitneyUtest from 'mann-whitney-utest';

import { fidelityLookup } from '../flags';
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

interface IOutputResults {
  [key: string]: IOutputResultsSet;
}

interface IOutputResultsSet {
  set: number[];
  duration: number[];
  js: number[];
  phases: IPhase[];
}

interface IPhase {
  phase: string;
  start: number;
  duration: number;
}

const jsonHelpers = {
  applySomeStats: (inputA: string, inputB: string) => {
    // do something with it
    return inputA && inputB;
  }
};

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
        cHead('Phase'),
        cHead('Control'),
        cHead('Experiment'),
        cHead('Status'),
        cHead('Delta')
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

        const { js, duration } = results[0].samples[0];
        const message = {
          output: `Success! A detailed report and JSON file are available at ${output}.json`,
          ext: `${fidelity} test samples were run and the results are significant in ${
            results[0].meta.browserVersion
          }. A recommended high-fidelity analysis should be performed.`
        };

        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));

        const outputResults: IOutputResults = {
          experiment: {
            set: jsonQuery('[*set=experiment]', {
              data: results
            }).value,
            duration: jsonQuery('[*set=experiment][samples][**][*duration]', {
              data: results
            }).value,
            js: jsonQuery('[*set=experiment][samples][**][*js]', {
              data: results
            }).value,
            phases: []
          },
          control: {
            set: jsonQuery('[*set=control]', {
              data: results
            }).value,
            duration: jsonQuery('[*set=control][samples][**][*duration]', {
              data: results
            }).value,
            js: jsonQuery('[*set=control][samples][**][*js]', {
              data: results
            }).value,
            phases: []
          }
        };

        getPhasesData(outputResults, markers, results, [
          'control',
          'experiment'
        ]);

        function getPhasesData(
          outputResults: IOutputResults,
          markers: any,
          data: any,
          resultIDKey: string[]
        ) {
          markers.forEach((marker: any) => {
            resultIDKey.forEach(k => {
              outputResults[k].phases.push(
                jsonQuery(
                  `[*set=${k}][samples][**][phases][*phase=${marker.start}]`,
                  { data }
                ).value
              );
            });
          });
        }

        // JS OUTPUT FORMAT
        phaseTable.push([
          cPhase(`js`),
          cNeutral(`${outputResults.control.js}µs`),
          cNeutral(`${outputResults.experiment.js}µs`),
          cNeutral('Neutral'),
          cNeutral(`${outputResults.control.js}µs`)
        ]);

        // DURATION OUTPUT FORMAT
        phaseTable.push([
          cPhase(`duration`),
          cNeutral(`${outputResults.control.duration}µs`),
          cNeutral(`${outputResults.experiment.duration}µs`),
          cNeutral('Neutral'),
          cNeutral(`${outputResults.control.duration}µs`)
        ]);

        // PHASES OUTPUT FORMAT
        outputResults.control.phases.forEach((i: any) => {
          const tableItem: any = {};
          tableItem.phase = `${i[0].phase}`;
          tableItem.control = [];
          tableItem.experiment = [];
          tableItem.status = 'Neutral';
          tableItem.delta = [];
          i.forEach((ii: any) => {
            tableItem.control.push(`${ii.duration}`);
            tableItem.experiment.push(`${ii.duration}`);
            tableItem.delta.push(`${ii.duration}`);
          });
          phaseTable.push([
            cPhase(tableItem.phase),
            cNeutral(`${tableItem.control}µs`),
            cNeutral(`${tableItem.experiment}µs`),
            cNeutral(tableItem.status),
            cNeutral(`${tableItem.delta}µs`)
          ]);
        });

        // LOG JS, DURATION & PHASES AS SINGLE TABLE
        this.log(`\n\n${phaseTable.toString()}`);

        // LOG MESSAGE
        this.log(cNeutral(`\n\n${message.output}\n\n${message.ext}\n\n`));
      })
      .catch(err => {
        this.error(err);
      });
  }
}
