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

        const { js, duration, phases } = results[0].samples[0];
        const message = {
          output: `Success! A detailed report and JSON file are available at ${output}.json`,
          ext: `${fidelity} test samples were run and the results are significant in ${
            results[0].meta.browserVersion
          }. A recommended high-fidelity analysis should be performed.`
        };

        fs.writeFileSync(`${output}.json`, JSON.stringify(results, null, 2));

        interface IOutputResults {
          experiment: IOutputResultsSet;
          control: IOutputResultsSet;
        }

        interface IOutputResultsSet {
          set: number[];
          duration: number[];
          js: number[];
          phases: [IPhase[]];
        }

        interface IPhase {
          phase: string;
          start: number;
          duration: number;
        }

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

        getPhasesData(outputResults, markers, results);

        // what do i want
        // i would like to pass all the markers, data and set
        // and get back an array of numbers
        function getPhasesData(
          outputResults: IOutputResults,
          markers: any,
          data: any
        ) {
          markers.forEach((marker: any) => {
            outputResults['control'].phases.push(
              jsonQuery(
                `[*set=control][samples][**][phases][*phase=${marker.start}]`,
                { data }
              ).value
            );
            outputResults['experiment'].phases.push(
              jsonQuery(
                `[*set=experiment][samples][**][phases][*phase=${
                  marker.start
                }]`,
                { data }
              ).value
            );
          });
        }

        // return a nested array for each phase
        // [[{"phase":"fetchStart","start":0,"duration":39102},{"phase":"fetchStart","start":0,"duration":30613}]],

        // format output: js
        phaseTable.push([
          cPhase(`js`),
          cNeutral(`${js}µs`),
          cNeutral(`${js}µs`),
          cNeutral('Neutral'),
          cNeutral(`${js}µs`)
        ]);

        // format output: duration
        phaseTable.push([
          cPhase(`duration`),
          cNeutral(`${duration}µs`),
          cNeutral(`${duration}µs`),
          cNeutral('Neutral'),
          cNeutral(`${duration}µs`)
        ]);

        outputResults.control.phases.forEach(i => {
          const tableItem: any = {};
          tableItem.phase = `${i[0].phase}`;
          tableItem.control = [];
          tableItem.experiment = [];
          tableItem.status = 'Neutral';
          tableItem.delta = [];
          i.forEach(ii => {
            tableItem.control.push(`${ii.duration}`);
            tableItem.experiment.push(`${ii.duration}`);
            tableItem.delta.push(`${ii.duration}`);
          });
          phaseTable.push([
            // phase name
            cPhase(tableItem.phase),
            // control duration
            cNeutral(`${tableItem.control}µs`),
            // experiment duration
            cNeutral(`${tableItem.experiment}µs`),
            // qualitative status based on the p-value
            cNeutral(tableItem.status),
            // quantitative delta based on the p-value
            cNeutral(`${tableItem.delta}µs`)
          ]);
        });

        this.log(`\n\n${phaseTable.toString()}`);
        this.log(cNeutral(`\n\n${message.output}\n\n${message.ext}\n\n`));
      })
      .catch(err => {
        this.error(err);
      });
  }
}
