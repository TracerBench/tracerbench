/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filenames/match-exported */
import { IConfig } from "@oclif/config";
import * as Parser from "@oclif/parser";
import { readJsonSync } from "fs-extra";

import { TBBaseCommand } from "../../command-config";
import { resultsFile } from "../../helpers/args";
import { fidelity, isCIEnv, regressionThreshold } from "../../helpers/flags";
import { logCompareResults } from "../../helpers/log-compare-results";

export interface CompareAnalyzeFlags {
  fidelity: number;
  regressionThreshold: number;
  isCIEnv: boolean;
}
export default class CompareAnalyze extends TBBaseCommand {
  public static description = `Generates stdout report from the "tracerbench compare" command output`;

  public static args = [resultsFile];
  public static flags = {
    fidelity: fidelity({ required: true }),
    regressionThreshold: regressionThreshold({ required: true }),
    isCIEnv: isCIEnv({ required: true }),
  };
  public typedFlags: CompareAnalyzeFlags;
  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    this.typedFlags = this.parseFlags(CompareAnalyze);
  }

  public async run(): Promise<string> {
    const { args } = this.parse(CompareAnalyze);
    const results = readJsonSync(args.resultsFile);
    return await logCompareResults(results, this.typedFlags, this);
  }

  private parseFlags(CompareAnalyze: Parser.Input<any>): CompareAnalyzeFlags {
    const { flags } = this.parse(CompareAnalyze);
    const { fidelity, regressionThreshold, isCIEnv } = flags;

    return {
      fidelity,
      regressionThreshold,
      isCIEnv,
    };
  }
}
