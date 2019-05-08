import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Timings from '../../src/commands/timings';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const tbResultsFile = path.join(`${process.cwd()}/${tmpDir}`);
const url = 'https://www.tracerbench.com';

describe('timings', () => {
  test
    .stdout()
    .it(
      `runs timings --url ${url} --tbResultsFile ${tbResultsFile}`,
      async ctx => {
        await Timings.run(['--url', url, '--tbResultsFile', tbResultsFile]);
        chai.expect(ctx.stdout).to.contain(`Timings`);
      }
    );
});
