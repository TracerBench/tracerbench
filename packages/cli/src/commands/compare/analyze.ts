import { Command } from '@oclif/command';
import { logCompareResults } from '../../helpers/log-compare-results';
import * as fs from 'fs-extra';
import { fidelity, tbResultsFolder } from '../../helpers/flags';

export default class CompareAnalyze extends Command {
  public static description =
    'Run an analysis of a benchmark run from a results json file and output to terminal';
  public static args = [
    { name: 'resultsFile', required: true, description: 'Results JSON file' },
  ];
  public static flags = {
    fidelity: fidelity({ required: true }),
    tbResultsFolder: tbResultsFolder({ required: true }),
  };

  public async run(): Promise<string> {
    const { args, flags } = this.parse(CompareAnalyze);
    const results = fs.readJsonSync(args.resultsFile);
    return logCompareResults(results, flags, this);
  }
}
