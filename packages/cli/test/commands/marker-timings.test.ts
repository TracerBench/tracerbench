import { test } from '@oclif/test';
import { expect } from 'chai';
import { readJsonSync } from 'fs-extra';
import { join } from 'path';

import MarkerTimings from '../../src/commands/marker-timings';
import { TB_RESULTS_FOLDER, URL, generateFileStructure } from '../test-helpers';

const TRACE_JSON = {
  'trace.json': JSON.stringify(
    readJsonSync(join(process.cwd(), '/test/fixtures/results/mock-trace.json'))
  ),
};

describe('marker-timings', () => {
  generateFileStructure(TRACE_JSON, TB_RESULTS_FOLDER);
  const TRACE_PATH = join(TB_RESULTS_FOLDER, 'trace.json');
  test
    .stdout()
    .it(
      `runs marker-timings --url ${URL} --tracepath ${TRACE_PATH}`,
      async ctx => {
        await MarkerTimings.run(['--url', URL, '--tracepath', TRACE_PATH]);
        expect(ctx.stdout).to.contain(`navigationStart`);
        expect(ctx.stdout).to.contain(`fetchStart`);
        expect(ctx.stdout).to.contain(`responseEnd`);
        expect(ctx.stdout).to.contain(`domLoading`);
        expect(ctx.stdout).to.contain(`firstLayout`);
        expect(ctx.stdout).to.contain(`domInteractive`);
        expect(ctx.stdout).to.contain(`domContentLoadedEventStart`);
        expect(ctx.stdout).to.contain(`domContentLoadedEventEnd`);
        expect(ctx.stdout).to.contain(`domComplete`);
        expect(ctx.stdout).to.contain(`loadEventStart`);
        expect(ctx.stdout).to.contain(`loadEventEnd`);
        expect(ctx.stdout).to.contain(
          `CommitLoad E995042AF2BB98205CA33613EACE4456 https://www.tracerbench.com/`
        );
      }
    );
});
