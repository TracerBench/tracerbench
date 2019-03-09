/* tslint:disable:no-console */

import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import CreateArchive from '../../src/commands/create-archive';

chai.use(require('chai-fs'));

const url = 'https://www.tracerbench.com';
const archiveOutput = path.join(process.cwd() + '/trace.har');

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
          archiveOutput
        ]);
        chai.expect(ctx.stdout).to.contain(`HAR successfully generated`);
        chai.expect(archiveOutput).to.be.a.file();
      }
    );
});
