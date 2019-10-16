import { test } from '@oclif/test';
import { expect, assert } from 'chai';
import CreateArchive from '../../src/commands/create-archive';
import { URL, TB_RESULTS_FOLDER } from '../test-helpers';

describe('create-archive', () => {
  test
    .stdout()
    .it(
      `runs create-archive --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async ctx => {
        await CreateArchive.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
        ]);
        expect(ctx.stdout).to.contain(
          `HAR & cookies.json successfully generated`
        );
        assert.exists(`${TB_RESULTS_FOLDER}/trace.har`);
      }
    );
});
