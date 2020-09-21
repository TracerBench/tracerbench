import { ISevenFigureSummary } from "@tracerbench/stats";
import * as chalk from "chalk";

import { fidelityLookup } from "../command-config";
import { logHeading } from "../helpers/utils";
import { GenerateStats, HTMLSectionRenderData } from "./generate-stats";
import TBTable from "./tb-table";

export interface ICompareJSONResult {
  heading: string;
  phaseName: string;
  isSignificant: boolean;
  estimatorDelta: string;
  controlSampleCount: number;
  experimentSampleCount: number;
  confidenceInterval: string[];
  controlSevenFigureSummary: ISevenFigureSummary;
  experimentSevenFigureSummary: ISevenFigureSummary;
}

export interface ICompareJSONResults {
  benchmarkTableData: ICompareJSONResult[];
  phaseTableData: ICompareJSONResult[];
  areResultsSignificant: boolean;
  isBelowRegressionThreshold: boolean;
}

type PhaseResultsFormatted = Array<
  Pick<
    HTMLSectionRenderData,
    "phase" | "hlDiff" | "isSignificant" | "ciMin" | "ciMax"
  >
>;

// collect and analyze the data for the different phases for the experiment and control set and output the result to the console.
export class CompareResults {
  benchmarkTable = new TBTable("Initial Render");
  phaseTable = new TBTable("Sub Phase of Duration");
  benchmarkTableData: ICompareJSONResult[];
  phaseTableData: ICompareJSONResult[];
  phaseResultsFormatted: PhaseResultsFormatted = [];
  areResultsSignificant = false;
  isBelowRegressionThreshold = true;
  fidelity: number;
  regressionThreshold: number;
  constructor(
    generateStats: GenerateStats,
    fidelity: number,
    regressionThreshold: number
  ) {
    this.fidelity = fidelity;
    this.regressionThreshold = regressionThreshold;
    this.phaseResultsFormatted.push(generateStats.durationSection);
    this.benchmarkTable.display.push(generateStats.durationSection.stats);

    generateStats.subPhaseSections.map((section) => {
      this.phaseTable.display.push(section.stats);
      this.phaseResultsFormatted.push(section);
    });

    this.benchmarkTableData = this.benchmarkTable.getData();
    this.phaseTableData = this.phaseTable.getData();

    // check if any resul is significant
    this.areResultsSignificant = this.anyResultsSignificant(
      this.benchmarkTable.isSigArray,
      this.phaseTable.isSigArray
    );

    // if any result is significant then
    // check if these are still below the set regression threshold
    if (this.areResultsSignificant) {
      this.isBelowRegressionThreshold = this.allBelowRegressionThreshold(
        this.benchmarkTable.estimatorDeltas,
        this.phaseTable.estimatorDeltas
      );
    }
  }

  // output meta data about the benchmark run and FYI messages to the user
  private logMetaMessagesAndWarnings(): void {
    const LOW_FIDELITY_WARNING =
      'The fidelity setting was set below the recommended for a viable result. Rerun TracerBench with at least "--fidelity=low" OR >= 10';
    const REGRESSION_ALERT = `Regression found exceeding the set regression threshold of ${this.regressionThreshold} ms`;

    if (this.fidelity < 10) {
      logHeading(LOW_FIDELITY_WARNING, "warn");
    }

    if (!this.isBelowRegressionThreshold) {
      logHeading(REGRESSION_ALERT, "alert");
    }
  }

  // generate the summary section for the results
  // for each phase, color the significance appropriately by the HL estimated difference.
  // red for regression, green for improvement. Color with monotone if not significant.
  private logStatSummaryReport(): void {
    logHeading("Benchmark Results Summary", "log");

    this.phaseResultsFormatted.forEach((phaseData) => {
      const { phase, hlDiff, isSignificant, ciMin, ciMax } = phaseData;
      let msg = `${chalk.bold(phase)} phase `;
      const hlDiffisSig = Math.abs(hlDiff) >= 1 ? true : false;
      // isSignificant comes from the confidence interval range NOT estimator
      if (isSignificant && hlDiffisSig) {
        let coloredDiff;

        msg += "estimated ";

        if (hlDiff < 0) {
          coloredDiff = chalk.red(
            `+${Math.abs(hlDiff)}ms [${ciMax * -1}ms to ${ciMin * -1}ms]`
          );
          msg += `regression ${coloredDiff}`;
        } else {
          coloredDiff = chalk.green(
            `-${Math.abs(hlDiff)}ms [${ciMax * -1}ms to ${ciMin * -1}ms]`
          );
          msg += `improvement ${coloredDiff}`;
        }
      } else {
        msg += `${chalk.grey("no difference")}`;
      }
      console.log(msg);
    });

    console.log(`\n`);

    return;
  }

  // if fidelity is at acceptable number, return true if any of the phase results were significant
  public anyResultsSignificant(
    benchmarkIsSigArray: boolean[],
    phaseIsSigArray: boolean[]
  ): boolean {
    // if fidelity !== 'test'
    if (this.fidelity > fidelityLookup.test) {
      return (
        benchmarkIsSigArray.includes(true) || phaseIsSigArray.includes(true)
      );
    }
    return false;
  }

  // if any phase of the experiment has regressed slower beyond the threshold limit returns false; otherwise true
  public allBelowRegressionThreshold(
    benchmarkTableEstimatorDeltas: number[],
    phaseTableEstimatorDeltas: number[]
  ): boolean {
    const regressionThreshold = this.regressionThreshold;
    function isBelowThreshold(n: number): boolean {
      const limit = regressionThreshold;
      // if the delta is a negative number and abs(delta) greater than threshold return false
      return n < 0 && Math.abs(n) > limit ? false : true;
    }
    // concat estimator deltas from all phases
    const deltas: number[] = benchmarkTableEstimatorDeltas.concat(
      phaseTableEstimatorDeltas
    );
    // if the experiment is slower beyond the threshold return false;
    return deltas.every(isBelowThreshold);
  }

  // return the trimmed compare results in JSON format
  // this is propogated as the default return all the way up to the Compare command directly
  public stringifyJSON(): string {
    const benchmarkTableData = this.benchmarkTableData;
    const phaseTableData = this.phaseTableData;
    const areResultsSignificant = this.areResultsSignificant;
    const isBelowRegressionThreshold = this.isBelowRegressionThreshold;
    const jsonResults: ICompareJSONResults = {
      benchmarkTableData,
      phaseTableData,
      areResultsSignificant,
      isBelowRegressionThreshold,
    };
    return JSON.stringify(jsonResults);
  }

  public logTables(): void {
    // log the stdout tables
    // only log the tables when NOT in a CI env
    console.log(`\n\n${this.benchmarkTable.render()}`);
    console.log(`\n\n${this.phaseTable.render()}`);
  }

  public logSummary(): void {
    // log the fidelity and regression warnings
    this.logMetaMessagesAndWarnings();

    // log the summary delta with confidence interval and estimator
    this.logStatSummaryReport();
  }
}
