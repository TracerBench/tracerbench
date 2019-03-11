import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Analyze from '../../src/commands/analyze';
import { ALL_MODULES_DIR, ANALYSIS_WRITE_MSG } from '../../../parse-profile/src/cli/constants';

chai.use(require('chai-fs'));

const harFile = path.join(process.cwd() + '/trace.har');
const traceJSONOutput = path.join(process.cwd() + '/trace.json');

describe('analyze', () => {
  test
    .stdout()
    .it(
      `runs analyze --har ${harFile} --traceJSONOutput ${traceJSONOutput}`,
      async ctx => {
        await Analyze.run([
          '--har',
          harFile,
          '--traceJSONOutput',
          traceJSONOutput
        ]);
        chai.expect(ctx.stdout).to.contain(ANALYSIS_WRITE_MSG);
        chai.expect(traceJSONOutput).to.be.a.file();
      }
    );
});
