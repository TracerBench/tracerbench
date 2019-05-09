import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import CreateArchive from '../../src/commands/create-archive';
import { tmpDir } from '../setup';
chai.use(require('chai-fs'));

const url = 'https://www.tracerbench.com';
const tbResultsFile = path.join(`${process.cwd()}/${tmpDir}`);

describe('create-archive', () => {
  test
    .stdout()
    .it(
      `runs create-archive --url ${url} --tbResultsFile ${tbResultsFile}`,
      async ctx => {
        await CreateArchive.run([
          '--url',
          url,
          '--tbResultsFile',
          tbResultsFile,
        ]);
        chai
          .expect(ctx.stdout)
          .to.contain(`HAR & cookies.json successfully generated`);
        chai.expect(`${tbResultsFile}/trace.har`).to.be.a.file();
      }
    );
});
