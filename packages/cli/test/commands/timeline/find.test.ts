import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Find from '../../../src/commands/timeline/find';

chai.use(require('chai-fs'));

const traceFile = path.join(process.cwd() + '/test/trace.json');
const url = 'https://www.tracerbench.com';

describe('timeline:find', () => {
  test
    .stdout()
    .it(`runs timeline:find --url ${url} --file ${traceFile}`, async ctx => {
      await Find.run(['--url', url, '--file', traceFile]);
      chai.expect(ctx.stdout).to.contain(`FRAME:`);
    });
});
