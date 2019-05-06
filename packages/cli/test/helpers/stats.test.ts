import { Stats } from '../../src/helpers/stats';
import { expect } from 'chai';
import { fillArray } from '../../src/helpers/utils';

// 1, 2, 3, 4...30
const control = fillArray(30, 1, 1);

// 31, 32, 33, 34...60
const experiment = fillArray(30, 1, 31);

const name = 'stats-test';
const stats = new Stats({ control, experiment, name });

describe('stats', () => {
  it(`getRange()`, () => {
    expect(stats.range.min).to.equal(1);
    expect(stats.range.max).to.equal(60);
  });

  it(`getHistogram()`, () => {
    const cHistogram = stats.controlDistributionHistogram;
    const eHistogram = stats.experimentDistributionHistogram;
    const cLength = cHistogram.length;
    const eLength = eHistogram.length;

    expect(cHistogram[0]).to.equal(4);
    expect(cHistogram[cLength - 1]).to.equal(0);
    expect(cHistogram.length).to.equal(13);
    expect(eHistogram[0]).to.equal(0);
    expect(eHistogram[eLength - 1]).to.equal(1);
    expect(eHistogram.length).to.equal(13);
  });

  it(`getQuantiles()`, () => {
    const cQuantiles = stats.controlQuantiles;
    const eQuantiles = stats.experimentQuantiles;

    // buckets
    expect(cQuantiles.length).to.equal(11);
    expect(eQuantiles.length).to.equal(11);

    // median
    expect(cQuantiles[5].p).to.equal(0.5);
    expect(cQuantiles[5].val).to.equal(15.5);
    expect(eQuantiles[5].p).to.equal(0.5);
    expect(eQuantiles[5].val).to.equal(45.5);

    // 3rd decile
    expect(cQuantiles[3].val).to.equal(9.7);
    expect(eQuantiles[3].val).to.equal(39.7);

    // 6th decile
    expect(cQuantiles[6].val).to.equal(18.4);
    expect(eQuantiles[6].val).to.equal(48.4);
  });

  it(`getHodgesLehmann()`, () => {
    expect(stats.estimator).to.equal(-30);
  });

  it(`getSparkline()`, () => {
    expect(stats.controlDistributionSparkline).to.equal('▆█████▂▁▁▁▁▁▁');
    expect(stats.experimentDistributionSparkline).to.equal('▁▁▁▁▁▁▆█████▂');
  });
});
