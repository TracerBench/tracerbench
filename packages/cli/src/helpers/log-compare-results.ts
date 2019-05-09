import * as jsonQuery from 'json-query';
import { IMarker } from 'tracerbench';
import { IStatsOptions, Stats } from './stats';
import TBTable from './table';

// todo: remove these placeholders for routes
// with a different table per route
const benchmarkTable = new TBTable('Initial Render');
const phaseTable = new TBTable('Phases');

export function logCompareResults(
  results: any,
  markers: IMarker[],
  fidelity: any,
  tbResultsFile: string,
  cli: any,
  json: boolean = false
) {
  // fn to get the marker data from tracerbench-results/compare.json
  function getQueryData(id: string, marker?: any): IStatsOptions {
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

  // duration === fetchStart
  benchmarkTable.display.push(new Stats(getQueryData('duration')));
  benchmarkTable.display.push(new Stats(getQueryData('js')));

  // iterate over the markers passed into the tbResultsFile command
  markers.forEach(marker => {
    // get the marker data for each phase
    const phase = getQueryData('phases', marker);
    phaseTable.display.push(new Stats(phase));
  });

  const message = `Success! ${fidelity} test samples were run with Chrome. A detailed report and JSON file are available at ${tbResultsFile}/compare.json`;
  const j = {
    benchmarkTable: benchmarkTable.getData(),
    phaseTable: phaseTable.getData(),
    message,
  };

  if (!json) {
    // LOG THE TABLES AND MESSAGE
    cli.log(`\n\n${benchmarkTable.render()}`);
    cli.log(`\n\n${phaseTable.render()}`);
    cli.log(`\n\n${message}\n\n`);
  } else {
    // WILL ONLY STDOUT JSON. NO TABLES OR SPARKLINE
    cli.log(j);
  }
  // RETURN JSON FOR ONLY FILE OUTPUT
  return j;
}
