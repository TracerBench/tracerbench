import { test } from '@oclif/test';
import { assert, expect } from 'chai';
import Trace from '../../src/commands/trace';
import { TB_RESULTS_FOLDER, URL } from '../test-helpers';

const cpuThrottleRate = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate ${cpuThrottleRate}`,
      async ctx => {
        await Trace.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--cpuThrottleRate',
          cpuThrottleRate,
        ]);
        expect(ctx.stdout).to.contain(`Trace`);
        expect(ctx.stdout).to.contain(`Subtotal`);
        assert.exists(`${TB_RESULTS_FOLDER}/trace.json`);
      }
    );
});

describe('trace: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate ${cpuThrottleRate} --insights`,
      async ctx => {
        await Trace.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
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
