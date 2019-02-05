import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import JSEvalTime from '../../src/commands/js-eval-time';

chai.use(require('chai-fs'));

const traceJSON = path.join(process.cwd() + '/test/trace.json');

describe('js-eval-time', () => {
  test.stdout().it(`runs js-eval-time --file ${traceJSON}`, async ctx => {
    await JSEvalTime.run(['--file', traceJSON]);
    chai.expect(ctx.stdout).to.contain(`.js`);
  });
});
