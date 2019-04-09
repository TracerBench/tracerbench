import * as jsonQuery from 'json-query';
import { IMarker } from 'tracerbench';
import { IStatDisplayOptions, StatDisplay } from './stats';
import TBTable from './table';

// todo: remove these placeholders for routes
// with a different table per route
const benchmarkTable = new TBTable('/foo');
const phaseTable = new TBTable('/buzz');

const displayedBenchmarks: StatDisplay[] = [];
const displayedStats: StatDisplay[] = [];

export function outputCompareResults(
  results: any,
  markers: IMarker[],
  fidelity: any,
  output: string,
  cli: any
) {
  // fn to get the marker data from tracerbench-results/compare.json
  function getQueryData(id: string, marker?: any): IStatDisplayOptions {
    const query = !marker
      ? `[samples][**][*${id}]`
      : `[samples][**][${id}][*phase=${marker.start}].duration`;
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

  // build the table for duration
  displayedBenchmarks.push(new StatDisplay(getQueryData('duration')));
  // build the table for js
  displayedBenchmarks.push(new StatDisplay(getQueryData('js')));

  // iterate over the markers passed into the output command
  markers.forEach(marker => {
    // get the marker data for each phase
    const phase = getQueryData('phases', marker);
    displayedStats.push(new StatDisplay(phase));
  });

  benchmarkTable.setTableData(displayedBenchmarks);
  phaseTable.setTableData(displayedStats);

  const message = `Success! ${fidelity} test samples were run in ${
    results[0].meta.browserVersion
  }. A detailed report and JSON file are available at ${output}/compare.json`;

  // LOG JS, DURATION
  // LOG PHASES
  cli.log(`\n\n${benchmarkTable.render()}`);
  cli.log(`\n\n${phaseTable.render()}`);
  // LOG MESSAGE
  cli.log(`\n\n${message}\n\n`);
}
