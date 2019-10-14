import { test } from '@oclif/test';
import { use, expect } from 'chai';
import Trace from '../../src/commands/trace';
import { COOKIES, TB_RESULTS_FOLDER, URL, HAR_PATH } from '../test-helpers';

const chaiFiles = require('chai-files');
use(chaiFiles);

const file = chaiFiles.file;

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --harpath ${HAR_PATH} --cookiespath ${COOKIES}`,
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
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${TB_RESULTS_FOLDER}/trace.json`)).to.exist;
      }
    );
});

describe('trace: insights', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --harpath ${HAR_PATH} --cookiespath ${COOKIES} --insights`,
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
          '--insights',
        ]);
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(`Frame-URL:`);
        expect(ctx.stdout).to.contain(`Frame-ID:`);
      }
    );
});
