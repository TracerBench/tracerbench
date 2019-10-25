import { test } from '@oclif/test';
import { IArchive } from '@tracerbench/core';
import { expect, assert } from 'chai';
import { readJSONSync } from 'fs-extra';
import { join } from 'path';
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

        const harFile = join(TB_RESULTS_FOLDER, `${FILENAME}.har`);
        const harJSON: IArchive = readJSONSync(harFile);

        expect(ctx.stdout).to.contain(`HAR recorded and available here:`);
        expect(harJSON.log.entries.length).to.be.gt(1);
        expect(harJSON.log.entries[0].request.url).to.contain(`${URL}`);

        assert.exists(harFile);
        assert.equal(harJSON.log.creator.name, 'TracerBench');
        assert.equal(harJSON.log.entries[0].response.status, 200);
      }
    );
});
