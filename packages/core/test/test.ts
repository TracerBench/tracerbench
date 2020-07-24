import { writeFileSync, existsSync } from 'fs';
import mkdirp = require('mkdirp');
import { resolve, dirname, join } from 'path';
import { pathToFileURL } from 'url';
import { createTraceNavigationBenchmark, run } from '@tracerbench/core';
import findUp = require('find-up');
import build from './build/index';
import type { ChromeSpawnOptions } from 'chrome-debugging-client';

const channels = ['alpha', 'beta', 'release'];
const browserOpts: Partial<ChromeSpawnOptions> = {
  headless: true,
  stdio: 'ignore'
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
      const start = Date.now();
      const results = await run(benchmarks, 4, (elasped, completed, remaining, group, iteration) => {
        if (completed > 0) {
          const average = elasped / completed;
          const remainingSecs = Math.round(remaining * average / 1000);
          console.log(
            "%s %s %s seconds remaining",
            group.padStart(15),
            iteration.toString().padStart(3),
            `about ${remainingSecs}`.padStart(10)
          );
        } else {
          console.log(
            "%s %s",
            group.padStart(15),
            iteration.toString().padStart(3)
          );
        }
      });
      console.log("completed in %d seconds", Math.round((Date.now() - start) / 1000 ));

      writeFileSync(
        join(resultDir, 'results.json'),
        JSON.stringify(results)
      );
    });
  });
});
