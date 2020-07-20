import { writeFileSync, existsSync } from 'fs';
import mkdirp = require('mkdirp');
import { resolve, dirname, join } from 'path';
import { pathToFileURL } from 'url';
import { createTraceNavigationBenchmark, run } from '@tracerbench/core';
import { Stdio } from '@tracerbench/spawn';
import findUp = require('find-up');
import build from './build/index';

const channels = ['alpha', 'beta', 'release'];
const browserOpts = {
  additionalArguments: [
    '--crash-dumps-dir=./tmp',
    '--disable-background-timer-throttling',
    '--disable-dev-shm-usage',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--disable-breakpad',
    '--disable-notifications',
    '--disable-hang-monitor',
    '--safebrowsing-disable-auto-update',
    '--ignore-certificate-errors',
    '--v8-cache-options=none',
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--disable-logging',
    '--headless'
  ],
  stdio: 'inherit' as Stdio,
  chromeExecutable: undefined,
  userDataDir: undefined,
  userDataRoot: undefined,
  url: undefined,
  disableDefaultArguments: false
};

describe('Benchmark', function () {
  describe('smoke test', function () {
    this.timeout('10m');

    let resultDir!: string;
    let tests!: {
      name: string;
      url: string;
    }[];

    before(async () => {
      const packageJson = await findUp('package.json');
      if (packageJson === undefined) {
        throw new Error(`failed to find-up package.json from ${__dirname}`);
      }
      const packageRoot = dirname(packageJson);

      const needsBuild: string[] = [];

      tests = channels.map((name) => {
        const path = resolve(packageRoot, `dist/test/${name}/index.html`);
        if (!existsSync(path)) {
          needsBuild.push(name);
        }
        const url = pathToFileURL(path).toString();
        return { name, url };
      });

      await build(needsBuild, packageRoot);

      resultDir = resolve(packageRoot, 'test/results');

      mkdirp.sync(resultDir);
    });

    it('should work', async function () {
      const markers = [
        { start: 'fetchStart', label: 'jquery' },
        { start: 'jqueryLoaded', label: 'ember' },
        { start: 'emberLoaded', label: 'application' },
        { start: 'startRouting', label: 'routing' },
        { start: 'willTransition', label: 'transition' },
        { start: 'didTransition', label: 'render' },
        { start: 'renderEnd', label: 'afterRender' }
      ];
      const benchmarks = tests.map(
        ({ name, url }) =>
          createTraceNavigationBenchmark(name, url, markers, {
            spawnOptions: browserOpts,
            pageSetupOptions: {
              cpuThrottlingRate: 4,
            },
            traceOptions: {
              saveTraceAs: (group, i) => join(resultDir, `trace-${group}-${i}.json`)
            },
          })
      );
      const results = await run(benchmarks, 4, (elasped, completed, remaining, group, iteration) => {
        console.log("%o %o %o %o %o", elasped, completed, remaining, group, iteration);
      });

      writeFileSync(
        join(resultDir, 'results.json'),
        JSON.stringify(results, null, 2)
      );
    });
  });
});
