import { test } from '@oclif/test';
import * as chai from 'chai';
import * as path from 'path';
import MarkerTimings from '../../src/commands/marker-timings';
import { tmpDir } from '../setup';

chai.use(require('chai-fs'));

const tbResultsFile = path.join(`${process.cwd()}/${tmpDir}`);
const url = 'https://www.tracerbench.com';

describe('marker-timings', () => {
  test
    .stdout()
    .it(
      `runs marker-timings --url ${url} --tbResultsFile ${tbResultsFile}`,
      async ctx => {
        await MarkerTimings.run([
          '--url',
          url,
          '--tbResultsFile',
          tbResultsFile,
        ]);
        chai.expect(ctx.stdout).to.contain(`Marker Timings:`);
      }
    );
});
