// eslint:disable:no-unused-expression

import { expect } from 'chai';
import { test } from '@oclif/test';

import {
  logCompareResults,
  ICompareJSONResults,
  anyResultsSignificant,
  allBelowRegressionThreshold
} from '../../src/helpers/log-compare-results';

import { COMPARE_JSON } from '../test-helpers';

const sampleTrace = {
  duration: 6260696,
  js: 5310439,
  phases: [
    {
      phase: 'load',
      start: 0,
      duration: 1807839
    },
    {
      phase: 'boot',
      start: 1807839,
      duration: 973172
    },
    {
      phase: 'transition',
      start: 2781011,
      duration: 1540986
    },
    {
      phase: 'render',
      start: 4321997,
      duration: 1905528
    },
    {
      phase: 'paint',
      start: 6227525,
      duration: 33171
    }
  ]
};

const tbResultsFolder = COMPARE_JSON;
const scope = console;
const network = {
  offline: false,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0
};

const flags = {
  browserArgs: [''],
  cpuThrottleRate: 2,
  fidelity: 2,
  network,
  tbResultsFolder,
  controlURL: '',
  experimentURL: '',
  tracingLocationSearch: '',
  runtimeStats: false,
  debug: false,
  headless: false
};

const jsonResults = {
  areResultsSignificant: false,
  benchmarkTableData: [{}],
  isBelowRegressionThreshold: true,
  phaseTableData: [{}]
};

describe('log-compare-results', () => {
  test.stdout().it(`stdout`, async (ctx) => {
    const testResults = [
      {
        set: 'control',
        samples: [sampleTrace, sampleTrace, sampleTrace, sampleTrace]
      },
      {
        set: 'experiment',
        samples: [sampleTrace, sampleTrace, sampleTrace, sampleTrace]
      }
    ];
    // @ts-ignore
    const results = await logCompareResults(testResults, flags, scope);
    const resultsJSON: ICompareJSONResults = JSON.parse(results);
    expect(ctx.stdout).to.contain(`no difference`);
    expect(resultsJSON).to.have.all.keys(jsonResults);
  });
});

describe('anyResultsSignificant', () => {
  const fidelity = 20;
  const truthyArr = [true, true, false];
  const falsyArr = [false, false, false];
  it(`stat-sig results are significant`, () => {
    const isSigA = anyResultsSignificant(fidelity, truthyArr, falsyArr);
    const isSigB = anyResultsSignificant(fidelity, falsyArr, truthyArr);
    expect(isSigA).to.be.true;
    expect(isSigB).to.be.true;
  });
  it(`stat-sig results are not significant`, () => {
    const isNotSig = anyResultsSignificant(fidelity, falsyArr, falsyArr);
    expect(isNotSig).to.be.false;
  });
});

describe('allBelowRegressionThreshold', () => {
  const threshold = 100;
  const improvementDeltas = [100, 50, 200];
  const regressionDeltas = [-200, -300, -400];
  it(`is below regression threshold`, () => {
    const isBelowThreshold = allBelowRegressionThreshold(
      threshold,
      improvementDeltas,
      improvementDeltas
    );
    expect(isBelowThreshold).to.be.true;
  });
  it(`is above regression threshold`, () => {
    const isBelowThresholdA = allBelowRegressionThreshold(
      threshold,
      improvementDeltas,
      regressionDeltas
    );
    const isBelowThresholdB = allBelowRegressionThreshold(
      threshold,
      regressionDeltas,
      improvementDeltas
    );
    expect(isBelowThresholdA).to.be.false;
    expect(isBelowThresholdB).to.be.false;
  });
  it(`no regression threshold set`, () => {
    const isBelowThreshold = allBelowRegressionThreshold(
      undefined,
      improvementDeltas,
      regressionDeltas
    );
    expect(isBelowThreshold).to.be.true;
  });
});
