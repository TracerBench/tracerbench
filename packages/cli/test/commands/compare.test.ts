import { test } from '@oclif/test';
import { expect, assert } from 'chai';
import Compare from '../../src/commands/compare';
import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';
import { ICompareJSONResults } from '../../src/helpers/log-compare-results';

const fidelity = 'test';
const fidelityLow = '20';
const emulateDevice = 'iphone-4';
const regressionThreshold = '100';

describe('compare fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.control} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate=1 --config ${FIXTURE_APP.controlConfig} --headless --debug --report`,
      async ctx => {
        const results = await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.control,
          '--fidelity',
          fidelity,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--config',
          FIXTURE_APP.controlConfig,
          '--cpuThrottleRate=1',
          '--headless',
          '--debug',
          '--report',
        ]);

        const resultsJSON: ICompareJSONResults = JSON.parse(results);
        expect(ctx.stdout).to.contain(`Success`);
        expect(ctx.stdout).to.contain(`Benchmark Reports`);
        assert.exists(`${TB_RESULTS_FOLDER}/server-control-settings.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/server-experiment-settings.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/compare-flags-settings.json`);
        // results are json and NOT significant
        assert.isFalse(resultsJSON.areResultsSignificant);
        // regression is below the threshold
        assert.isTrue(resultsJSON.isBelowRegressionThreshold);
      }
    );
});

describe('compare regression: fixture: A/B', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.regression} --fidelity ${fidelityLow} --tbResultsFolder ${TB_RESULTS_FOLDER} --config ${FIXTURE_APP.regressionConfig} --regressionThreshold ${regressionThreshold} --cpuThrottleRate=1 --headless`,
      async ctx => {
        const results = await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.regression,
          '--fidelity',
          fidelityLow,
          '--cpuThrottleRate=1',
          '--regressionThreshold',
          regressionThreshold,
          '--config',
          FIXTURE_APP.regressionConfig,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--headless',
        ]);

        const resultsJSON: ICompareJSONResults = JSON.parse(results);
        expect(ctx.stdout).to.contain(
          `    Success!     ${fidelityLow} test samples were taken`
        );
        // confirm with headless flag is logging the trace stream
        expect(ctx.stdout).to.contain(
          `duration phase has an estimated difference of +`
        );
        expect(ctx.stdout).to.contain(`ember phase has no difference`);
        expect(ctx.stdout).to.contain(
          `    !! ALERT      Regression found exceeding the set regression threshold of ${regressionThreshold}ms`
        );
        // results are json and are significant
        assert.isTrue(resultsJSON.areResultsSignificant);
        // regression is over the threshold
        assert.isFalse(resultsJSON.isBelowRegressionThreshold);
      }
    );
});

describe('compare mobile horizontal: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.experiment} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation horizontal --cpuThrottleRate=6 --headless`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.experiment,
          '--fidelity',
          fidelity,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--emulateDevice',
          emulateDevice,
          '--emulateDeviceOrientation',
          'horizontal',
          '--cpuThrottleRate=6',
          '--headless',
        ]);

        expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
