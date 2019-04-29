import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import * as fs from 'fs-extra';
import CreateArchive from '../../src/commands/create-archive';
import { tmpDir } from '../setup';
chai.use(require('chai-fs'));

const tbConfig = JSON.parse(
  fs.readFileSync(`${process.cwd()}/test/tbconfig.json`, 'utf8')
);
const url = 'https://www.tracerbench.com';
const archiveOutput = path.join(`${process.cwd()}/${tmpDir}/trace.har`);
const tbConfigArchiveOutput = path.join(
  `${process.cwd()}/${tmpDir}/${tbConfig.archiveOutput}`
);

describe('create-archive', () => {
  test
    .stdout()
    .it(
      `runs create-archive --url ${url} --archiveOutput ${archiveOutput}`,
      async ctx => {
        await CreateArchive.run([
          '--url',
          url,
          '--archiveOutput',
          archiveOutput,
        ]);
        chai.expect(ctx.stdout).to.contain(`HAR successfully generated`);
        chai.expect(archiveOutput).to.be.a.file();
      }
    );
});

describe('create-archive with tb-config.json flags', () => {
  test
    .stdout()
    .it(
      `runs create-archive --url ${
        tbConfig.url
      } --archiveOutput ${tbConfigArchiveOutput}`,
      async ctx => {
        await CreateArchive.run([
          '--url',
          tbConfig.url,
          '--archiveOutput',
          tbConfigArchiveOutput,
        ]);
        chai.expect(ctx.stdout).to.contain(`HAR successfully generated`);
        chai.expect(tbConfigArchiveOutput).to.be.a.file();
      }
    );
});
