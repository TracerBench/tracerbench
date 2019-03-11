import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';

chai.use(require('chai-fs'));

const indexFile = path.join(
  process.cwd() + '/test/fixtures/release/index.html'
);
const url = `file://${indexFile}?tracing`;

describe('compare', () => {
  test.stdout().it(`runs compare --url ${url}`, async ctx => {
    await Compare.run(['--url', url]);

    chai.expect(ctx.stdout).to.contain(`Success`);
  });
});
