import { test } from '@oclif/test';
import { use, expect } from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';
import { tmpDir } from '../setup';

const chaiFiles = require('chai-files');
use(chaiFiles);

const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);
const url = 'https://www.tracerbench.com';
const cpuThrottleRate = '1';
const file = chaiFiles.file;

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
        expect(ctx.stdout).to.contain(`Trace`);
        expect(ctx.stdout).to.contain(`Subtotal`);
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${tbResultsFolder}/trace.json`)).to.exist;
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
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(`Frame-URL:`);
        expect(ctx.stdout).to.contain(`Frame-ID:`);
      }
    );
});
