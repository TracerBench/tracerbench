import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import CSSParse from '../../src/commands/css-parse';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(`${process.cwd()}/${tmpDir}/trace.json`);

describe('css-parse', () => {
  test
    .stdout()
    .it(`runs css-parse --traceJSONOutput ${traceJSONOutput}`, async ctx => {
      await CSSParse.run(['--traceJSONOutput', traceJSONOutput]);
      chai.expect(ctx.stdout).to.contain(`.css`);
    });
});
