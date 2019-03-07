import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';

chai.use(require('chai-fs'));

const globSync: (glob: string) => string[] = require('globby').sync;
const releaseIndex = globSync(
  '../../../tracerbench/dist/test/release/index.html'
);

const url = `file://${path.resolve(releaseIndex[0])}?tracing`;

describe('compare', () => {
  test.stdout().it(`runs compare --url ${releaseIndex[0]}`, async ctx => {
    await Compare.run(['--url', releaseIndex[0]]);
    chai.expect(ctx.stdout).to.contain(`Success`);
  });
});

// INDEX FILE: dist/test/alpha/index.html
// URL: file:///Users/malynch/D/tracerbench/packages/tracerbench/dist/test/alpha/index.html?tracing
// MATCH: dist/test/alpha,alpha

// INDEX FILE: dist/test/beta/index.html
// URL: file:///Users/malynch/D/tracerbench/packages/tracerbench/dist/test/beta/index.html?tracing
// MATCH: dist/test/beta,beta

// INDEX FILE: dist/test/release/index.html
// URL: file:///Users/malynch/D/tracerbench/packages/tracerbench/dist/test/release/index.html?tracing
// MATCH: dist/test/release,release
