import { test } from '@oclif/test';
import { expect } from 'chai';
import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import MarkerTimings from '../../src/commands/marker-timings';
import { TB_RESULTS_FOLDER, URL, generateFileStructure } from '../test-helpers';

const TRACE_JSON = {
  'trace.json': JSON.stringify(
    readJsonSync(join(process.cwd(), '/test/fixtures/results/trace.json'))
  ),
};

describe('marker-timings', () => {
  generateFileStructure(TRACE_JSON, TB_RESULTS_FOLDER);
  test
    .stdout()
    .it(
      `runs marker-timings --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async ctx => {
        await MarkerTimings.run([
          '--url',
          URL,
          '--tbResultsFolder',
          TB_RESULTS_FOLDER,
        ]);
        expect(ctx.stdout).to.contain(`Marker Timings:`);
      }
    );
});
