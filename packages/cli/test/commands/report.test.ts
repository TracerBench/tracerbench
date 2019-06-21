import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';
import Report from '../../src/commands/report';
import { tmpDir } from '../setup';
chai.use(require('chai-fs'));

const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);

const app = {
  control: `file://${path.join(
    process.cwd() + '/test/fixtures/release/index.html'
  )}`,
  regression: `file://${path.join(
    process.cwd() + '/test/fixtures/regression/index.html'
  )}`,
};

describe('report: creates html', () => {
  test
    .stdout()
    .it(
      `runs report --inputFilePath ${tbResultsFolder}/compare.json --tbResultsFolder ${tbResultsFolder}`,
      async ctx => {
        await Compare.run([
          '--controlURL',
          app.control,
          '--experimentURL',
          app.regression,
          '--tbResultsFolder',
          tbResultsFolder,
          '--json',
          '--cpuThrottleRate=1',
        ]);

        await Report.run([
          '--inputFilePath',
          `${tbResultsFolder}/compare.json`,
          '--tbResultsFolder',
          `${tbResultsFolder}`,
        ]);

        chai.expect(ctx.stdout).to.contain(`Written files out at`);
        chai.expect(`${tbResultsFolder}/artifact-1.html`).to.be.a.file();
        chai.expect(`${tbResultsFolder}/artifact-1.pdf`).to.be.a.file();
      }
    );
});
