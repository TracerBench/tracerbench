import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';

chai.use(require('chai-fs'));

const indexFile = path.join(
  process.cwd() + '/test/fixtures/release/index.html'
);
const fixture = `file://${indexFile}?tracing`;
// const url = 'http://www.tracerbench.com/?tracing';
const fidelity = 'test';

describe('compare: fixture', () => {
  test
    .stdout()
    .it(`runs compare --url ${fixture} --fidelity ${fidelity}`, async ctx => {
      await Compare.run(['--url', fixture, '--fidelity', fidelity]);

      chai.expect(ctx.stdout).to.contain(`Success`);
    });
});

// describe('compare: url', () => {
//   test
//     .stdout()
//     .it(`runs compare --url ${url} --fidelity ${fidelity}`, async ctx => {
//       await Compare.run(['--url', url, '--fidelity', fidelity]);

//       chai.expect(ctx.stdout).to.contain(`Success`);
//     });
// });
