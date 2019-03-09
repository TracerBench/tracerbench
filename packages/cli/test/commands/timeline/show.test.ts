import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Show from '../../../src/commands/timeline/show';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(process.cwd() + '/trace.json');
const url = 'https://www.tracerbench.com';

describe('timeline:show', () => {
  test
    .stdout()
    .it(
      `runs timeline:show --urlOrFrame ${url} --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await Show.run([
          '--urlOrFrame',
          url,
          '--traceJSONOutput',
          traceJSONOutput
        ]);
        chai.expect(ctx.stdout).to.contain(`Timings`);
      }
    );
});
