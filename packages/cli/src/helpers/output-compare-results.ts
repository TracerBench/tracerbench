import * as jsonQuery from 'json-query';
import * as Table from 'cli-table2';
import { StatDisplay, IStatDisplayOptions } from './stats';
import { chalkScheme } from './utils';
import { IMarker } from 'tracerbench';

const benchmarkTableConfig: Table.TableConstructorOptions = {
  colWidths: [20, 15, 20, 20, 20],
  head: [
    chalkScheme.header('Initial Render'),
    chalkScheme.header('Estimator'),
    chalkScheme.header('Control Distribution'),
    chalkScheme.header('Experiment Distribution'),
    chalkScheme.header('Is Significant')
  ],
  style: {
    head: [],
    border: []
  }
};

const phaseTableConfig: Table.TableConstructorOptions = {
  colWidths: [20, 15, 20, 20, 20],
  head: [
    chalkScheme.header('Phase'),
    chalkScheme.header('Estimator'),
    chalkScheme.header('Control Distribution'),
    chalkScheme.header('Experiment Distribution'),
    chalkScheme.header('Is Significant')
  ],
  style: {
    head: [],
    border: []
  }
};

const benchmarkTable = new Table(benchmarkTableConfig) as Table.HorizontalTable;
const phaseTable = new Table(phaseTableConfig) as Table.HorizontalTable;
const displayedBenchmarks: StatDisplay[] = [];
const displayedStats: StatDisplay[] = [];
let isSigStat: boolean = false;

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
        data: results
      }).value,
      experiment: jsonQuery(`[*set=experiment]${query}`, {
        data: results
      }).value,
      name
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

  const message = {
    output: `Success! A detailed report and JSON file are available at ${output}.json`,
    whichMsg: () => {
      return isSigStat ? message.nope : message.yup;
    },
    yup: `${fidelity} test samples were run and the results are significant in ${
      results[0].meta.browserVersion
    }. A recommended high-fidelity analysis should be performed.`,
    nope: `${fidelity} test samples were run and the results are *not* significant in ${
      results[0].meta.browserVersion
    }.`
  };

  // LOG JS, DURATION
  // LOG PHASES
  cli.log(`\n\n${benchmarkTable.toString()}`);
  cli.log(`\n\n${phaseTable.toString()}`);
  // LOG MESSAGE
  cli.log(
    chalkScheme.neutral(`\n\n${message.output}\n\n${message.whichMsg()}\n\n`)
  );
}

function setTableData(display: StatDisplay[], table: Table.HorizontalTable) {
  // ITERATE OVER DISPLAY ARRAY OF STATDISPLAY AND OUTPUT
  display.forEach(stat => {
    if (stat.significance === 'Yes') {
      isSigStat = true;
    }
    table.push([
      chalkScheme.phase(`${stat.name}`),
      chalkScheme.neutral(`${stat.estimator}μs`),
      chalkScheme.neutral(`${stat.controlDistribution}μs`),
      chalkScheme.neutral(`${stat.experimentDistribution}μs`),
      `${stat.significance}`
    ]);
  });
}
