import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const indexFile = path.join(
  process.cwd() + '/test/fixtures/release/index.html'
);
const fixture = `file://${indexFile}?tracing`;
const fidelity = 'test';
const output = path.join(`${process.cwd()}/${tmpDir}`);

describe('compare: fixture', () => {
  test
    .stdout()
    .it(
      `runs compare --url ${fixture} --fidelity ${fidelity} --output ${output}`,
      async ctx => {
        await Compare.run([
          '--url',
          fixture,
          '--fidelity',
          fidelity,
          '--output',
          output
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
