import { test } from '@oclif/test';
import { expect, assert } from 'chai';
import RecordHAR from '../../src/commands/record-har';
import { COOKIES, TB_RESULTS_FOLDER, URL } from '../test-helpers';

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
        expect(ctx.stdout).to.contain(`HAR recorded and available here:`);
        assert.exists(`${TB_RESULTS_FOLDER}/${FILENAME}.har`);
      }
    );
});
