import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import List from '../../../src/commands/timeline/list';
import { tmpDir } from '../../setup';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(`${process.cwd()}/${tmpDir}/trace.json`);

describe('timeline:list', () => {
  test
    .stdout()
    .it(
      `runs timeline:list --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await List.run(['--traceJSONOutput', traceJSONOutput]);
        chai.expect(ctx.stdout).to.contain(`frame`);
      }
    );
});
