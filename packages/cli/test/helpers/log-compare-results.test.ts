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
const fidelity = 2;
const output = path.join(`${process.cwd()}/${tmpDir}`);
const scope = console;

describe('log-compare-results', () => {
  test.stdout().it(`stdout`, ctx => {
    logCompareResults(results, markers, fidelity, output, scope, false);

    expect(ctx.stdout).to.contain(`Success`);
  });

  it(`json`, () => {
    const l = logCompareResults(
      results,
      markers,
      fidelity,
      output,
      scope,
      true
    ) as any;
    expect(l.message).to.contain('Success!');
  });
});
