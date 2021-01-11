import { expect } from "chai";
import { readJsonSync } from "fs-extra";
import {
  GenerateStats,
  ITracerBenchTraceResult,
  ParsedTitleConfigs,
} from "../../src/compare/generate-stats";
import { COMPARE_JSON } from "../test-helpers";

const REPORT_TITLES: ParsedTitleConfigs = {
  servers: [],
  plotTitle: "Foo Title",
  browserVersion: "1.2.3",
};

const CONTROL_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[0];
const EXPERIMENT_DATA: ITracerBenchTraceResult = readJsonSync(COMPARE_JSON)[1];
const stats = new GenerateStats(CONTROL_DATA, EXPERIMENT_DATA, REPORT_TITLES);

describe("generate-stats", () => {
  it(`generateData() durationSection`, () => {
    const { durationSection } = stats;
    const {
      controlFormatedSamples,
      experimentFormatedSamples,
    } = durationSection;
    // STATS
    // duration control in ms and not sorted
    expect(durationSection.stats.control[0]).to.eql(305);
    expect(durationSection.stats.control[19]).to.eql(434);
    // duration experiment in ms and not sorted
    expect(durationSection.stats.experiment[0]).to.eql(1299);
    expect(durationSection.stats.experiment[19]).to.eql(1328);
    // duration control in ms and sorted
    expect(durationSection.stats.controlSorted[0]).to.eql(305);
    expect(durationSection.stats.controlSorted[19]).to.eql(434);
    // duration experiment in ms and sorted
    expect(durationSection.stats.experimentSorted[0]).to.eql(1299);
    expect(durationSection.stats.experimentSorted[19]).to.eql(1328);
    // duration name
    expect(durationSection.stats.name).to.eql("duration");
    // sample count
    expect(durationSection.stats.sampleCount.control).to.eql(20);
    expect(durationSection.stats.sampleCount.experiment).to.eql(20);
    // duration 95% confidence-interval
    expect(durationSection.stats.confidenceInterval.min).to.eql(-1001);
    expect(durationSection.stats.confidenceInterval.max).to.eql(-996);
    expect(durationSection.stats.confidenceInterval.isSig).to.be.true;
    expect(durationSection.stats.confidenceIntervals[95].min).to.eql(-1001);
    expect(durationSection.stats.confidenceIntervals[95].max).to.eql(-996);
    expect(durationSection.stats.confidenceIntervals[95].isSig).to.be.true;
    // duration 99% confidence-interval
    expect(durationSection.stats.confidenceIntervals[99].min).to.eql(-1002);
    expect(durationSection.stats.confidenceIntervals[99].max).to.eql(-995);
    expect(durationSection.stats.confidenceIntervals[99].isSig).to.be.true;
    // duration estimator
    expect(durationSection.stats.estimator).to.eql(-999);
    // duration control outliers
    expect(durationSection.stats.outliers.control.outliers.length).to.eq(3);
    expect(durationSection.stats.outliers.control.outliers[0]).to.eq(315);
    expect(durationSection.stats.outliers.control.outliers[1]).to.eq(338);
    expect(durationSection.stats.outliers.control.lowerOutlier).to.eq(304);
    expect(durationSection.stats.outliers.control.upperOutlier).to.eq(314);
    // duration experiment outliers
    expect(durationSection.stats.outliers.experiment.outliers.length).to.eq(4);
    expect(durationSection.stats.outliers.experiment.outliers[0]).to.eq(1299);
    expect(durationSection.stats.outliers.experiment.outliers[1]).to.eq(1320);
    expect(durationSection.stats.outliers.experiment.outliers[2]).to.eq(1325);
    expect(durationSection.stats.outliers.experiment.outliers[3]).to.eq(1328);
    expect(durationSection.stats.outliers.experiment.lowerOutlier).to.eq(1300);
    expect(durationSection.stats.outliers.experiment.upperOutlier).to.eq(1318);
    // duration interquartile range
    expect(durationSection.stats.outliers.control.IQR).to.eq(2);
    expect(durationSection.stats.outliers.experiment.IQR).to.eq(4);
    // duration is significant
    expect(durationSection.isSignificant).to.be.true;
    // duration sample count
    expect(durationSection.sampleCount).to.eq(20);
    // duration confidence interval min
    expect(durationSection.ciMin).to.eq(-1001);
    // duration confidence interval max
    expect(durationSection.ciMax).to.eq(-996);
    // duration estimator
    expect(durationSection.hlDiff).to.eq(-999);
    // duration control formatted samples
    expect(controlFormatedSamples.min).to.eq(305);
    expect(controlFormatedSamples.q1).to.eq(308);
    expect(controlFormatedSamples.median).to.eq(309);
    expect(controlFormatedSamples.q3).to.eq(311);
    expect(controlFormatedSamples.max).to.eq(434);
    expect(controlFormatedSamples.outliers.length).to.eq(3);
    expect(controlFormatedSamples.outliers[0]).to.eq(315);
    expect(controlFormatedSamples.outliers[1]).to.eq(338);
    expect(controlFormatedSamples.samplesMS[0]).to.eq(305);
    expect(controlFormatedSamples.samplesMS[19]).to.eq(434);
    // duration experiment formatted samples
    expect(experimentFormatedSamples.min).to.eq(1299);
    expect(experimentFormatedSamples.q1).to.eq(1307);
    expect(experimentFormatedSamples.median).to.eq(1309);
    expect(experimentFormatedSamples.q3).to.eq(1311);
    expect(experimentFormatedSamples.max).to.eq(1328);
    expect(experimentFormatedSamples.outliers.length).to.eq(4);
    expect(experimentFormatedSamples.outliers[0]).to.eq(1299);
    expect(experimentFormatedSamples.outliers[1]).to.eq(1320);
    expect(experimentFormatedSamples.outliers[2]).to.eq(1325);
    expect(experimentFormatedSamples.outliers[3]).to.eq(1328);
    expect(experimentFormatedSamples.samplesMS[0]).to.eq(1299);
    expect(experimentFormatedSamples.samplesMS[3]).to.eq(1305);
    expect(experimentFormatedSamples.samplesMS[19]).to.eq(1328);
  });

  it(`generateData() subPhaseSections`, () => {
    const { subPhaseSections } = stats;
    const renderPhase = subPhaseSections[5];
    const { controlFormatedSamples, experimentFormatedSamples } = renderPhase;
    // STATS
    // subphase
    expect(subPhaseSections.length).to.eql(7);
    // render control in ms and not sorted
    expect(renderPhase.stats.control[0]).to.eql(20);
    expect(renderPhase.stats.control[19]).to.eql(29);
    // render experiment in ms and not sorted
    expect(renderPhase.stats.experiment[0]).to.eql(20);
    expect(renderPhase.stats.experiment[19]).to.eql(23);
    // render control in ms and sorted
    expect(renderPhase.stats.controlSorted[0]).to.eql(20);
    expect(renderPhase.stats.controlSorted[19]).to.eql(29);
    // render experiment in ms and sorted
    expect(renderPhase.stats.experimentSorted[0]).to.eql(20);
    expect(renderPhase.stats.experimentSorted[19]).to.eql(23);
    // render estimator
    expect(renderPhase.stats.estimator).to.eql(0);
    // phase name
    expect(renderPhase.phase).to.eq("render");
    // render is significant
    expect(renderPhase.isSignificant).to.be.false;
    // render sample count
    expect(renderPhase.sampleCount).to.eq(20);
    // render confidence interval min
    expect(renderPhase.ciMin).to.eq(0);
    // render confidence interval max
    expect(renderPhase.ciMax).to.eq(1);
    // render estimator
    expect(renderPhase.hlDiff).to.eq(0);
    // render control formatted samples
    expect(controlFormatedSamples.min).to.eq(20);
    expect(controlFormatedSamples.q1).to.eq(20);
    expect(controlFormatedSamples.median).to.eq(20);
    expect(controlFormatedSamples.q3).to.eq(21);
    expect(controlFormatedSamples.max).to.eq(29);
    expect(controlFormatedSamples.outliers.length).to.eq(2);
    expect(controlFormatedSamples.outliers[0]).to.eq(23);
    expect(controlFormatedSamples.samplesMS[0]).to.eq(20);
    expect(controlFormatedSamples.samplesMS[19]).to.eq(29);
    // render experiment formatted samples
    expect(experimentFormatedSamples.min).to.eq(20);
    expect(experimentFormatedSamples.q1).to.eq(20);
    expect(experimentFormatedSamples.median).to.eq(20);
    expect(experimentFormatedSamples.q3).to.eq(21);
    expect(experimentFormatedSamples.max).to.eq(23);
    expect(experimentFormatedSamples.outliers.length).to.eq(2);
    expect(experimentFormatedSamples.samplesMS[0]).to.eq(20);
    expect(experimentFormatedSamples.samplesMS[12]).to.eq(20);
    expect(experimentFormatedSamples.samplesMS[19]).to.eq(23);
  });

  it(`bucketCumulative() cumulativeData`, () => {
    const { cumulativeData } = stats;
    const { categories, controlData, experimentData } = cumulativeData;
    expect(categories.length).to.eql(7);
    expect(categories[0]).to.eq("jquery");
    expect(categories[6]).to.eq("afterRender");
    // cumulative any sample within the first phase should be lt future phases
    // phase 0 < phase 1, phase 1 < phase 2, phase 2 < phase 3 ...
    // covers bucketPhaseValues()
    expect(controlData[0][0]).to.be.lt(controlData[1][0]);
    expect(controlData[1][0]).to.be.lt(controlData[2][0]);
    expect(controlData[2][0]).to.be.lt(controlData[3][0]);
    expect(controlData[3][0]).to.be.lt(controlData[4][0]);
    expect(controlData[4][0]).to.be.lt(controlData[5][0]);
    expect(controlData[5][0]).to.be.lt(controlData[6][0]);

    expect(experimentData[0][0]).to.be.lt(experimentData[1][0]);
    expect(experimentData[1][0]).to.be.lt(experimentData[2][0]);
    expect(experimentData[2][0]).to.be.lt(experimentData[3][0]);
    expect(experimentData[3][0]).to.be.lt(experimentData[4][0]);
    expect(experimentData[4][0]).to.be.lt(experimentData[5][0]);
    expect(experimentData[5][0]).to.be.lt(experimentData[6][0]);
  });
});
