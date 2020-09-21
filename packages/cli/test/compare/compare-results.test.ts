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
  experimentSampleCount: 1,
  confidenceInterval: [[]],
  controlSevenFigureSummary: [{}],
  experimentSevenFigureSummary: [{}],
};
const CONTROL_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[0];
const EXPERIMENT_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[1];
const stats = new GenerateStats(CONTROL_DATA, EXPERIMENT_DATA, REPORT_TITLES);
const compareResults = new CompareResults(stats, 20, 50);

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
  const improvementDeltas = [100, 50, 200];
  const regressionDeltas = [-200, -300, -400];
  it(`is below regression threshold`, () => {
    compareResults.regressionThreshold = 100;
    const isBelowThreshold = compareResults.allBelowRegressionThreshold(
      improvementDeltas,
      improvementDeltas
    );
    expect(isBelowThreshold).to.be.true;
    compareResults.regressionThreshold = 50;
  });
  it(`is above regression threshold`, () => {
    compareResults.regressionThreshold = 100;
    const isBelowThresholdA = compareResults.allBelowRegressionThreshold(
      improvementDeltas,
      regressionDeltas
    );
    const isBelowThresholdB = compareResults.allBelowRegressionThreshold(
      regressionDeltas,
      improvementDeltas
    );
    expect(isBelowThresholdA).to.be.false;
    expect(isBelowThresholdB).to.be.false;
    compareResults.regressionThreshold = 50;
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
    // phaseTableData.map((table) => {
    //   expect(table).to.have.all.keys(tableDataObj);
    // });

    expect(compareJSONResults.areResultsSignificant).to.be.true;
    expect(compareJSONResults.isBelowRegressionThreshold).to.be.false;
  });
});
