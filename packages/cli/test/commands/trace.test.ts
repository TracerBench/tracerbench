/* tslint:disable:no-console */

import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Trace from '../../src/commands/trace';

chai.use(require('chai-fs'));

const harFile = 'trace.har';
const url = 'https://www.tracerbench.com';
const outputDir = 'testOutput';
const outputFile = path.join(outputDir, 'raw-traces', `trace-${0}.json`);
const cpuThrottleRate = '1';
const iterations = '1';

describe('trace', () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --traceJSONOutput ${outputDir} --cpuThrottleRate ${cpuThrottleRate} -iterations ${iterations}`,
      async ctx => {
        await Trace.run([
          '--url',
          url,
          '--har',
          harFile,
          '--traceJSONOutput',
          outputDir,
          '--cpuThrottleRate',
          cpuThrottleRate,
          '--iterations',
          iterations,
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(outputFile).to.be.a.file();
      }
    );
});
