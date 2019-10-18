import { test } from '@oclif/test';
import { expect } from 'chai';
import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import Trace from '../../src/commands/trace';
import {
  COOKIES,
  HAR_PATH,
  TB_RESULTS_FOLDER,
  URL,
  generateFileStructure,
} from '../test-helpers';

const TRACE_JSON = {
  'trace.json': JSON.stringify(
    readJsonSync(join(process.cwd(), '/test/fixtures/results/trace.json'))
  ),
};

generateFileStructure(TRACE_JSON, TB_RESULTS_FOLDER);

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async ctx => {
        await Trace.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--harpath',
          HAR_PATH,
          '--cookiespath',
          COOKIES,
        ]);
        expect(ctx.stdout).to.contain(`Trace`);
        expect(ctx.stdout).to.contain(`Subtotal`);
      }
    );
});

describe('trace: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --insights`,
      async ctx => {
        await Trace.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
          '--insights',
        ]);
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(`Frame-URL:`);
        expect(ctx.stdout).to.contain(`Frame-ID:`);
      }
    );
});
