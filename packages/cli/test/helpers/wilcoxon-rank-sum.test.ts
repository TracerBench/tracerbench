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

const data = {
  significant: {
    control: [3, 4, 2, 6, 2, 5],
    experiment: [9, 7, 5, 10, 6, 8],
  },
  nonSignificant: {
    control: [1, 1, 1, 1, 1, 2],
    experiment: [2, 1, 1, 1, 1, 1],
  },
};

const { control: controlSig, experiment: experimentSig } = data.significant;
const { control: controlNon, experiment: experimentNon } = data.nonSignificant;
const N = data.significant.control.length;
const samplePool = getMergedSortedSamples(controlSig, experimentSig);
const controlSamples = getSamples(controlSig, samplePool);
const experimentSamples = getSamples(experimentSig, samplePool);
const rankedControlSamples = rankSamples(controlSamples);
const rankedExperimentSamples = rankSamples(experimentSamples);
const controlRankSum = getRankSum(rankedControlSamples);
const experimentRankSum = getRankSum(rankedExperimentSamples);
const uStatControl = getSampleUStat(controlRankSum, N);
const uStatExperiment = getSampleUStat(experimentRankSum, N);
const uStat = Math.min(uStatControl, uStatExperiment);
const isSigWilcoxonRankSumTest = getWilcoxonRankSumTest(
  controlSig,
  experimentSig
);
const isSigWilcoxonRankSumTestNon = getWilcoxonRankSumTest(
  controlNon,
  experimentNon
);

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

  it(`rankSamples() :: val`, () => {
    expect(rankedControlSamples[0].val).to.equal(2);
    expect(rankedControlSamples[5].val).to.equal(6);
    expect(rankedExperimentSamples[0].val).to.equal(5);
    expect(rankedExperimentSamples[5].val).to.equal(10);
  });

  it(`rankSamples() :: pool`, () => {
    // prettier-ignore
    expect(rankedControlSamples[0].pool).to.eql([2,2,3,4,5,5,6,6,7,8,9,10]);
    // prettier-ignore
    expect(rankedControlSamples[5].pool).to.eql([2,2,3,4,5,5,6,6,7,8,9,10]);
    // prettier-ignore
    expect(rankedExperimentSamples[0].pool).to.eql([2,2,3,4,5,5,6,6,7,8,9,10]);
    // prettier-ignore
    expect(rankedExperimentSamples[5].pool).to.eql([2,2,3,4,5,5,6,6,7,8,9,10]);
  });

  it(`rankSamples() :: samples`, () => {
    // prettier-ignore
    expect(rankedControlSamples[0].samples).to.eql([2,2,3,4,5,6]);
    // prettier-ignore
    expect(rankedControlSamples[5].samples).to.eql([2,2,3,4,5,6]);
    // prettier-ignore
    expect(rankedExperimentSamples[0].samples).to.eql([5,6,7,8,9,10]);
    // prettier-ignore
    expect(rankedExperimentSamples[5].samples).to.eql([5,6,7,8,9,10]);
  });

  it(`rankSamples() :: rank`, () => {
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
    expect(isSigWilcoxonRankSumTestNon).to.equal('No');
  });
});
