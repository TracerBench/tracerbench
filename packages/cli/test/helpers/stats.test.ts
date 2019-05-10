import { Stats } from '../../src/helpers/stats';
import { expect } from 'chai';
import { fillArray } from '../../src/helpers/utils';

// 1, 2, 3, 4...25
const control = fillArray(25, 1, 1);

// 25, 26, 27, 28...50
const experiment = fillArray(25, 1, 26);

const name = 'stats-test';
const stats = new Stats({ control, experiment, name });

describe('stats', () => {
  it(`getRange()`, () => {
    expect(stats.range.min).to.equal(1);
    expect(stats.range.max).to.equal(50);
  });

  it(`getHistogram()`, () => {
    const cHistogram = stats.controlDistributionHistogram;
    const eHistogram = stats.experimentDistributionHistogram;
    const cLength = cHistogram.length;
    const eLength = eHistogram.length;

    expect(cHistogram[0]).to.equal(4);
    expect(cHistogram[cLength - 1]).to.equal(0);
    expect(cHistogram.length).to.equal(11);
    expect(eHistogram[0]).to.equal(0);
    expect(eHistogram[eLength - 1]).to.equal(1);
    expect(eHistogram.length).to.equal(11);
  });

  it(`getQuantiles()`, () => {
    const cQuantiles = stats.controlQuantiles;
    const eQuantiles = stats.experimentQuantiles;

    // buckets
    expect(cQuantiles.length).to.equal(11);
    expect(eQuantiles.length).to.equal(11);

    // median
    expect(cQuantiles[5].p).to.equal(0.5);
    expect(cQuantiles[5].val).to.equal(13);
    expect(eQuantiles[5].p).to.equal(0.5);
    expect(eQuantiles[5].val).to.equal(38);

    // 3rd decile
    expect(cQuantiles[3].val).to.equal(8.2);
    expect(eQuantiles[3].val).to.equal(33.2);

    // 6th decile
    expect(cQuantiles[6].val).to.equal(15.399999999999999);
    expect(eQuantiles[6].val).to.equal(40.4);
  });

  it(`getHodgesLehmann()`, () => {
    expect(stats.estimator).to.equal(-25);
  });

  it(`getSparkline()`, () => {
    expect(stats.controlDistributionSparkline).to.equal('▆████▂▁▁▁▁▁');
    expect(stats.experimentDistributionSparkline).to.equal('▁▁▁▁▁▆████▂');
  });
});
