import { test } from '@oclif/test';
import { expect, use } from 'chai';
import * as path from 'path';
import CreateArchive from '../../src/commands/create-archive';
import { tmpDir } from '../setup';

const chaiFiles = require('chai-files');
use(chaiFiles);

const url = 'https://www.tracerbench.com';
const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);
const file = chaiFiles.file;

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
        expect(ctx.stdout).to.contain(
          `HAR & cookies.json successfully generated`
        );
        // tslint:disable-next-line: no-unused-expression
        expect(file(`${tbResultsFolder}/trace.har`)).to.exist;
      }
    );
});
