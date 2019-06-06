import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';
import { tmpDir } from '../setup';
import { defaultFlagArgs } from '../../src/helpers/default-flag-args';

const fidelity = 'test';
const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);
const emulateDevice = 'iphone-4';
const regressionThreshold = '-100ms';

const app = {
  control: `file://${path.join(
    process.cwd() + '/test/fixtures/release/index.html'
  )}`,
  experiment: `file://${path.join(
    process.cwd() + '/test/fixtures/experiment/index.html'
  )}`,
  regression: `file://${path.join(
    process.cwd() + '/test/fixtures/regression/index.html'
  )}`,
};

describe('compare fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${app.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${app.control +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${tbResultsFolder} --cpuThrottleRate=1`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          app.control,
          '--experimentURL',
          app.control,
          '--fidelity',
          fidelity,
          '--tbResultsFolder',
          tbResultsFolder,
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
      `runs compare --controlURL ${app.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${app.regression +
        defaultFlagArgs.tracingLocationSearch} --fidelity=medium --tbResultsFolder ${tbResultsFolder} --regressionThreshold ${regressionThreshold} --cpuThrottleRate=1`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          app.control,
          '--experimentURL',
          app.regression,
          '--fidelity=medium',
          '--cpuThrottleRate=1',
          '--regressionThreshold',
          regressionThreshold,
          '--tbResultsFolder',
          tbResultsFolder,
          '--json',
        ]);

        chai
          .expect(ctx.stdout)
          .to.contain(`Statistically significant results were found`);
      }
    );
});

describe('compare mobile: fixture: A/A', () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${app.control +
        defaultFlagArgs.tracingLocationSearch} --experimentURL ${app.experiment +
        defaultFlagArgs.tracingLocationSearch} --fidelity ${fidelity} --tbResultsFolder ${tbResultsFolder} --emulateDevice ${emulateDevice} --cpuThrottleRate=6`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          app.control,
          '--experimentURL',
          app.experiment,
          '--fidelity',
          fidelity,
          '--tbResultsFolder',
          tbResultsFolder,
          '--emulateDevice',
          emulateDevice,
          '--cpuThrottleRate=6',
        ]);

        chai.expect(ctx.stdout).to.contain(`Success`);
      }
    );
});
