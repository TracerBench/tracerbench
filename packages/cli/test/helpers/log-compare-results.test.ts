import { logCompareResults } from '../../src/helpers/log-compare-results';
import { expect } from 'chai';
import { tmpDir } from '../setup';
import { test } from '@oclif/test';

import * as path from 'path';

const results = path.join(
  `${process.cwd()}/test/fixtures/results/compare.json`
);
const markers = [
  {
    start: 'domComplete',
    label: 'domComplete',
  },
];
const tbResultsFile = path.join(`${process.cwd()}/${tmpDir}`);
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
  markers,
  network,
  tbResultsFile,
  controlURL: '',
  experimentURL: '',
  tracingLocationSearch: '',
  runtimeStats: false,
  json: false,
  debug: false,
};

describe('log-compare-results', () => {
  test.stdout().it(`stdout`, ctx => {
    const json = logCompareResults(results, flags, scope);
    const pJSON = JSON.parse(json);
    expect(ctx.stdout).to.contain(`Success`);
    expect(pJSON.message).to.contain(`Success`);
  });
});
