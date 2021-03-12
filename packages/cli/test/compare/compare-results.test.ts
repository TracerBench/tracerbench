import { expect } from "chai";
import { readJsonSync } from "fs-extra";
import {
  GenerateStats,
  ITracerBenchTraceResult,
  ParsedTitleConfigs,
} from "../../src/compare/generate-stats";
import {
  CompareResults,
  ICompareJSONResults,
} from "../../src/compare/compare-results";

import { COMPARE_JSON } from "../test-helpers";

const REPORT_TITLES: ParsedTitleConfigs = {
  servers: [],
  plotTitle: "Foo Title",
  browserVersion: "1.2.3",
};

const tableDataObj = {
  heading: "",
  phaseName: "",
  isSignificant: true,
  estimatorDelta: "",
  controlSampleCount: 1,
  pValue: 1,
  experimentSampleCount: 1,
  confidenceInterval: [[]],
  controlSevenFigureSummary: [{}],
  experimentSevenFigureSummary: [{}],
  asPercent: {}
};

/*
SORTED AND IN MILLISECONDS
CONTROL_DATA: [
  305, 306, 307, 307, 308,
  308, 309, 309, 309, 309,
  309, 309, 310, 310, 310,
  312, 312, 315, 338, 434
]
EXPERIMENT_DATA: [
  1299, 1301, 1304, 1305,
  1306, 1307, 1308, 1308,
  1309, 1309, 1309, 1309,
  1309, 1310, 1311, 1312,
  1313, 1320, 1325, 1328
]
*/
const DEFAULT_REGRESSION_THRESHOLD = 50;
const CONTROL_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[0];
const EXPERIMENT_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[1];
const stats = new GenerateStats(CONTROL_DATA, EXPERIMENT_DATA, REPORT_TITLES);
const compareResults = new CompareResults(stats, 20, DEFAULT_REGRESSION_THRESHOLD);

describe("compare-results anyResultsSignificant()", () => {
  const truthyArr = [true, true, false];
  const falsyArr = [false, false, false];
  it(`stat-sig results are significant`, () => {
    const isSigA = compareResults.anyResultsSignificant(truthyArr, falsyArr);
    const isSigB = compareResults.anyResultsSignificant(falsyArr, truthyArr);
    expect(isSigA).to.be.true;
    expect(isSigB).to.be.true;
  });
  it(`stat-sig results are not significant`, () => {
    const isNotSig = compareResults.anyResultsSignificant(falsyArr, falsyArr);
    expect(isNotSig).to.be.false;
  });
});

describe("compare-results anyResultsSignificant()", () => {
  const truthyArr = [true, true, false];
  const falsyArr = [false, false, false];
  it(`stat-sig results are significant`, () => {
    const isSigA = compareResults.anyResultsSignificant(truthyArr, falsyArr);
    const isSigB = compareResults.anyResultsSignificant(falsyArr, truthyArr);
    expect(isSigA).to.be.true;
    expect(isSigB).to.be.true;
  });
  it(`stat-sig results are not significant`, () => {
    const isNotSig = compareResults.anyResultsSignificant(falsyArr, falsyArr);
    expect(isNotSig).to.be.false;
  });
});

describe("compare-results allBelowRegressionThreshold()", () => {
  it(`regression is below threshold : default regressionThresholdStatistic : estimator`, () => {
    compareResults.regressionThreshold = 1100;
    const isBelowThreshold = compareResults.allBelowRegressionThreshold();
    expect(isBelowThreshold).to.be.true;
    compareResults.regressionThreshold = DEFAULT_REGRESSION_THRESHOLD;
  });
  it(`regression is above threshold : default regressionThresholdStatistic : estimator`, () => {
    compareResults.regressionThreshold = 50;
    const isBelowThreshold = compareResults.allBelowRegressionThreshold();
    expect(isBelowThreshold).to.be.false;
    compareResults.regressionThreshold = DEFAULT_REGRESSION_THRESHOLD;
  });
  it(`regression is below threshold : regressionThresholdStatistic : ci-lower`, () => {
    const compareResultsCILower = new CompareResults(stats, 20, 1002, "ci-lower");
    const isBelowThresholdCILower = compareResultsCILower.allBelowRegressionThreshold();
    expect(isBelowThresholdCILower).to.be.true;
  });
  it(`regression is above threshold : regressionThresholdStatistic : ci-lower`, () => {
    const compareResultsCILower = new CompareResults(stats, 20, 995, "ci-lower");
    const isBelowThresholdCILower = compareResultsCILower.allBelowRegressionThreshold();
    expect(isBelowThresholdCILower).to.be.false;
  });
  it(`regression is below threshold : regressionThresholdStatistic : ci-upper`, () => {
    const compareResultsCIUpper = new CompareResults(stats, 20, 1100, "ci-upper");
    const isBelowThresholdCIUpper = compareResultsCIUpper.allBelowRegressionThreshold();
    expect(isBelowThresholdCIUpper).to.be.true;
  });
  it(`regression is above threshold : regressionThresholdStatistic : ci-upper`, () => {
    const compareResultsCIUpper = new CompareResults(stats, 20, 1000, "ci-upper");
    const isBelowThresholdCIUpper = compareResultsCIUpper.allBelowRegressionThreshold();
    expect(isBelowThresholdCIUpper).to.be.false;
  });
});

describe("compare-results stringifyJSON()", () => {
  it(`trimmed compare results in JSON`, () => {
    const compareJSONResults: ICompareJSONResults = JSON.parse(
      compareResults.stringifyJSON()
    );

    const benchmarkTableData = compareJSONResults.benchmarkTableData[0];
    const phaseTableData = compareJSONResults.phaseTableData;

    // benchmark table data
    expect(benchmarkTableData).to.have.all.keys(tableDataObj);
    expect(benchmarkTableData.isSignificant).to.be.true;
    expect(benchmarkTableData.phaseName).to.eq("duration");
    expect(benchmarkTableData.estimatorDelta).to.eq("999ms");
    expect(phaseTableData[0].phaseName).to.eq("jquery");

    expect(compareJSONResults.areResultsSignificant).to.be.true;
    expect(compareJSONResults.isBelowRegressionThreshold).to.be.false;
    expect(compareJSONResults.regressionThresholdStat).to.eq("estimator");
    // lower eg -5 | 2 | 0
    expect(compareJSONResults.benchmarkTableData[0].asPercent.percentMin).to.eq(322.8);
    // middle eg -3 | 5 | 2
    expect(compareJSONResults.benchmarkTableData[0].asPercent.percentMedian).to.eq(323.7);
    // upper eg 2 | 10 | 3
    expect(compareJSONResults.benchmarkTableData[0].asPercent.percentMax).to.eq(324.4);
  });
});
