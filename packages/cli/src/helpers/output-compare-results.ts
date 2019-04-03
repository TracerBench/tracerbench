import * as Table from 'cli-table2';
import * as jsonQuery from 'json-query';
import { IMarker } from 'tracerbench';
import { IStatDisplayOptions, StatDisplay } from './stats';
import { chalkScheme } from './utils';

const benchmarkTableConfig: Table.TableConstructorOptions = {
  colWidths: [20, 20, 20, 20],
  head: [
    chalkScheme.header('Initial Render'),
    chalkScheme.header('Estimator Δ'),
    chalkScheme.header('Is Significant'),
    chalkScheme.header('Distribution'),
  ],
  style: {
    head: [],
    border: [],
  },
};

const phaseTableConfig: Table.TableConstructorOptions = {
  colWidths: [20, 20, 20, 20],
  head: [
    chalkScheme.header('Phase'),
    chalkScheme.header('Estimator Δ'),
    chalkScheme.header('Is Significant'),
    chalkScheme.header('Distribution'),
  ],
  style: {
    head: [],
    border: [],
  },
};

const benchmarkTable = new Table(benchmarkTableConfig) as Table.HorizontalTable;
const phaseTable = new Table(phaseTableConfig) as Table.HorizontalTable;
const displayedBenchmarks: StatDisplay[] = [];
const displayedStats: StatDisplay[] = [];

export function outputCompareResults(
  results: any,
  markers: IMarker[],
  fidelity: any,
  output: string,
  cli: any
) {
  function getQueryData(id: string, marker?: any): IStatDisplayOptions {
    const query = !marker
      ? `[samples][**][*${id}]`
      : `[samples][**][${id}][*phase=${marker.start}]`;
    const name = !marker ? id : marker.start;
    return {
      control: jsonQuery(`[*set=control]${query}`, {
        data: results,
      }).value,
      experiment: jsonQuery(`[*set=experiment]${query}`, {
        data: results,
      }).value,
      name,
    };
  }

  displayedBenchmarks.push(new StatDisplay(getQueryData('duration')));
  displayedBenchmarks.push(new StatDisplay(getQueryData('js')));

  // TODO this is coming off a default set of markers
  // this might not be ideal
  markers.forEach(marker => {
    const o = getQueryData('phases', marker);
    o.control = jsonQuery(`duration`, { data: o.control }).value;
    o.experiment = jsonQuery(`duration`, { data: o.experiment }).value;
    displayedStats.push(new StatDisplay(o));
  });

  setTableData(displayedBenchmarks, benchmarkTable);
  setTableData(displayedStats, phaseTable);

  const message = `Success! ${fidelity} test samples were run in ${
    results[0].meta.browserVersion
  }.\n\nA detailed report and JSON file are available at ${output}/compare.json`;

  // LOG JS, DURATION
  // LOG PHASES
  cli.log(`\n\n${benchmarkTable.toString()}`);
  cli.log(`\n\n${phaseTable.toString()}`);
  // LOG MESSAGE
  cli.log(`\n\n${message}\n\n`);
}

function setTableData(display: StatDisplay[], table: Table.HorizontalTable) {
  // ITERATE OVER DISPLAY ARRAY OF STATDISPLAY AND OUTPUT
  display.forEach(stat => {
    table.push([
      chalkScheme.phase(`${stat.name}`),
      chalkScheme.neutral(`${stat.estimator}μs`),
      `${stat.significance}`,
      chalkScheme.neutral(
        `${stat.controlDistribution}\n\n${stat.experimentDistribution}`
      ),
    ]);
  });
}
