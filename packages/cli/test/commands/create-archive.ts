import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import CreateArchive from '../../src/commands/create-archive';
import { tmpDir } from '../setup';
chai.use(require('chai-fs'));

const url = 'https://www.tracerbench.com';
const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);

describe('create-archive', () => {
  test
    .stdout()
    .it(
      `runs create-archive --url ${url} --tbResultsFolder ${tbResultsFolder}`,
      async ctx => {
        await CreateArchive.run([
          '--url',
          url,
          '--tbResultsFolder',
          tbResultsFolder,
        ]);
        chai
          .expect(ctx.stdout)
          .to.contain(`HAR & cookies.json successfully generated`);
        chai.expect(`${tbResultsFolder}/trace.har`).to.be.a.file();
      }
    );
});
