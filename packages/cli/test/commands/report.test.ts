import { test } from '@oclif/test';
import * as chai from 'chai';
import Compare from '../../src/commands/compare';
import Report from '../../src/commands/report';
import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';

chai.use(require('chai-fs'));

describe('report: creates html', () => {
  test
    .stdout()
    .it(
      `runs report --inputFilePath ${TB_RESULTS_FOLDER}/compare.json --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          FIXTURE_APP.control,
          '--experimentURL',
          FIXTURE_APP.regression,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--json',
          '--cpuThrottleRate=1',
        ]);

        await Report.run([
          '--tbResultsFolder',
          `${TB_RESULTS_FOLDER}`,
        ]);

        chai.expect(ctx.stdout).to.contain(`Written files out at`);
        chai.expect(`${TB_RESULTS_FOLDER}/artifact-1.html`).to.be.a.file();
        chai.expect(`${TB_RESULTS_FOLDER}/artifact-1.pdf`).to.be.a.file();
      }
    );
});
