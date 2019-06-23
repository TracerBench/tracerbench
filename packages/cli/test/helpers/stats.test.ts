import { Stats } from '../../src/helpers/statistics/stats';
import { expect } from 'chai';
import { fillArray } from '../../src/helpers/utils';

// 1, 2, 3, 4...25
const control = fillArray(25, 1, 1);

// 25, 26, 27, 28...50
const experiment = fillArray(25, 1, 26);

const name = 'stats-test';
const stats = new Stats({ control, experiment, name });

describe('stats', () => {
  it(`name()`, () => {
    expect(stats.name).to.equal('stats-test');
  });

  it(`confidenceInterval()`, () => {
    expect(stats.confidenceInterval.min).to.equal(-0.02);
    expect(stats.confidenceInterval.max).to.equal(-0.02);
  });

  it(`sevenFigureSummary()`, () => {
    const controlQuantiles = stats.sevenFigureSummary.control;
    const experimentQuantiles = stats.sevenFigureSummary.experiment;

    expect(controlQuantiles.min).to.equal(0.001);
    expect(controlQuantiles.max).to.equal(0.025);
    expect(controlQuantiles[25]).to.equal(0.007);
    expect(controlQuantiles[50]).to.equal(0.013);
    expect(controlQuantiles[75]).to.equal(0.019);

    expect(experimentQuantiles.min).to.equal(0.026);
    expect(experimentQuantiles.max).to.equal(0.05);
    expect(experimentQuantiles[10]).to.equal(0.0284);
    expect(experimentQuantiles[90]).to.equal(0.0476);
  });

  it(`getHodgesLehmann()`, () => {
    expect(stats.estimator).to.equal(-0.025);
  });

  it(`isSigWilcoxonRankSumTest()`, () => {
    expect(stats.isSigWilcoxonRankSumTest).to.equal('No');
  });

  it(`getSparkline()`, () => {
    expect(stats.sparkLine.control).to.equal('▆████▂▁▁▁▁▁');
    expect(stats.sparkLine.experiment).to.equal('▁▁▁▁▁▆████▂');
  });
});
