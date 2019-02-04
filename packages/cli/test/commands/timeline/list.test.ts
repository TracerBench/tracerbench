import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import List from '../../../src/commands/timeline/list';

chai.use(require('chai-fs'));

const traceFile = path.join(process.cwd() + '/test/trace.json');

describe('timeline:list', () => {
  test.stdout().it(`runs timeline:list -f ${traceFile}`, async ctx => {
    await List.run(['-f', traceFile]);
    chai.expect(ctx.stdout).to.contain(`frame`);
  });
});
