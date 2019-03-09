import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Find from '../../../src/commands/timeline/find';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(process.cwd() + '/trace.json');
const url = 'https://www.tracerbench.com';

describe('timeline:find', () => {
  test
    .stdout()
    .it(
      `runs timeline:find --url ${url} --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await Find.run(['--url', url, '--traceJSONOutput', traceJSONOutput]);
        chai.expect(ctx.stdout).to.contain(`FRAME:`);
      }
    );
});
