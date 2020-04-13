import { writeFileSync } from 'fs';
import { sync } from 'mkdirp';
import { resolve } from 'path';
import { InitialRenderBenchmark, Runner } from '@tracerbench/core';
import { Stdio } from '@tracerbench/spawn';

const globSync: (glob: string) => string[] = require('glob').sync;
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

const tests = globSync('dist/test/*/index.html');

// make dir test and results
sync('test/results');

const benchmarks: InitialRenderBenchmark[] = [];

tests.forEach((indexFile: string) => {
  const url = `file://${resolve(indexFile)}?tracing`;
  const match = /dist\/test\/([^\/]+)/.exec(indexFile);
  if (!match) {
    return;
  }
  const version = match[1];
  benchmarks.push(
    new InitialRenderBenchmark({
      browser: browserOpts,
      cpuThrottleRate: 4,
      delay: 100,
      markers: [
        { start: 'fetchStart', label: 'jquery' },
        { start: 'jqueryLoaded', label: 'ember' },
        { start: 'emberLoaded', label: 'application' },
        { start: 'startRouting', label: 'routing' },
        { start: 'willTransition', label: 'transition' },
        { start: 'didTransition', label: 'render' },
        { start: 'renderEnd', label: 'afterRender' }
      ],
      name: version,
      runtimeStats: true,
      saveTraces: (i: any) => `test/results/trace-${version}-${i}.json`,
      url
    })
  );
});

const runner = new Runner(benchmarks);

runner
  .run(4, (m) => {
    console.log(`${m}`);
  })
  .then((results: any) => {
    writeFileSync(
      'test/results/results.json',
      JSON.stringify(results, null, 2)
    );
  })
  .catch((err: any) => {
    console.error(err.stack);
    process.exit(1);
  });
