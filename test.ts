import * as fs from "fs";
import { sync as globSync } from "glob";
import { resolve } from "path";
import { InitialRenderBenchmark, Runner } from "./index";

const browserOpts = process.env.CHROME_BIN ? {
  executablePath: process.env.CHROME_BIN,
  type: "exact",
} : {
  type: "system",
};

const tests = globSync("dist/test/*/index.html");

const benchmarks: InitialRenderBenchmark[] = tests.map((indexFile) => {
  const url = `file://${resolve(indexFile)}?tracing`;
  const match = /dist\/test\/([^\/]+)/.exec(indexFile);
  if (!match) {
    return;
  }
  const version = match[1];
  return new InitialRenderBenchmark({
    browser: browserOpts,
    delay: 1000,
    gcStats: true,
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
    saveFirstTrace: `trace-${version}.json`,
    url,
  });
});

const runner = new Runner(benchmarks);

/*tslint:disable:no-console*/
runner.run(10).then((results) => {
  fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
