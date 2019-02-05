import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import CSSParse from '../../src/commands/css-parse';

chai.use(require('chai-fs'));

const traceJSON = path.join(process.cwd() + '/test/trace.json');

describe('css-parse', () => {
  test.stdout().it(`runs css-parse --file ${traceJSON}`, async ctx => {
    await CSSParse.run(['--file', traceJSON]);
    chai.expect(ctx.stdout).to.contain(`.css`);
  });
});
