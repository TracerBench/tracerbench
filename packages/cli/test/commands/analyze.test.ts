import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Analyze from '../../src/commands/analyze';

chai.use(require('chai-fs'));

const archiveFile = path.join(process.cwd() + '/trace.har');
const traceFile = path.join(process.cwd() + '/trace.json');

describe('analyze', () => {
  test
    .stdout()
    .it(
      `runs analyze --archive ${archiveFile} --file ${traceFile}`,
      async ctx => {
        await Analyze.run(['--archive', archiveFile, '--file', traceFile]);
        chai.expect(ctx.stdout).to.contain(`Subtotal`);
      }
    );
});
