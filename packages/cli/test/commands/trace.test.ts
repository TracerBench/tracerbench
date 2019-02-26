/* tslint:disable:no-console */

import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';

chai.use(require('chai-fs'));

const harFile = path.join(process.cwd() + '/test/www.tracerbench.com.har');
const url = 'https://www.tracerbench.com';
const traceFile = path.join(process.cwd() + '/test/trace.json');
const cpu = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceOutput ${traceFile} --cpu ${cpu}`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceOutput',
          traceFile,
          '--cpu',
          cpu
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(traceFile).to.be.a.file();
      }
    );
});
