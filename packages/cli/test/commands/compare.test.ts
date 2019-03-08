import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';

chai.use(require('chai-fs'));

const url = `../../../tracerbench/dist/test/release/index.html?tracing`;

describe.skip('compare', () => {
  test.stdout().it(`runs compare --url ${url}`, async ctx => {
    await Compare.run(['--url', url]);

    // todo chai.expect the stdout to be something like this
    // (`alpha 1640333 µs || ${this.name} ${sample.duration} µs`);

    chai.expect(ctx.stdout).to.contain(`Success`);
  });
});
