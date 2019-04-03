import * as jsonQuery from 'json-query';
import { IMarker } from 'tracerbench';
import { IStatDisplayOptions, StatDisplay } from './stats';
import TBTable from './table';

const benchmarkTable = new TBTable('/benchmark');
const phaseTable = new TBTable('/phase');

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

  benchmarkTable.setTableData(displayedBenchmarks);
  phaseTable.setTableData(displayedStats);

  const message = `Success! ${fidelity} test samples were run in ${
    results[0].meta.browserVersion
  }.\n\nA detailed report and JSON file are available at ${output}/compare.json`;

  // LOG JS, DURATION
  // LOG PHASES
  cli.log(`\n\n${benchmarkTable.render()}`);
  cli.log(`\n\n${phaseTable.render()}`);
  // LOG MESSAGE
  cli.log(`\n\n${message}\n\n`);
}
