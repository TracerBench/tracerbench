import { test } from '@oclif/test';
import { expect } from 'chai';
import MarkerTimings from '../../src/commands/marker-timings';
import { URL, TB_RESULTS_FOLDER } from '../test-helpers';

describe('marker-timings', () => {
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
