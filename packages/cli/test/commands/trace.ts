import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const harFile = path.join(`${process.cwd()}/${tmpDir}/trace.har`);
const traceJSONOutput = path.join(`${process.cwd()}/${tmpDir}/trace.json`);
const url = 'https://www.tracerbench.com';
const cpuThrottleRate = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceJSONOutput ${traceJSONOutput} --cpuThrottleRate ${cpuThrottleRate}`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceJSONOutput',
          traceJSONOutput,
          '--cpuThrottleRate',
          cpuThrottleRate,
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(ctx.stdout).to.contain(`Subtotal`);
        chai.expect(traceJSONOutput).to.be.a.file();
      }
    );
});

describe('trace :: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceJSONOutput ${traceJSONOutput} --cpuThrottleRate ${cpuThrottleRate} --insights`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceJSONOutput',
          traceJSONOutput,
          '--cpuThrottleRate',
          cpuThrottleRate,
          '--insights',
        ]);
        chai.expect(ctx.stdout).to.contain(`.js`);
        chai.expect(ctx.stdout).to.contain(`.css`);
        chai.expect(ctx.stdout).to.contain(`Successfully listed method`);
      }
    );
});

describe('trace :: insightsFindFrame :: insightsListFrames', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceJSONOutput ${traceJSONOutput} --cpuThrottleRate ${cpuThrottleRate} --insights`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceJSONOutput',
          traceJSONOutput,
          '--cpuThrottleRate',
          cpuThrottleRate,
          '--insights',
          '--insightsFindFrame',
          '--insightsListFrames',
        ]);
        chai.expect(ctx.stdout).to.contain(`Frame-ID:`);
        chai.expect(ctx.stdout).to.contain(`Frame-URL:`);
      }
    );
});
