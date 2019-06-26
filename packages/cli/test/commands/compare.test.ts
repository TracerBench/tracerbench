import { test } from '@oclif/test';
import * as chai from 'chai';
import Compare from '../../src/commands/compare';
import { defaultFlagArgs } from '../../src/helpers/default-flag-args';
import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';

const fidelity = 'test';
const emulateDevice = 'iphone-4';
const regressionThreshold = '-100ms';

describe('compare fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate=1`,
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
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare regression: fixture: A/B', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.regression +
        defaultFlagArgs.tracingLocationSearch} --fidelity=medium --tbResultsFolder ${TB_RESULTS_FOLDER} --regressionThreshold ${regressionThreshold} --cpuThrottleRate=1`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.regression,
          '--fidelity=medium',
          '--cpuThrottleRate=1',
          '--regressionThreshold',
          regressionThreshold,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--json',
        ]);

        chai.expect(ctx.stdout).to.contain(`that there IS sufficient`);
      }
    );
});

describe('compare mobile horizontal: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation horizontal --cpuThrottleRate=6`,
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
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare mobile vertical: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation vertical --cpuThrottleRate=6`,
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
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});

describe('compare mobile vertical: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${FIXTURE_APP.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation vertical --cpuThrottleRate=6`,
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
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
