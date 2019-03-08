import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import ListFunctions from '../../src/commands/list-functions';

chai.use(require('chai-fs'));

const traceFile = path.join(process.cwd() + '/trace.json');

describe('list-functions', () => {
  test.stdout().it(`runs list-functions --file ${traceFile}`, async ctx => {
    await ListFunctions.run(['--file', traceFile]);
    chai.expect(ctx.stdout).to.contain(`Successfully listed method`);
  });
});
