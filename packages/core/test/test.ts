import { writeFileSync, existsSync } from 'fs';
import mkdirp = require('mkdirp');
import { resolve, dirname, join } from 'path';
import { createTraceNavigationBenchmark, run } from '@tracerbench/core';
import { Marker } from '@tracerbench/core';
import findUp = require('find-up');
import build from './build/index';
import * as execa from 'execa';
import type { ChromeSpawnOptions } from 'chrome-debugging-client';

const channels = ['alpha', 'beta', 'release'];
const browserOpts: Partial<ChromeSpawnOptions> = {
  headless: true,
  stdio: 'ignore',
};

const [ NODE_PATH ] = process.argv;
let packageRoot: string;
describe('Benchmark', function () {
  describe('smoke test', function () {
    this.timeout('10m');

    let resultDir!: string;
    let tests!: {
      name: string;
      url: string;
    }[];
    this.beforeEach(async () => {
      const packageJson = await findUp('package.json');
      if (packageJson === undefined) {
        throw new Error(`failed to find-up package.json from ${__dirname}`);
      }
      packageRoot = dirname(packageJson);

      const needsBuild: string[] = [];
      const port = 3000;
      const BASE_URL = `http://localhost:${port}/`;
      tests = channels.map((name) => {
        const path = resolve(packageRoot, `dist/test/${name}/index.html`);
        if (!existsSync(path)) {
          needsBuild.push(name);
        }
        const url = `${BASE_URL}${name}/index.html`;
        return { name, url };
      });

      const staticAssetFolder: string = resolve(packageRoot, 'dist/test');
      await build(needsBuild, packageRoot);
      const serverPath = resolve(packageRoot, 'dist/test/test-server');
      const serverArgs = [
        serverPath,
        '--port',
        '3000',
        '--staticAssetFolder',
        staticAssetFolder,
        '&'
      ];

      try {
        await execa(NODE_PATH, serverArgs, { shell: true, stdio: "ignore"});
        console.log(`Ready to serve test pages at http://localhost:${port}`);
      } catch(err) {
        if (err && err instanceof Error) {
          console.warn(`Failed to start test server ${err.message}`);
        }
      }

      resultDir = resolve(packageRoot, 'test/results');

      mkdirp.sync(resultDir);
    });

    this.afterEach(async() => {
      try {
        await execa(resolve(packageRoot, './test/killTestServer.sh'), {
          shell:true
        });
        console.log('Stopped test server');
      } catch(err) {
        if (err && err instanceof Error) {
          console.warn(`Failed to terminate test server, need to stop it manually. ${err.message}`);
        }
      }
    });

    it('should work when last marker triggers a paint event', async function () {
      const markers = [
        { start: 'fetchStart', label: 'jquery' },
        { start: 'jqueryLoaded', label: 'ember' },
        { start: 'emberLoaded', label: 'application' },
        { start: 'startRouting', label: 'routing' },
        { start: 'willTransition', label: 'transition' },
        { start: 'didTransition', label: 'render' },
        { start: 'renderEnd', label: 'afterRender' }
      ];
      const benchmarks = tests.map(({ name, url }) =>
        createTraceNavigationBenchmark(name, url, markers, {
          spawnOptions: browserOpts,
          pageSetupOptions: {},
          traceOptions: {
            saveTraceAs: (group, i) =>
              join(resultDir, `trace-${group}-${i}.json`)
          }
        })
      );
      const start = Date.now();
      const results = await run(
        benchmarks,
        4,
        (elasped, completed, remaining, group, iteration) => {
          if (completed > 0) {
            const average = elasped / completed;
            const remainingSecs = Math.round((remaining * average) / 1000);
            console.log(
              '%s %s %s seconds remaining',
              group.padStart(15),
              iteration.toString().padStart(3),
              `about ${remainingSecs}`.padStart(10)
            );
          } else {
            console.log(
              '%s %s',
              group.padStart(15),
              iteration.toString().padStart(3)
            );
          }
        }
      );
      console.log(
        'completed in %d seconds',
        Math.round((Date.now() - start) / 1000)
      );

      writeFileSync(join(resultDir, 'results.json'), JSON.stringify(results));
    });

    it('should end trace at LCP if in markers list', async function () {
      //no need to add markers in render phase, we can still extract paint event
      const markers = [
        { start: 'fetchStart', label: 'jquery' },
        { start: 'jqueryLoaded', label: 'ember' },
        { start: 'emberLoaded', label: 'application' },
        { start: 'startRouting', label: 'routing' },
        { start: 'willTransition', label: 'transition' },
        { start: 'largestContentfulPaint::Candidate', label: 'paint' },
      ];
      const benchmarks = tests.map(({ name, url }) =>
        createTraceNavigationBenchmark(name, url, markers, {
          spawnOptions: browserOpts,
          pageSetupOptions: {},
          traceOptions: {
            saveTraceAs: (group, i) =>
              join(resultDir, `trace-${group}-${i}.json`),
          }
        })
      );
      const start = Date.now();
      const results = await run(
        benchmarks,
        4,
        (elasped, completed, remaining, group, iteration) => {
          if (completed > 0) {
            const average = elasped / completed;
            const remainingSecs = Math.round((remaining * average) / 1000);
            console.log(
              '%s %s %s seconds remaining',
              group.padStart(15),
              iteration.toString().padStart(3),
              `about ${remainingSecs}`.padStart(10)
            );
          } else {
            console.log(
              '%s %s',
              group.padStart(15),
              iteration.toString().padStart(3)
            );
          }
        }
      );
      console.log(
        'completed in %d seconds',
        Math.round((Date.now() - start) / 1000)
      );

      writeFileSync(join(resultDir, 'results.json'), JSON.stringify(results));
    });

    it('should end trace at LCP by default if no markers configured', async function () {
      //no need to add markers in render phase, we can still extract paint event
      const markers: Marker[] = [];
      const benchmarks = tests.map(({ name, url }) =>
        createTraceNavigationBenchmark(name, url, markers, {
          spawnOptions: browserOpts,
          pageSetupOptions: {},
          traceOptions: {
            saveTraceAs: (group, i) =>
              join(resultDir, `trace-${group}-${i}.json`),
          }
        })
      );
      const start = Date.now();
      const results = await run(
        benchmarks,
        4,
        (elasped, completed, remaining, group, iteration) => {
          if (completed > 0) {
            const average = elasped / completed;
            const remainingSecs = Math.round((remaining * average) / 1000);
            console.log(
              '%s %s %s seconds remaining',
              group.padStart(15),
              iteration.toString().padStart(3),
              `about ${remainingSecs}`.padStart(10)
            );
          } else {
            console.log(
              '%s %s',
              group.padStart(15),
              iteration.toString().padStart(3)
            );
          }
        }
      );
      console.log(
        'completed in %d seconds',
        Math.round((Date.now() - start) / 1000)
      );

      writeFileSync(join(resultDir, 'results.json'), JSON.stringify(results));
    });
  });
});
