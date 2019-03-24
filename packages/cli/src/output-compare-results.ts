import * as jsonQuery from 'json-query';
import * as Table from 'cli-table2';
import { StatDisplay, IStatDisplayOptions } from './stats';
import { chalkScheme } from './utils';
import { IMarker } from 'tracerbench';

const benchmarkTableConfig: Table.TableConstructorOptions = {
  colWidths: [25, 30, 30, 15, 15],
  head: [
    chalkScheme.header('Initial Render'),
    chalkScheme.header('Control p50, Variance'),
    chalkScheme.header('Experiment p50, Variance'),
    chalkScheme.header('Delta p50'),
    chalkScheme.header('Significance')
  ],
  style: {
    head: [],
    border: []
  }
};

const phaseTableConfig: Table.TableConstructorOptions = {
  colWidths: [25, 30, 30, 15, 15],
  head: [
    chalkScheme.header('Phase'),
    chalkScheme.header('Control p50, Variance'),
    chalkScheme.header('Experiment p50, Variance'),
    chalkScheme.header('Delta p50'),
    chalkScheme.header('Significance')
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
let isSigStat: StatDisplay | null = null;

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

  // ITERATE OVER BENCHMARKS ARRAY OF STATDISPLAY AND OUTPUT
  displayedBenchmarks.forEach(stat => {
    if (stat.significance !== 'Neutral') {
      isSigStat = stat;
    }
    benchmarkTable.push([
      chalkScheme.phase(`${stat.name}`),
      chalkScheme.neutral(`${stat.controlQ}μs, ${stat.varianceControl}μs`),
      chalkScheme.neutral(
        `${stat.experimentQ}μs, ${stat.varianceExperiment}μs`
      ),
      chalkScheme.neutral(`${stat.deltaQ}μs`),
      chalkScheme.neutral(`${stat.significance}`)
    ]);
  });

  // ITERATE OVER PHASETABLE ARRAY OF STATDISPLAY AND OUTPUT
  displayedStats.forEach(stat => {
    if (stat.significance !== 'Neutral') {
      isSigStat = stat;
    }
    phaseTable.push([
      chalkScheme.phase(`${stat.name}`),
      chalkScheme.neutral(`${stat.controlQ}μs, ${stat.varianceControl}μs`),
      chalkScheme.neutral(
        `${stat.experimentQ}μs, ${stat.varianceExperiment}μs`
      ),
      chalkScheme.neutral(`${stat.deltaQ}μs`),
      chalkScheme.neutral(`${stat.significance}`)
    ]);
  });

  // LOG JS, DURATION
  // LOG PHASES
  cli.log(`\n\n${benchmarkTable.toString()}`);
  cli.log(`\n\n${phaseTable.toString()}`);

  const message = {
    output: `Success! A detailed report and JSON file are available at ${output}.json`,
    whichMsg: () => {
      return isSigStat ? message.neutral : message.results;
    },
    results: `${fidelity} test samples were run and the results are significant in ${
      results[0].meta.browserVersion
    }. A recommended high-fidelity analysis should be performed.`,
    neutral: `${fidelity} test samples were run and the results are neutral in ${
      results[0].meta.browserVersion
    }.`
  };

  // LOG MESSAGE
  cli.log(
    chalkScheme.neutral(`\n\n${message.output}\n\n${message.whichMsg()}\n\n`)
  );
}
