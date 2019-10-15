import { test } from '@oclif/test';
import { expect, use } from 'chai';
import Compare from '../../src/commands/compare';
import { defaultFlagArgs } from '../../src/command-config';
import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';
import { ICompareJSONResults } from '../../src/helpers/log-compare-results';
const chaiFiles = require('chai-files');
use(chaiFiles);

const fidelity = 'test';
const emulateDevice = 'iphone-4';
const regressionThreshold = '-100ms';
const file = chaiFiles.file;

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
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/server-control-settings.json`)).to
          .exist;
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/server-experiment-settings.json`)).to
          .exist;
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/compare-flags-settings.json`)).to
          .exist;
      }
    );
});

describe('compare regression with JSON out: fixture: A/B', () => {
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
        // confirm with headless flag is logging the trace stream
        expect(ctx.stdout).to.contain(`Finished 10`);
        // successful trace
        expect(ctx.stdout).to.contain(`Success!`);
        // results are json and are significant
        // tslint:disable-next-line: no-unused-expression
        expect(resultsJSON.areResultsSignificant).to.be.true;
        // regression is over the allowable threshold
        // tslint:disable-next-line: no-unused-expression
        expect(resultsJSON.isBelowRegressionThreshold).to.be.false;
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
