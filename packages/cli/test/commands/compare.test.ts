import { test } from '@oclif/test';
import { expect } from 'chai';
import Compare from '../../src/commands/compare';
import { defaultFlagArgs } from '../../src/command-config';
import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';
import { ICompareJSONResults } from '../../src/helpers/log-compare-results';

const fidelity = 'test';
const emulateDevice = 'iphone-4';
const regressionThreshold = '-100ms';

describe('compare fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate=1 --headless --debug`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.control,
          '--fidelity',
          fidelity,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--cpuThrottleRate=1',
          '--headless',
          '--debug',
        ]);

        expect(ctx.stdout).to.contain(`Success`);
        expect(
          `${TB_RESULTS_FOLDER}/server-control-settings.json`
        ).to.be.a.file();
        expect(
          `${TB_RESULTS_FOLDER}/server-experiment-settings.json`
        ).to.be.a.file();
        expect(
          `${TB_RESULTS_FOLDER}/compare-flags-settings.json`
        ).to.be.a.file();
      }
    );
});

describe('compare regression: fixture: A/B', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.regression +
        defaultFlagArgs.tracingLocationSearch} --fidelity=low --tbResultsFolder ${TB_RESULTS_FOLDER} --regressionThreshold ${regressionThreshold} --cpuThrottleRate=1 --headless`,
      async ctx => {
        const results = await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.regression,
          '--fidelity=low',
          '--cpuThrottleRate=1',
          '--regressionThreshold',
          regressionThreshold,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--headless',
        ]);

        const resultsJSON: ICompareJSONResults = JSON.parse(results);

        expect(ctx.stdout).to.contain(
          `duration phase has an estimated difference of`
        );
        // tslint:disable-next-line: no-unused-expression
        expect(resultsJSON.areResultsSignificant).to.be.true;
      }
    );
});

describe('compare mobile horizontal: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation horizontal --cpuThrottleRate=6 --headless`,
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
          '--cpuThrottleRate=6',
          '--headless',
        ]);

        expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare mobile vertical: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation vertical --cpuThrottleRate=6 --headless`,
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
          '--cpuThrottleRate=6',
          '--headless',
        ]);

        expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare mobile vertical: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation vertical --cpuThrottleRate=6 --headless`,
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
          '--cpuThrottleRate=6',
          '--headless',
        ]);

        expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
