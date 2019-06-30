import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);
const url = 'https://www.tracerbench.com';
const cpuThrottleRate = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --tbResultsFolder ${tbResultsFolder} --cpuThrottleRate ${cpuThrottleRate}`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--tbResultsFolder',
          tbResultsFolder,
          '--cpuThrottleRate',
          cpuThrottleRate,
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(ctx.stdout).to.contain(`Subtotal`);
        chai.expect(`${tbResultsFolder}/trace.json`).to.be.a.file();
      }
    );
});

describe('trace: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --tbResultsFolder ${tbResultsFolder} --cpuThrottleRate ${cpuThrottleRate} --insights`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--tbResultsFolder',
          tbResultsFolder,
          '--cpuThrottleRate',
          cpuThrottleRate,
          '--insights',
        ]);
        chai.expect(ctx.stdout).to.contain(`.js`);
        chai.expect(ctx.stdout).to.contain(`.css`);
        chai.expect(ctx.stdout).to.contain(`Frame-URL:`);
        chai.expect(ctx.stdout).to.contain(`Frame-ID:`);
      }
    );
});
