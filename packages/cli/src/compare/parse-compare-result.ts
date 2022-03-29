import { readFileSync } from "fs-extra";
import * as JSON5 from "json5";
import { resolve } from "path";

import type { ITracerBenchTraceResult } from "./generate-stats";

/*
  FILTERS OUT THE CONTROL AND EXPERIMENT SAMPLES FROM CONTROL.JSON
*/
export default function parseCompareResult(inputFilePath: string): {
  controlData: ITracerBenchTraceResult;
  experimentData: ITracerBenchTraceResult;
} {
  let inputData: ITracerBenchTraceResult[];

  // read the compare.json file
  try {
    inputData = JSON5.parse(readFileSync(resolve(inputFilePath), "utf8"));
    // grab all control samples
    const controlData: ITracerBenchTraceResult = inputData.find((element) => {
      return element.set === "control";
    }) as ITracerBenchTraceResult;

    // grab all experiment samples
    const experimentData = inputData.find((element) => {
      return element.set === "experiment";
    }) as ITracerBenchTraceResult;

    // throw if either control or experiment samples not found
    if (!controlData || !experimentData) {
      throw new Error(
        `The compare.json file is missing the control or experiment data. Likely the benchmark did not run`
      );
    }

    return {
      controlData,
      experimentData,
    };
  } catch (error) {
    throw new Error(
      `The compare.json cannot be parsed. Likely the benchmark did not run. Confirm ${inputFilePath} is valid JSON`
    );
  }
}
