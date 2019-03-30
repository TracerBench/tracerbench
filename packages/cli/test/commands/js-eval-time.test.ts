import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import JSEvalTime from '../../src/commands/js-eval-time';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(`${process.cwd()}/${tmpDir}/trace.json`);

describe('js-eval-time', () => {
  test
    .stdout()
    .it(`runs js-eval-time --traceJSONOutput ${traceJSONOutput}`, async ctx => {
      await JSEvalTime.run(['--traceJSONOutput', traceJSONOutput]);
      chai.expect(ctx.stdout).to.contain(`.js`);
    });
});
