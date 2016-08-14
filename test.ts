import { InitialRenderBenchmark, Runner } from "./index";
import build from "./test/build";

let versions = [
  "ember-2.6",
  "ember-2.7",
  "ember-beta",
  "ember-alpha"
];

let result = build(versions);

let browserOpts = process.env.CHROME_BIN ? {
  type: "exact",
  executablePath: process.env.CHROME_BIN
} : {
  type: "system"
};

let benchmarks = versions.map(version => {
  return new InitialRenderBenchmark({
    name: version,
    url: `file://${__dirname}/test/${version}/index.html?tracing`,
    markers: [
      { start: "domLoading",     label: "jquery" },
      { start: "jqueryLoaded",   label: "ember" },
      { start: "emberLoaded",    label: "application" },
      { start: "startRouting",   label: "routing" },
      { start: "willTransition", label: "transition" },
      { start: "didTransition",  label: "render" },
      { start: "renderEnd",      label: "afterRender" }
    ],
    browser: browserOpts
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
