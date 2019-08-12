import chalk from 'chalk';

import { Command } from '@oclif/command';
import { bucketPhaseValues, formatPhaseData, HTMLSectionRenderData, ITracerBenchTraceResult, PAGE_LOAD_TIME } from './create-consumable-html';
import { Stats } from './statistics/stats';
import TBTable from './table';
import { ICompareFlags } from '../commands/compare';
import { fidelityLookup } from '../command-config/default-flag-args';
import { chalkScheme } from './utils';

/**
 * If fidelity is at acceptable number, return true if any of the phase results were significant
 *
 * @param fidelity - Use this to determine if the sample count is too low
 * @param benchmarkIsSigArray - Array of strings of either "Yes" or "No" from TBTable
 * @param phaseIsSigArray - Array of strings of either "Yes" or "No" from TBTable
 */
function anyResultsSignificant(fidelity: number, benchmarkIsSigArray: string[], phaseIsSigArray: string[]): boolean {
  // if fidelity !== 'test'
  if (fidelity > fidelityLookup.test) {
    return benchmarkIsSigArray.includes('Yes') || phaseIsSigArray.includes('Yes');
  }
  return false;
}

function anyBelowRegressionThreshold(cliFlags: ICompareFlags, areResultsSignificant: boolean, benchmarkTable: TBTable, phaseTable: TBTable): boolean {
  const { fidelity, regressionThreshold } = cliFlags;

  if (fidelity >= fidelityLookup.low && regressionThreshold && areResultsSignificant) {
    const deltas = benchmarkTable.estimatorDeltas.concat(phaseTable.estimatorDeltas);
    return deltas.every(x => x > regressionThreshold);
  }
  return true;
}

const LOW_FIDELITY_WARNING = 'The fidelity setting was set below the recommended for a viable result. Rerun TracerBench with at least "fidelity=low"';

/**
 * Output meta data about the benchmark run and FYI messages to the user.
 *
 * @param cli - This is expected to be a "compare" Command instance
 * @param cliFlags - This is expected to be CLI flags from the "compare" command
 * @param isBelowRegressionThreshold - Boolean indicating if there were any deltas below "regressionThreshold" flag
 */
function outputRunMetaMessagesAndWarnings(cli: Command, cliFlags: ICompareFlags, isBelowRegressionThreshold: any) {
  const {
    fidelity,
    tbResultsFolder,
    browserArgs,
    regressionThreshold,
    report
  } = cliFlags;
  const browser = browserArgs.includes('--headless') ? 'Headless-Chrome' : 'Chrome';
  // tslint:disable-next-line: max-line-length
  let message = `${chalk.black.bgGreen(' Success! ')} ${fidelity} test samples were run with ${browser}. The JSON file with results from the compare test are available here: ${tbResultsFolder}/compare.json.`;
  if (!report) {
    message += `\nTo generate a pdf report run "tracerbench report --tbResultsFolder ${tbResultsFolder}"`;
  }
  cli.log(`\n${message}`);

  if (fidelity < 10) {
    cli.log(`\n${chalk.black.bgYellow(' WARNING ')} ${LOW_FIDELITY_WARNING}\n`);
  }

  if (!isBelowRegressionThreshold) {
    cli.log(`A regression was found exceeding the set regression threshold of ${regressionThreshold}ms\n`);
  }
}

/**
 * Generate the summary section for the results.
 *
 * For each phase, color the significance appropriately by the HL estimated difference. Red for regression, green for
 * improvement. Color with monotone if not significant.
 *
 * @param cli - This is expected to be a "compare" Command instance
 * @param phaseResultsFormatted - Array of results from calling formatPhaseData
 */
function outputSummaryReport(cli: Command, phaseResultsFormatted: HTMLSectionRenderData[]) {
  cli.log(chalk.bgWhiteBright(chalkScheme.tbBranding.dkBlue('\n    =========== Benchmark Results Summary ===========    ')));
  cli.log('Red color means there was a regression. Green color means there was an improvement. You can view more details about the phases above.\n');
  phaseResultsFormatted.forEach((phaseData: HTMLSectionRenderData) => {
    let msg = `${chalk.bold(phaseData.phase)} phase results are `;

    if (phaseData.isSignificant) {
      let coloredDiff;
      if (phaseData.hlDiff < 0) {
        msg += `${chalk.black.bgRed(' SIGNIFICANT ')}`;
        coloredDiff = chalk.red(`+${Math.abs(phaseData.hlDiff)}`);
      } else {
        msg += `${chalk.black.bgGreen(' SIGNIFICANT ')}`;
        coloredDiff = chalk.green(`-${Math.abs(phaseData.hlDiff)}`);
      }
      msg += ` with an estimated difference of ${coloredDiff}ms`;
    } else {
      msg += `${chalk.black.bgWhite(' NOT SIGNIFICANT ')}`;
    }

    msg += '. \n';
    cli.log(msg);
  });
}

/**
 * Collect and analyze the data for the different phases for the experiment and control set and output the result to the console.
 *
 * @param results - This is expected to be generated from tracerbench core's runner. Containing the dataset for experiment and control
 * @param flags - This is expected to be CLI flags from the "compare" command
 * @param cli - This is expected to be a "compare" Command instance
 */
export function logCompareResults(results: ITracerBenchTraceResult[], flags: ICompareFlags, cli: Command) {
  const {
    fidelity,
  } = flags;
  const benchmarkTable = new TBTable('Initial Render');
  const phaseTable = new TBTable('Phase');

  const controlData = results.find(element => {
    return element.set === 'control';
  }) as ITracerBenchTraceResult;

  const experimentData = results.find(element => {
    return element.set === 'experiment';
  }) as ITracerBenchTraceResult;

  const valuesByPhaseControl = bucketPhaseValues(controlData.samples);
  const valuesByPhaseExperiment = bucketPhaseValues(experimentData.samples);

  const subPhases = Object.keys(valuesByPhaseControl).filter((k) => k !== PAGE_LOAD_TIME);
  const phaseResultsFormatted: HTMLSectionRenderData[] = [];

  const durationStats = new Stats({
    control: valuesByPhaseControl.duration,
    experiment: valuesByPhaseExperiment.duration,
    name: 'duration',
  });
  benchmarkTable.display.push(durationStats);
  // @ts-ignore
  phaseResultsFormatted.push(formatPhaseData(valuesByPhaseControl[PAGE_LOAD_TIME], valuesByPhaseExperiment[PAGE_LOAD_TIME], PAGE_LOAD_TIME));

  subPhases.forEach(phase => {
    phaseTable.display.push(new Stats({
      control: valuesByPhaseControl[phase],
      experiment: valuesByPhaseExperiment[phase],
      name: phase,
    }));
    // @ts-ignore
    phaseResultsFormatted.push(formatPhaseData(valuesByPhaseControl[phase], valuesByPhaseExperiment[phase], phase));
  });

  const areResultsSignificant = anyResultsSignificant(fidelity, benchmarkTable.isSigArray, phaseTable.isSigArray);
  const isBelowRegressionThreshold = anyBelowRegressionThreshold(flags, areResultsSignificant, benchmarkTable, phaseTable);

  cli.log(`\n\n${benchmarkTable.render()}`);
  cli.log(`\n\n${phaseTable.render()}`);

  outputRunMetaMessagesAndWarnings(cli, flags, isBelowRegressionThreshold);
  outputSummaryReport(cli, phaseResultsFormatted);
}
