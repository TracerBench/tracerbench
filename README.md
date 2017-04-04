chrome-tracing
==============
[![Build Status](https://travis-ci.org/krisselden/chrome-tracing.svg?branch=master)](https://travis-ci.org/krisselden/chrome-tracing)

Chrome tracing allows you to automate Chrome benchmarking. It's goal is to provide a JavaScript variant of [Telemetry](https://www.chromium.org/developers/telemetry/run_locally).

## Basic Usage

The most basic benchmark is the `InitialRenderBenchmark`.

```js
import { InitialRenderBenchmark, Runner } from "chrome-tracing";

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
runner.run(50).then(result => {
  console.log(result);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
```

In the app you must place a marker to let Chrome Tracing know that you are done rendering. This is done by using a `performance.mark` function call.

```
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

In the example above we would mark right after we render the app and then call an `endTrace` function that ensures that we schedule a micro-task after paint that transitions to a blank page. Internally Chrome-Tracing will see this as the queue to start a new sample.

## Extending Benchmarks
TODO
