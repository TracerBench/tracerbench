import * as jsonQuery from 'json-query';
import { IStatsOptions, Stats } from './stats';
import TBTable from './table';
import { ICompareFlags } from '../commands/compare';
import { fidelityLookup } from './default-flag-args';
// todo: remove these placeholders for routes
// with a different table per route
const benchmarkTable = new TBTable('Initial Render');
const phaseTable = new TBTable('Phases');

export function logCompareResults(
  results: any,
  flags: ICompareFlags,
  cli: any
) {
  const {
    markers,
    fidelity,
    json,
    tbResultsFile,
    browserArgs,
    regressionThreshold,
  } = flags;

  // fn to get the marker data from tracerbench-results/compare.json
  function getQueryData(id: string, marker?: any): IStatsOptions {
    const query = !marker
      ? `[samples][**][*${id}]`
      : `[samples][**][${id}][*phase=${marker.label}].duration`;
    const name = !marker ? id : marker.label;
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

  const browser = browserArgs.includes('--headless')
    ? 'Headless-Chrome'
    : 'Chrome';
  const message = `Success! ${fidelity} test samples were run with ${browser}. The json file with results from the compare test are available here: ${tbResultsFile}/compare.json.`;
  const sigMessage = `Statistically significant results were found. A recommended "fidelity=high" compare test should be run to rule out false negatives.`;
  const regThresholdMessage = `A regression was found exceeding the set regression threshold of ${regressionThreshold}μs`;
  const jsonResults = {
    benchmarkTable: benchmarkTable.getData(),
    phaseTable: phaseTable.getData(),
    message,
    isSignificant: isSignificant(),
    isBelowRegressionThreshold: isBelowRegressionThreshold(),
  };

  // if fidelity !== 'test'
  function isSignificant(): boolean {
    if (fidelity > fidelityLookup.test) {
      return (
        benchmarkTable.isSigWilcoxonRankSumTestArray.includes('Yes') ||
        phaseTable.isSigWilcoxonRankSumTestArray.includes('Yes')
      );
    }
    return false;
  }

  function isBelowRegressionThreshold(): boolean {
    if (
      fidelity > fidelityLookup.low &&
      regressionThreshold &&
      isSignificant()
    ) {
      const deltas = benchmarkTable.estimatorDeltas.concat(
        phaseTable.estimatorDeltas
      );
      return deltas.every(x => x > regressionThreshold);
    }
    return true;
  }

  if (!json) {
    // LOG THE TABLES AND MESSAGE
    cli.log(`\n\n${benchmarkTable.render()}`);
    cli.log(`\n\n${phaseTable.render()}`);
    cli.log(`\n\n${message}`);
    if (jsonResults.isSignificant) {
      cli.log(`${sigMessage}`);
    }
    if (!jsonResults.isBelowRegressionThreshold) {
      cli.log(`${regThresholdMessage}\n\n`);
    }
  } else {
    // WILL ONLY STDOUT JSON. NO TABLES OR SPARKLINE
    if (jsonResults.isSignificant) {
      jsonResults.message += ` ${sigMessage}`;
    }
    if (!jsonResults.isBelowRegressionThreshold) {
      jsonResults.message += ` ${regThresholdMessage}`;
    }
    cli.log(jsonResults);
  }
  // RETURN JSON FOR ONLY FILE OUTPUT
  return jsonResults;
}
