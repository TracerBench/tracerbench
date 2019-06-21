import {
  getSamples,
  sortSamples,
  rankSamples,
  getTMinusVal,
  getTPlusVal,
  getWilcoxonSignedRankTest,
} from '../../src/helpers/statistics/wilcoxon-signed-rank';

import { expect } from 'chai';

// prettier-ignore
const control = [18.3,13.3,16.5,12.6,9.5,13.6,8.1,8.9,10.0,8.3,7.9,8.1,13.4];
// prettier-ignore
const experiment = [12.7,11.1,15.3,12.7,10.5,15.6,11.2,14.2,16.2,15.5,19.9,20.4,36.8];
const samples = getSamples(control, experiment);
const sortedSamples = sortSamples(samples);
const rankedSamples = rankSamples(sortedSamples);
const tMinusVal = getTMinusVal(rankedSamples);
const tPlusVal = getTPlusVal(rankedSamples);
const wStat = Math.min(tMinusVal, tPlusVal);
const isSigWilcoxonSignedRankTest = getWilcoxonSignedRankTest(
  control,
  experiment
);

describe('wilcoxon signed rank', () => {
  it(`getsSamples()`, () => {
    expect({ c: 0, e: 0, diff: 0, absDiff: 0, rank: 0 }).to.have.all.keys(
      samples[0]
    );
  });

  it(`sortSamples()`, () => {
    expect(sortedSamples[0].absDiff).to.be.lt(sortedSamples[1].absDiff);
  });

  it(`rankSamples()`, () => {
    expect(rankedSamples[0].rank).to.equal(1);
  });

  it(`getTMinusVal()`, () => {
    expect(tMinusVal).to.equal(16);
  });

  it(`getTPlusVal()`, () => {
    expect(tPlusVal).to.equal(75);
  });

  it(`wStat`, () => {
    expect(wStat).to.equal(16);
  });

  it(`getWilcoxonSignedRankTest()`, () => {
    expect(isSigWilcoxonSignedRankTest).to.equal('Yes');
  });
});
