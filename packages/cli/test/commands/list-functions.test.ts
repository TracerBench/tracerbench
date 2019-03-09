import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import ListFunctions from '../../src/commands/list-functions';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(process.cwd() + '/trace.json');

describe('list-functions', () => {
  test
    .stdout()
    .it(
      `runs list-functions --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await ListFunctions.run(['--traceJSONOutput', traceJSONOutput]);
        chai.expect(ctx.stdout).to.contain(`Successfully listed method`);
      }
    );
});
