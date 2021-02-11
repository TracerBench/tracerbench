import { Stats } from '../src/stats';
import { expect } from 'chai';
import { REGRESSION_RESULTS, HIGH_VARIANCE_RESULTS } from "./fixtures";
import { roundFloatAndConvertMicrosecondsToMS } from "../src/utils";

const stats = new Stats({ control: REGRESSION_RESULTS.control, experiment: REGRESSION_RESULTS.experiment, name: 'stats-regression-test' });
// high variance with unit converter to MS
const statsHighVarianceMS = new Stats({ control: HIGH_VARIANCE_RESULTS.control, experiment: HIGH_VARIANCE_RESULTS.experiment, name: 'stats-high-variance-test' }, roundFloatAndConvertMicrosecondsToMS);
const statsHighVariance = new Stats({ control: HIGH_VARIANCE_RESULTS.control, experiment: HIGH_VARIANCE_RESULTS.experiment, name: 'stats-high-variance-test' });
const statsMS = new Stats({ control: REGRESSION_RESULTS.control, experiment: REGRESSION_RESULTS.experiment, name: 'stats-regression-test' }, roundFloatAndConvertMicrosecondsToMS);

// stats testing a regression experiment
describe('stats', () => {
  it(`name()`, () => {
    expect(stats.name).to.equal('stats-regression-test');
  });

  // samples sorted
  it(`sortedSamples()`, () => {
    expect(stats.controlSorted[0]).to.equal(48795);
    expect(stats.controlSorted[24]).to.equal(54893);
    expect(stats.experimentSorted[0]).to.equal(1124565);
    expect(stats.experimentSorted[24]).to.equal(1138314);

    // MS
    expect(statsHighVarianceMS.controlSorted[0]).to.equal(2241);
    expect(statsHighVarianceMS.controlSorted[10]).to.equal(2374);
    expect(statsHighVarianceMS.experimentSorted[0]).to.equal(2241);
    expect(statsHighVarianceMS.experimentSorted[10]).to.equal(2364);
  });

  // samples NOT sorted
  it(`samples() NOT SORTED`, () => {
    expect(stats.control[0]).to.equal(48795);
    expect(stats.control[24]).to.equal(54893);
    expect(stats.experiment[0]).to.equal(1124565);
    expect(stats.experiment[24]).to.equal(1138314);

    // MS
    expect(statsHighVarianceMS.control[0]).to.equal(2241);
    expect(statsHighVarianceMS.control[24]).to.equal(2517);
    expect(statsHighVarianceMS.experiment[0]).to.equal(2241);
  });

  // results should show strong evidence to reject H0 for H1
  it(`confidenceInterval()`, () => {
    expect(stats.confidenceInterval.min).to.equal(-1081109);
    expect(stats.confidenceInterval.max).to.equal(-1078490);
    expect(stats.confidenceInterval.isSig).to.equal(true);
    expect(stats.confidenceInterval.median).to.equal(-1079588);
    expect(stats.confidenceInterval.zScore).to.equal(6.054);
    // 0.000000001416
    expect(stats.confidenceInterval.pValue).to.equal(1.416e-9);
    expect(stats.confidenceInterval.U).to.equal(625);
    expect(stats.confidenceInterval.asPercent.percentMin).to.equal(-2086);
    expect(stats.confidenceInterval.asPercent.percentMedian).to.equal(-2083);
    expect(stats.confidenceInterval.asPercent.percentMax).to.equal(-2081);

    // MS
    expect(statsMS.confidenceInterval.asPercent.percentMin).to.equal(-2086);
    expect(statsMS.confidenceInterval.asPercent.percentMedian).to.equal(-2083);
    expect(statsMS.confidenceInterval.asPercent.percentMax).to.equal(-2081);

    // HIGH VARIANCE MS
    expect(statsHighVarianceMS.confidenceInterval.min).to.equal(-95);
    expect(statsHighVarianceMS.confidenceInterval.max).to.equal(84);
    expect(statsHighVarianceMS.confidenceInterval.median).to.equal(-2);
    expect(statsHighVarianceMS.confidenceInterval.pValue).to.equal(0.967);
    expect(statsHighVarianceMS.confidenceInterval.asPercent.percentMin).to.equal(-3.768);
    expect(statsHighVarianceMS.confidenceInterval.asPercent.percentMedian).to.equal(-0.07933);
    expect(statsHighVarianceMS.confidenceInterval.asPercent.percentMax).to.equal(3.332);

    // HIGH VARIANCE
    expect(statsHighVariance.confidenceInterval.asPercent.percentMin).to.equal(-3.768);
    expect(statsHighVariance.confidenceInterval.asPercent.percentMedian).to.equal(-0.07933);
    expect(statsHighVariance.confidenceInterval.asPercent.percentMax).to.equal(3.332);
  });

  it(`sevenFigureSummary()`, () => {
    // ! all control & experiment numbers rounded
    const controlQuantiles = stats.sevenFigureSummary.control;
    const experimentQuantiles = stats.sevenFigureSummary.experiment;

    expect(controlQuantiles.min).to.equal(48795);
    expect(controlQuantiles.max).to.equal(54893);
    expect(controlQuantiles[25]).to.equal(50248);
    expect(controlQuantiles[50]).to.equal(51822);
    expect(controlQuantiles[75]).to.equal(52475);

    expect(experimentQuantiles.min).to.equal(1124565);
    expect(experimentQuantiles.max).to.equal(1138314);
    expect(experimentQuantiles[10]).to.equal(1126240);
    expect(experimentQuantiles[90]).to.equal(1135450);

    // MS
    expect(statsHighVarianceMS.sevenFigureSummary.control.min).to.equal(2241);
    expect(statsHighVarianceMS.sevenFigureSummary.experiment.max).to.equal(5284);
  });

  it(`getHodgesLehmann()`, () => {
    expect(stats.estimator).to.equal(-1079588);

    const controlSetForHl = [15000, 17000, 18000];
    const experimentSetForHl = [70000, 80000, 60000];
    const statsForHl = new Stats({
      control: controlSetForHl,
      experiment: experimentSetForHl,
      name: '2'
    });
    expect(statsForHl.estimator).to.equal(-53000);
  });

  it(`isSigWilcoxonRankSumTest()`, () => {
    expect(stats.confidenceInterval.isSig).to.equal(true);
  });

  it(`getSparkline()`, () => {
    expect(stats.sparkLine.control).to.equal('█▁▁▁▁▁▁▁▁▁▁▁');
    expect(stats.sparkLine.experiment).to.equal('▁▁▁▁▁▁▁▁▁▁▁█');
  });

  it(`getOutliers()`, () => {
    const controlOutliersObj = stats.outliers.control;
    const experimentOutliersObj = stats.outliers.experiment;

    expect(controlOutliersObj.IQR).to.equal(2227);
    expect(controlOutliersObj.lowerOutlier).to.equal(46907);
    expect(controlOutliersObj.upperOutlier).to.equal(55816);
    expect(controlOutliersObj.outliers).length(0);

    expect(experimentOutliersObj.IQR).to.equal(2786);
    expect(experimentOutliersObj.lowerOutlier).to.equal(1125657);
    expect(experimentOutliersObj.upperOutlier).to.equal(1136801);
    expect(experimentOutliersObj.outliers).length(3);
  });

  it(`getBuckets()`, () => {
    expect(stats.range.min).to.equal(48795);
    expect(stats.range.max).to.equal(1138314);
    expect(stats.buckets.length).to.equal(12);
    expect(stats.buckets.length).to.equal(12);
    expect(stats.buckets[0].min).to.be.lessThan(stats.range.min);
    expect(stats.buckets[11].max).to.be.greaterThan(stats.range.max);
    // 0
    expect(stats.buckets[0].min).to.equal(48794);
    expect(stats.buckets[0].max).to.equal(139587);
    expect(stats.buckets[0].count.control).to.equal(25);
    expect(stats.buckets[0].count.experiment).to.equal(0);
    // 1
    expect(stats.buckets[1].min).to.equal(139587);
    expect(stats.buckets[1].max).to.equal(230380);
    expect(stats.buckets[1].count.control).to.equal(0);
    expect(stats.buckets[1].count.experiment).to.equal(0);
    // 2
    expect(stats.buckets[2].min).to.equal(230380);
    expect(stats.buckets[2].max).to.equal(321174);
    expect(stats.buckets[2].count.control).to.equal(0);
    expect(stats.buckets[2].count.experiment).to.equal(0);
    // 3
    expect(stats.buckets[3].min).to.equal(321174);
    expect(stats.buckets[3].max).to.equal(411967);
    expect(stats.buckets[3].count.control).to.equal(0);
    expect(stats.buckets[3].count.experiment).to.equal(0);
    // 4
    expect(stats.buckets[4].min).to.equal(411967);
    expect(stats.buckets[4].max).to.equal(502761);
    expect(stats.buckets[4].count.control).to.equal(0);
    expect(stats.buckets[4].count.experiment).to.equal(0);
    // 5
    expect(stats.buckets[5].min).to.equal(502761);
    expect(stats.buckets[5].max).to.equal(593554);
    expect(stats.buckets[5].count.control).to.equal(0);
    expect(stats.buckets[5].count.experiment).to.equal(0);
    // 6
    expect(stats.buckets[6].min).to.equal(593554);
    expect(stats.buckets[6].max).to.equal(684347);
    expect(stats.buckets[6].count.control).to.equal(0);
    expect(stats.buckets[6].count.experiment).to.equal(0);
    // 7
    expect(stats.buckets[7].min).to.equal(684347);
    expect(stats.buckets[7].max).to.equal(775141);
    expect(stats.buckets[7].count.control).to.equal(0);
    expect(stats.buckets[7].count.experiment).to.equal(0);
    // 8
    expect(stats.buckets[8].min).to.equal(775141);
    expect(stats.buckets[8].max).to.equal(865934);
    expect(stats.buckets[8].count.control).to.equal(0);
    expect(stats.buckets[8].count.experiment).to.equal(0);
    // 9
    expect(stats.buckets[9].min).to.equal(865934);
    expect(stats.buckets[9].max).to.equal(956728);
    expect(stats.buckets[9].count.control).to.equal(0);
    expect(stats.buckets[9].count.experiment).to.equal(0);
    // 10
    expect(stats.buckets[10].min).to.equal(956728);
    expect(stats.buckets[10].max).to.equal(1047521);
    expect(stats.buckets[10].count.control).to.equal(0);
    expect(stats.buckets[10].count.experiment).to.equal(0);
    // 11
    expect(stats.buckets[11].min).to.equal(1047521);
    expect(stats.buckets[11].max).to.equal(1138315);
    expect(stats.buckets[11].count.control).to.equal(0);
    expect(stats.buckets[11].count.experiment).to.equal(25);
  });

  it(`getPopulationVariance()`, () => {
    // low variance
    expect(stats.populationVariance.control).to.equal(2872116.01);
    expect(stats.populationVariance.experiment).to.equal(11279513.36);
    // high variance
    expect(statsHighVarianceMS.populationVariance.control).to.equal(82019760);
    expect(statsHighVarianceMS.populationVariance.experiment).to.equal(207342044);
  });
});
