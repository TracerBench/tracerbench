import { readFileSync } from "fs-extra";
import * as JSON5 from "json5";
import { resolve } from "path";

import type { ITracerBenchTraceResult } from "./generate-stats";

export default function parseCompareResult(
  inputFilePath: string
): {
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
      throw new Error(`Missing control or experiment set in compare.json`);
    }

    return {
      controlData,
      experimentData,
    };
  } catch (error) {
    throw new Error(
      `Cannot parse the compare.json file. Please make sure ${inputFilePath} is valid JSON`
    );
  }
}
