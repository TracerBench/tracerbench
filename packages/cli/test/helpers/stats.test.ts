import { Stats } from '../../src/helpers/statistics/stats';
import { expect } from 'chai';

const control = [
  48795,
  48891,
  48954,
  49294,
  49441,
  49458,
  50248,
  50397,
  50578,
  51097,
  51389,
  51389,
  51822,
  51935,
  52039,
  52065,
  52159,
  52199,
  52475,
  52814,
  52901,
  52954,
  54106,
  54194,
  54893,
];

const experiment = [
  1124565,
  1125724,
  1126078,
  1126482,
  1128269,
  1129367,
  1129836,
  1130550,
  1130841,
  1130856,
  1131026,
  1131376,
  1131391,
  1131411,
  1131419,
  1131473,
  1131611,
  1131770,
  1132622,
  1133104,
  1133154,
  1134401,
  1136150,
  1138230,
  1138314,
];

const name = 'stats-test';
const stats = new Stats({ control, experiment, name });

// stats testing a regression experiment
describe('stats', () => {
  it(`name()`, () => {
    expect(stats.name).to.equal('stats-test');
  });

  it(`confidenceInterval()`, () => {
    expect(stats.confidenceInterval.min).to.equal(-1081);
    expect(stats.confidenceInterval.max).to.equal(-1078);
    expect(stats.confidenceInterval.isSig).to.equal('Yes');
  });

  it(`sevenFigureSummary()`, () => {
    const controlQuantiles = stats.sevenFigureSummary.control;
    const experimentQuantiles = stats.sevenFigureSummary.experiment;

    expect(controlQuantiles.min).to.equal(49);
    expect(controlQuantiles.max).to.equal(55);
    expect(controlQuantiles[25]).to.equal(50);
    expect(controlQuantiles[50]).to.equal(52);
    expect(controlQuantiles[75]).to.equal(52);

    expect(experimentQuantiles.min).to.equal(1125);
    expect(experimentQuantiles.max).to.equal(1138);
    expect(experimentQuantiles[10]).to.equal(1126);
    expect(experimentQuantiles[90]).to.equal(1135);
  });

  it(`getHodgesLehmann()`, () => {
    expect(stats.estimator).to.equal(-1080);

    const controlSetForHl = [15000, 17000, 18000];
    const experimentSetForHl = [70000, 80000, 60000];
    const statsForHl = new Stats({ control: controlSetForHl, experiment: experimentSetForHl, name: '2' });
    expect(statsForHl.estimator).to.equal(-53);
  });

  it(`isSigWilcoxonRankSumTest()`, () => {
    expect(stats.confidenceInterval.isSig).to.equal('Yes');
  });

  it(`getSparkline()`, () => {
    expect(stats.sparkLine.control).to.equal('█▁▁▁▁▁▁▁▁▁▁▁');
    expect(stats.sparkLine.experiment).to.equal('▁▁▁▁▁▁▁▁▁▁▁█');
  });
});
