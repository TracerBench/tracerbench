/* tslint:disable:no-console */

import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';

chai.use(require('chai-fs'));

const harFile = path.join(process.cwd() + '/trace.har');
const url = 'https://www.tracerbench.com';
const traceFile = path.join(process.cwd() + '/trace.json');
const cpuThrottleRate = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceOutput ${traceFile} --cpuThrottleRate ${cpuThrottleRate}`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceOutput',
          traceFile,
          '--cpuThrottleRate',
          cpuThrottleRate
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(traceFile).to.be.a.file();
      }
    );
});
