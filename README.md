# TracerBench

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)

TracerBench is a benchmarking tool for benchmarking web applications by automating chrome traces then extracting a metric from them, while controlling that each sample is independent. In essence, it provides developers with a simple API that can run a site locally many times in both a control and experiment to then provide the necessary data for determining if a page load performance delta exists.

Motivation, one trace varies to much to detect regressions in small changes to an app unless the effect size is very large. Additionally, most statistical tests I know of assume sample independence which given caching like Chrome's v8 caching is quite difficult to meet.

It is similar to [Telemetry](https://github.com/catapult-project/catapult/blob/master/telemetry/docs/run_benchmarks_locally.md) which is used to benchmark chromium.

It is similar to [Lighthouse](https://github.com/GoogleChrome/lighthouse) which also automates tracing then extracting metrics. TracerBench is focused on getting a low variance for a metric across many samples versus getting a hard to replicate performance report. Lighthouse enables many disabled-by-default tracing categories and tracerbench can be run without any disabled-by-default and minimal impact on the application.

## Basic Usage

The most basic benchmark is the `InitialRenderBenchmark`.

```js
import { InitialRenderBenchmark, Runner } from "tracerbench";

let control = new InitialRenderBenchmark({
  name: "control",
  url: "http://localhost:8001/",
  endMarker: "renderEnd",
  browser: {
    type: "canary"
  }
});

let experiment = new InitialRenderBenchmark({
  name: "experiment",
  url: "http://localhost:8002/",
  endMarker: "renderEnd",
  browser: {
    type: "canary"
  }
});

let runner = new Runner([control, experiment]);
runner
  .run(50)
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

In the app you must place a marker to let TracerBench know that you are done rendering to DOM, it searches forward from this to find the next paint event. This is done by using a `performance.mark` function call.

```js
function endTrace() {
  // just before paint
  requestAnimationFrame(function () {
    // after paint
    requestAnimationFrame(function () {
      document.location.href = "about:blank";
    });
  });
}

renderMyApp();
performance.mark("renderEnd");
endTrace();
```

In the example above we would mark right after we render the app and then call an `endTrace` function that ensures that we schedule after paint that transitions to a blank page. Internally tracerbench will see this as the cue to start a new sample.
