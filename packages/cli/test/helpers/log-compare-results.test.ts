import {
  logCompareResults,
  ICompareJSONResults,
} from '../../src/helpers/log-compare-results';
import { expect } from 'chai';
import { tmpDir } from '../setup';
import { test } from '@oclif/test';

import * as path from 'path';

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

const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}/compare.json`);
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
  test.stdout().it(`stdout`, ctx => {
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
    const results = logCompareResults(testResults, flags, scope);
    const resultsJSON: ICompareJSONResults = JSON.parse(results);
    expect(ctx.stdout).to.contain(`has no difference`);
    expect(resultsJSON).to.have.all.keys(jsonResults);
  });
});
