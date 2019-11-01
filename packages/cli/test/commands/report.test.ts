import { test } from '@oclif/test';
import { expect, assert } from 'chai';
import { readJsonSync } from 'fs-extra';

import Report from '../../src/commands/report';
import {
  TB_CONFIG_FILE,
  TB_RESULTS_FOLDER,
  COMPARE_JSON,
  generateFileStructure,
} from '../test-helpers';

const COMPARE = {
  'compare.json': JSON.stringify(readJsonSync(COMPARE_JSON)),
};

describe('report: creates html', () => {
  generateFileStructure(COMPARE, TB_RESULTS_FOLDER);
  test
    .stdout()
    .it(
      `runs report --config ${TB_CONFIG_FILE} --tbResultsFolder ${TB_RESULTS_FOLDER} `,
      async ctx => {
        await Report.run([
          '--tbResultsFolder',
          `${TB_RESULTS_FOLDER}`,
          '--config',
          `${TB_CONFIG_FILE}`,
        ]);

        expect(ctx.stdout).to.contain(
          `The PDF and HTML reports are available here`
        );
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.html`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.pdf`);
      }
    );
});
