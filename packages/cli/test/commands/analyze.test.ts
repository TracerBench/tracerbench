import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Analyze from '../../src/commands/analyze';

chai.use(require('chai-fs'));

const archiveFile = path.join(process.cwd() + '/test/trace.archive');
const traceFile = path.join(process.cwd() + '/test/trace.json');

describe('analyze', () => {
  test
    .stdout()
    .it(`runs analyze -a ${archiveFile} -f ${traceFile}`, async ctx => {
      await Analyze.run(['-a', archiveFile, '-f', traceFile]);
      chai.expect(ctx.stdout).to.contain(`Analyze`);
    });
});
