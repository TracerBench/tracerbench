import * as jsonQuery from 'json-query';
import { IStatsOptions, Stats } from './statistics/stats';
import TBTable from './table';
import { ICompareFlags } from '../commands/compare';
import { fidelityLookup } from '../command-config/default-flag-args';

const benchmarkTable = new TBTable('Initial Render');
const phaseTable = new TBTable('Phase');

export function logCompareResults(
  results: any,
  flags: ICompareFlags,
  cli: any
) {
  const {
    markers,
    fidelity,
    json,
    tbResultsFolder,
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

  // iterate over the markers passed into the tbResultsFolder command
  markers.forEach(marker => {
    // get the marker data for each phase
    const phase = getQueryData('phases', marker);
    phaseTable.display.push(new Stats(phase));
  });

  const browser = browserArgs.includes('--headless')
    ? 'Headless-Chrome'
    : 'Chrome';
// tslint:disable-next-line: max-line-length
  const message = `Success! ${fidelity} test samples were run with ${browser}. The JSON file with results from the compare test are available here: ${tbResultsFolder}/compare.json. To generate a pdf report run "tracerbench report"`;
  const notSigMessage = `Wilcoxon rank-sum test indicated that there is NOT sufficient evidence that there is a statistical difference between the control and experiment.`;
// tslint:disable-next-line: max-line-length
  const sigMessage = `Wilcoxon rank-sum test indicated that there IS sufficient evidence that there is a statistical difference between the control and experiment. We would expect 5% of these kinds of results to be due to chance with no underlying effect. A recommended "fidelity=high" compare test should be run to rule out false negatives.`;
  const regThresholdMessage = `A regression was found exceeding the set regression threshold of ${regressionThreshold}ms`;
  const lowFidelityMessage = `The fidelity setting was set below the recommended for a viable result. Rerun TracerBench with at least "fidelity=low"`;
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
      fidelity >= fidelityLookup.low &&
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

  if (jsonResults.isSignificant) {
    jsonResults.message += ` ${sigMessage}`;
  } else {
    jsonResults.message += ` ${notSigMessage}`;
  }
  if (!jsonResults.isBelowRegressionThreshold) {
    jsonResults.message += ` ${regThresholdMessage}`;
  }
  if (fidelity < 10) {
    jsonResults.message += ` ${lowFidelityMessage}`;
  }

  if (!json) {
    // LOG THE TABLES AND MESSAGE
    cli.log(`\n\n${benchmarkTable.render()}`);
    cli.log(`\n\n${phaseTable.render()}`);
    cli.log(`\n${message}`);
    if (jsonResults.isSignificant) {
      cli.log(`\n${sigMessage}`);
    } else {
      cli.log(`\n${notSigMessage}`);
    }
    if (!jsonResults.isBelowRegressionThreshold) {
      cli.log(`${regThresholdMessage}\n`);
    }
    if (fidelity < 10) {
      cli.log(`\n${lowFidelityMessage}\n`);
    }
  } else {
    // WILL ONLY STDOUT JSON. NO TABLES OR SPARKLINE
    cli.log(JSON.stringify(jsonResults));
  }
  // RETURN JSON FOR ONLY FILE OUTPUT
  return JSON.stringify(jsonResults);
}
