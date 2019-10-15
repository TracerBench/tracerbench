import { test } from '@oclif/test';
import { expect, use } from 'chai';
import Compare from '../../src/commands/compare';
import Report from '../../src/commands/report';
import {
  FIXTURE_APP,
  TB_RESULTS_FOLDER,
  TB_CONFIG_FILE,
} from '../test-helpers';
const chaiFiles = require('chai-files');
use(chaiFiles);

const fidelity = 'test';
const file = chaiFiles.file;

describe('report: creates html', () => {
  test
    .stdout()
    .it(
      `runs report --inputFilePath ${TB_RESULTS_FOLDER}/compare.json --tbResultsFolder ${TB_RESULTS_FOLDER} --headless --fidelity ${fidelity} --config ${TB_CONFIG_FILE}`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.regression,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--cpuThrottleRate=1',
          '--headless',
          '--fidelity',
          fidelity,
          '--config',
          TB_CONFIG_FILE,
        ]);

        await Report.run([
          '--tbResultsFolder',
          `${TB_RESULTS_FOLDER}`,
          '--config',
          `${TB_CONFIG_FILE}`,
        ]);

        expect(ctx.stdout).to.contain(
          `The PDF and HTML reports are available here`
        );
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/artifact-1.html`)).to.exist;
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/artifact-1.pdf`)).to.exist;
      }
    );
});
