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
  const version = /dist\/test\/([^\/]+)/.exec(indexFile)[1];
  return new InitialRenderBenchmark({
    browser: browserOpts,
    delay: 1000,
    gcStats: true,
    markers: [
      { start: "navigationStart", label: "jquery" },
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
  console.log("set,ms");
  results.forEach((result) => {
    const set = result.set;
    result.samples.forEach((sample) => {
      console.log(set + "," + (sample.duration / 1000));
    });
  });
  console.log("set,phase,self_ms,cumulative_ms");
  results.forEach((result) => {
    const set = result.set;
    result.samples.forEach((sample) => {
      sample.phaseSamples.forEach((phaseSample) => {
        console.log(set + "," + phaseSample.phase + "," +
          (phaseSample.self / 1000) + "," + (phaseSample.cumulative / 1000));
      });
    });
  });
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
