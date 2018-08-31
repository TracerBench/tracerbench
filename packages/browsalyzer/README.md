# browsalyzer

[![Build Status](https://travis-ci.org/devtrace/browsalyzer.svg?branch=master)](https://travis-ci.org/devtrace/browsalyzer)

Chrome tracing allows you to automate Chrome benchmarking. It's goal is to provide a JavaScript variant of [Telemetry](https://www.chromium.org/developers/telemetry/run_locally).

## Basic Usage

The most basic benchmark is the `InitialRenderBenchmark`.

```js
import { InitialRenderBenchmark, Runner } from "browsalyzer";

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

In the example above we would mark right after we render the app and then call an `endTrace` function that ensures that we schedule a micro-task after paint that transitions to a blank page. Internally browsalyzer will see this as the cue to start a new sample.

## Using Bin Scripts

### Prerequisites

These instructions assume Mac and using homebrew.

Install R
```sh
brew tap homebrew/science
brew install r
```

Run R
```sh
R
```

Then install R packages:
```R
install.packages("jsonlite")
install.packages("R6")
install.packages("ggplot2")
install.packages("tidyr")
install.packages("forcats")
install.packages("dplyr")
q()
```

Now you can use the linked commands to plot stats:

```sh
plot
report
runtime-stats
```
