import {
  logCompareResults,
  ICompareJSONResults,
  anyResultsSignificant,
  allBelowRegressionThreshold,
} from '../../src/helpers/log-compare-results';
import { expect } from 'chai';
import { tmpDir } from '../setup';
import { test } from '@oclif/test';

import { join } from 'path';

const sampleTrace = {
  duration: 6260696,
  js: 5310439,
  phases: [
    {
      phase: 'load',
      start: 0,
      duration: 1807839,
    },
    {
      phase: 'boot',
      start: 1807839,
      duration: 973172,
    },
    {
      phase: 'transition',
      start: 2781011,
      duration: 1540986,
    },
    {
      phase: 'render',
      start: 4321997,
      duration: 1905528,
    },
    {
      phase: 'paint',
      start: 6227525,
      duration: 33171,
    },
  ],
};

const tbResultsFolder = join(`${process.cwd()}/${tmpDir}/compare.json`);
const scope = console;
const network = {
  offline: false,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
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
  headless: false,
};

const jsonResults = {
  areResultsSignificant: false,
  benchmarkTableData: [{}],
  isBelowRegressionThreshold: true,
  phaseTableData: [{}],
};

describe('log-compare-results', () => {
  test.stdout().it(`stdout`, async ctx => {
    const testResults = [
      {
        set: 'control',
        samples: [sampleTrace, sampleTrace, sampleTrace, sampleTrace],
      },
      {
        set: 'experiment',
        samples: [sampleTrace, sampleTrace, sampleTrace, sampleTrace],
      },
    ];
    // @ts-ignore
    const results = await logCompareResults(testResults, flags, scope);
    const resultsJSON: ICompareJSONResults = JSON.parse(results);
    expect(ctx.stdout).to.contain(`has no difference`);
    expect(resultsJSON).to.have.all.keys(jsonResults);
  });
});

describe('anyResultsSignificant', () => {
  const fidelity = 20;
  const truthyArr = [true, true, false];
  const falsyArr = [false, false, false];
  it(`stat-sig results are significant`, () => {
    const isSig = anyResultsSignificant(fidelity, truthyArr, falsyArr);
    // tslint:disable-next-line: no-unused-expression
    expect(isSig).to.be.true;
  });
  it(`stat-sig results are not significant`, () => {
    const isSig = anyResultsSignificant(fidelity, falsyArr, falsyArr);
    // tslint:disable-next-line: no-unused-expression
    expect(isSig).to.be.false;
  });
});

describe('allBelowRegressionThreshold', () => {
  const improvementDeltas = [100, 50, 200];
  const regressionDeltas = [-200, -300, -400];
  it(`is below regression threshold`, () => {
    const isBelowThreshold = allBelowRegressionThreshold(
      -100,
      improvementDeltas,
      improvementDeltas
    );
    // tslint:disable-next-line: no-unused-expression
    expect(isBelowThreshold).to.be.true;
  });
  it(`is above regression threshold`, () => {
    const isBelowThreshold = allBelowRegressionThreshold(
      -100,
      improvementDeltas,
      regressionDeltas
    );
    // tslint:disable-next-line: no-unused-expression
    expect(isBelowThreshold).to.be.false;
  });
  it(`no regression threshold set`, () => {
    const isBelowThreshold = allBelowRegressionThreshold(
      undefined,
      improvementDeltas,
      regressionDeltas
    );
    // tslint:disable-next-line: no-unused-expression
    expect(isBelowThreshold).to.be.true;
  });
});
