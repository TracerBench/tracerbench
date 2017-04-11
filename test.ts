import { InitialRenderBenchmark, Runner } from "./index";
import { sync as globSync } from "glob";
import { resolve } from "path";

let browserOpts = process.env.CHROME_BIN ? {
  type: "exact",
  executablePath: process.env.CHROME_BIN
} : {
  type: "system"
};

let tests = globSync("dist/test/*/index.html");

let benchmarks: InitialRenderBenchmark[] = tests.map(indexFile => {
  let url = `file://${resolve(indexFile)}?tracing`;
  let version = /dist\/test\/([^\/]+)/.exec(indexFile)[1];
  return new InitialRenderBenchmark({
    name: version,
    url: url,
    markers: [
      { start: "domLoading",     label: "jquery" },
      { start: "jqueryLoaded",   label: "ember" },
      { start: "emberLoaded",    label: "application" },
      { start: "startRouting",   label: "routing" },
      { start: "willTransition", label: "transition" },
      { start: "didTransition",  label: "render" },
      { start: "renderEnd",      label: "afterRender" }
    ],
    gcStats: true,
    runtimeStats: true,
    browser: browserOpts,
    saveFirstTrace: `trace-${version}.json`
  });
});

let runner = new Runner(benchmarks);

runner.run(10).then((results) => {
  console.log("set,ms");
  results.forEach(result => {
    let set = result.set;
    result.samples.forEach(sample => {
      console.log(set + "," + (sample.duration / 1000));
    });
  });
  console.log("set,phase,self_ms,cumulative_ms");
  results.forEach(result => {
    let set = result.set;
    result.samples.forEach(sample => {
      sample.phaseSamples.forEach(phaseSample => {
        console.log(set + "," + phaseSample.phase + "," + (phaseSample.self / 1000) + "," + (phaseSample.cumulative / 1000));
      });
    });
  });
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
