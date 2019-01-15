import * as fs from "fs";
import * as mkdirp from "mkdirp";
import { resolve } from "path";
import { InitialRenderBenchmark, Runner } from "tracerbench";

/* tslint:disable:no-var-requires */
const globSync: (glob: string) => string[] = require("glob").sync;
/* tslint:enable:no-var-requires */

const browserOpts = {
  additionalArguments: [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--mute-audio",
    "--v8-cache-options=none",
    "--disable-cache",
    "--disable-v8-idle-tasks",
    "--crash-dumps-dir=./tmp"
  ]
};

const tests = globSync("dist/test/*/index.html");

mkdirp.sync("test/results");

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
        { start: "fetchStart", label: "jquery" },
        { start: "jqueryLoaded", label: "ember" },
        { start: "emberLoaded", label: "application" },
        { start: "startRouting", label: "routing" },
        { start: "willTransition", label: "transition" },
        { start: "didTransition", label: "render" },
        { start: "renderEnd", label: "afterRender" }
      ],
      name: version,
      runtimeStats: true,
      saveTraces: i => `test/results/trace-${version}-${i}.json`,
      url
    })
  );
});

const runner = new Runner(benchmarks);

/*tslint:disable:no-console*/
runner
  .run(20)
  .then(results => {
    fs.writeFileSync(
      "test/results/results.json",
      JSON.stringify(results, null, 2)
    );
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
