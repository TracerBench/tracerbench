import {
  wilcoxonRankSumTable,
  getMergedSortedSamples,
  getSamples,
  rankSamples,
  getRankSum,
  getSampleUStat,
  getWilcoxonRankSumTest,
} from '../../src/helpers/wilcoxon-rank-sum';

import { expect } from 'chai';

// prettier-ignore
const control = [3,4,2,6,2,5];
// prettier-ignore
const experiment = [9,7,5,10,6,8];
const N = control.length;
const samplePool = getMergedSortedSamples(control, experiment);
const controlSamples = getSamples(control, samplePool);
const experimentSamples = getSamples(experiment, samplePool);
const rankedControlSamples = rankSamples(controlSamples);
const rankedExperimentSamples = rankSamples(experimentSamples);
const controlRankSum = getRankSum(rankedControlSamples);
const experimentRankSum = getRankSum(rankedExperimentSamples);
const uStatControl = getSampleUStat(controlRankSum, N);
const uStatExperiment = getSampleUStat(experimentRankSum, N);
const uStat = Math.min(uStatControl, uStatExperiment);
const isSigWilcoxonRankSumTest = getWilcoxonRankSumTest(control, experiment);

describe('wilcoxon rank sum', () => {
  it(`wilcoxonRankSumTable`, () => {
    expect(wilcoxonRankSumTable[5]).to.equal(26);
    expect(wilcoxonRankSumTable[19]).to.equal(337);
  });

  it(`getMergedSortedSamples()`, () => {
    expect(samplePool.length).to.equal(12);
    expect(samplePool[0]).to.equal(2);
    expect(samplePool[11]).to.equal(10);
  });

  it(`getsSamples()`, () => {
    expect({ val: 0, rank: 0, pool: [], samples: [] }).to.have.all.keys(
      controlSamples[0]
    );
    expect({ val: 0, rank: 0, pool: [], samples: [] }).to.have.all.keys(
      experimentSamples[0]
    );
  });

  it(`rankSamples()`, () => {
    expect(rankedControlSamples[0].rank).to.equal(1.5);
    expect(rankedControlSamples[5].rank).to.equal(7.5);
    expect(rankedExperimentSamples[0].rank).to.equal(5.5);
    expect(rankedExperimentSamples[5].rank).to.equal(12);
  });

  it(`getRankSum()`, () => {
    expect(controlRankSum).to.equal(23);
    expect(experimentRankSum).to.equal(55);
  });

  it(`uStat()`, () => {
    expect(uStatControl).to.equal(2);
    expect(uStatExperiment).to.equal(34);
    expect(uStat).to.equal(2);
  });

  it(`getWilcoxonRankSumTest()`, () => {
    expect(isSigWilcoxonRankSumTest).to.equal('Yes');
  });
});
