import * as fs from "fs";
import { resolve } from "path";
import { InitialRenderBenchmark, Runner } from "./index";

/* tslint:disable:no-var-requires */
const globSync: (glob: string) => string[] = require("glob").sync;
/* tslint:enable:no-var-requires */

const browserOpts = process.env.CHROME_BIN ? {
  executablePath: process.env.CHROME_BIN,
  type: "exact",
} : {
  type: "system",
};

const tests = globSync("dist/test/*/index.html");

const benchmarks: InitialRenderBenchmark[] = [];

tests.forEach((indexFile: string) => {
  const url = `file://${resolve(indexFile)}?tracing`;
  const match = /dist\/test\/([^\/]+)/.exec(indexFile);
  if (!match) {
    return;
  }
  const version = match[1];
  benchmarks.push(new InitialRenderBenchmark({
    browser: browserOpts,
    delay: 1000,
    markers: [
      { start: "fetchStart",      label: "jquery" },
      { start: "jqueryLoaded",    label: "ember" },
      { start: "emberLoaded",     label: "application" },
      { start: "startRouting",    label: "routing" },
      { start: "willTransition",  label: "transition" },
      { start: "didTransition",   label: "render" },
      { start: "renderEnd",       label: "afterRender" },
    ],
    name: version,
    runtimeStats: true,
    saveTraces: (i) => `trace-${version}-${i}.json`,
    url,
  }));
});

const runner = new Runner(benchmarks);

/*tslint:disable:no-console*/
runner.run(5).then((results) => {
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
