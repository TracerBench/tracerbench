import { test } from '@oclif/test';
import * as chai from 'chai';
import RecordHAR from '../../src/commands/record-har';
import { COOKIES, TB_RESULTS_FOLDER, URL } from '../test-helpers';

chai.use(require('chai-fs'));

const FILENAME = 'foo';

describe('record-har', () => {
  test
    .stdout()
    .it(
      `runs record-har --url ${URL} --dest ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES} --filename ${FILENAME}`,
      async ctx => {
        await RecordHAR.run([
          '--url',
          URL,
          '--dest',
          TB_RESULTS_FOLDER,
          '--cookiespath',
          COOKIES,
          '--filename',
          FILENAME,
        ]);
        chai.expect(ctx.stdout).to.contain(`HAR recorded and available here:`);
        chai.expect(`${TB_RESULTS_FOLDER}/${FILENAME}.har`).to.be.a.file();
      }
    );
});
