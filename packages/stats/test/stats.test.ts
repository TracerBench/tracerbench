import { Stats } from '../src/stats';
import { expect } from 'chai';
import { REGRESSION_RESULTS, HIGH_VARIANCE_RESULTS } from "./fixtures";

const stats = new Stats({ control: REGRESSION_RESULTS.control, experiment: REGRESSION_RESULTS.experiment, name: 'stats-regression-test' });
const statsHighVariance = new Stats({ control: HIGH_VARIANCE_RESULTS.control, experiment: HIGH_VARIANCE_RESULTS.experiment, name: 'stats-high-variance-test' });

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
  });

  // samples NOT sorted
  it(`samples() NOT SORTED`, () => {
    expect(stats.control[0]).to.equal(48795);
    expect(stats.control[24]).to.equal(54893);
    expect(stats.experiment[0]).to.equal(1124565);
    expect(stats.experiment[24]).to.equal(1138314);
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
    expect(statsHighVariance.populationVariance.control).to.equal(82019760000);
    expect(statsHighVariance.populationVariance.experiment).to.equal(207342043600);
  });
});
