import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Timings from '../../src/commands/timings';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const traceJSONOutput = path.join(`${process.cwd()}/${tmpDir}/trace.json`);
const url = 'https://www.tracerbench.com';

describe('timings', () => {
  test
    .stdout()
    .it(
      `runs timings --urlOrFrame ${url} --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await Timings.run([
          '--urlOrFrame',
          url,
          '--traceJSONOutput',
          traceJSONOutput,
        ]);
        chai.expect(ctx.stdout).to.contain(`Timings`);
      }
    );
});
