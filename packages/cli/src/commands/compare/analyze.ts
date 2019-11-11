import { TBBaseCommand } from '../../command-config';
import { logCompareResults } from '../../helpers/log-compare-results';
import { readJsonSync } from 'fs-extra';
import {
  fidelity,
  tbResultsFolder,
  regressionThreshold,
} from '../../helpers/flags';

export default class CompareAnalyze extends TBBaseCommand {
  public static description =
    'Run an analysis of a benchmark run from a results json file and output to terminal';
  public static args = [
    { name: 'resultsFile', required: true, description: 'Results JSON file' },
  ];
  public static flags = {
    fidelity: fidelity({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
    regressionThreshold: regressionThreshold(),
  };

  public async run(): Promise<string> {
    const { args, flags } = this.parse(CompareAnalyze);
    const results = readJsonSync(args.resultsFile);
    return await logCompareResults(results, flags, this);
  }
}
