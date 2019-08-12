import { test } from '@oclif/test';
import * as chai from 'chai';
import Compare from '../../src/commands/compare';
import Report from '../../src/commands/report';
import { FIXTURE_APP, TB_RESULTS_FOLDER, TB_CONFIG_FILE } from '../test-helpers';

chai.use(require('chai-fs'));

const fidelity = 'test';

describe('report: creates html', () => {
  test
    .stdout()
    .it(
      `runs report --inputFilePath ${TB_RESULTS_FOLDER}/compare.json --tbResultsFolder ${TB_RESULTS_FOLDER} --headless --fidelity ${fidelity} --config ${TB_CONFIG_FILE} --json`,
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
          TB_CONFIG_FILE
        ]);

        await Report.run(['--tbResultsFolder', `${TB_RESULTS_FOLDER}`, '--config', `${TB_CONFIG_FILE}`]);

        chai.expect(ctx.stdout).to.contain(`The PDF and HTML reports are available here`);
        chai.expect(`${TB_RESULTS_FOLDER}/artifact-1.html`).to.be.a.file();
        chai.expect(`${TB_RESULTS_FOLDER}/artifact-1.pdf`).to.be.a.file();
      }
    );
});
