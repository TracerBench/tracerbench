import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const control = path.join(process.cwd() + '/test/fixtures/release/index.html');
const experiment = path.join(
  process.cwd() + '/test/fixtures/experiment/index.html'
);
const experimentFixture = `file://${experiment}?tracing`;
const controlFixture = `file://${control}?tracing`;
const fidelity = 'test';
const output = path.join(`${process.cwd()}/${tmpDir}`);

describe('compare: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${controlFixture} --experimentURL ${controlFixture} --fidelity ${fidelity} --output ${output}`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          controlFixture,
          '--experimentURL',
          controlFixture,
          '--fidelity',
          fidelity,
          '--output',
          output
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare: fixture: A/B', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${controlFixture} --experimentURL ${experimentFixture} --fidelity ${fidelity} --output ${output}`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          controlFixture,
          '--experimentURL',
          experimentFixture,
          '--fidelity',
          fidelity,
          '--output',
          output
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
