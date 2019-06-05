import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import Compare from '../../src/commands/compare';
import Report from '../../src/commands/report';
import { tmpDir } from '../setup';

const tbResultsFolder = path.join(`${process.cwd()}/${tmpDir}`);

const app = {
  control: `file://${path.join(
    process.cwd() + '/test/fixtures/release/index.html'
  )}`,
  regression: `file://${path.join(
    process.cwd() + '/test/fixtures/regression/index.html'
  )}`,
};


describe('create-output-artifact: creates html', () => {
  test
    .stdout()
    .it(
      `runs create-output-artifact --inputFilePath ${tbResultsFolder}`,
      async ctx => {

        // First generate the compare.json by running the compare function
        await Compare.run([
          '--controlURL',
          app.control,
          '--experimentURL',
          app.regression,
          '--tbResultsFolder',
          tbResultsFolder,
          '--json',
        ]);

        await Report.run([
          '--inputFilePath',
          tbResultsFolder
        ]);

        chai.expect(ctx.stdout).to.contain(`Written files out at `);
      },
    );
});