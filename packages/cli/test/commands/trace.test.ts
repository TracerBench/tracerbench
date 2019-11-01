import { test } from '@oclif/test';
import { expect } from 'chai';

import Trace from '../../src/commands/trace';
import {
  COOKIES,
  HAR_PATH,
  TB_RESULTS_FOLDER,
  URL,
  MARKER,
} from '../test-helpers';

describe('trace: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --harpath ${HAR_PATH} --cookiespath ${COOKIES} --marker ${MARKER}--insights`,
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
          '--marker',
          MARKER,
          '--insights',
        ]);
        expect(ctx.stdout).to.contain(`Trace`);
        expect(ctx.stdout).to.contain(`Subtotal`);
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(`Frame-URL:`);
        expect(ctx.stdout).to.contain(`Frame-ID:`);
      }
    );
});
