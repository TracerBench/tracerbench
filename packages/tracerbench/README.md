## TracerBench: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)

TracerBench: a web application benchmarking tool providing clear, usable insights for performance regressions with continuous integration hooks. This includes Response, Animation, Idle, and Load analysis, among others by automating chrome traces, controlling that each sample is independent and extracting metrics from them. TracerBench is focused on getting a low variance for a metric across many samples versus getting a hard to replicate performance report. At its core, TracerBench is framework agnostic, though it will have tight Ember.js integrations out-of-the-box.

# Motivation

There’s currently a gap in performance analysis tooling for web applications, especially for Ember Applications. Developers today struggle to quickly find and analyze performance regressions which would empower them to make quick, iterative changes within their local development environment. Regressions need to be automatically uncovered, propagated and reported with both regression size and actionable data that explains the problem to maximize value and usefulness for the developer.

A single trace varies far to much to detect regressions in small changes to an app unless the effect size is very large. Additionally, most statistical tests assume sample independence which given caching like Chrome's v8 caching is quite difficult to meet.

TracerBench has greatly inspired by the Chromium benchmark tool [Telemetry](https://github.com/catapult-project/catapult/blob/master/telemetry/docs/run_benchmarks_locally.md).

When comparing TracerBench to [Lighthouse](https://github.com/GoogleChrome/lighthouse). The primary difference is TracerBench is focused on getting a low variance for a metric across many samples versus getting a hard to replicate performance report. Lighthouse enables many "disabled-by-default" tracing categories while TracerBench can be instrumented without any "disabled-by-default" and with minimal impact on your application; as such TracerBench instrumentation can be "check-in" and left in your application without worry of negative performance impacts.

# CLI

The recommended way of consuming TracerBench is via the (TracerBench-CLI)[https://github.com/TracerBench/tracerbench/tree/master/packages/cli]

# Ambient Noise

When running a TracerBench recording command its exceptionally important to reduce ambient noise that could negatively impact the reliability of the test results. TL;DR don't just jump into leveraging TracerBench without first performing below.

### Mitigating Ambient Noise

As a general rule of thumb to "zero-out" your environment its recommended you close/exit:

- all running applications other than those strictly needed to run a test, (osx menu bar & dock)
- software updates, file syncing, browser-tabs, (osx spotlight)
- when manually running tests and _not_ using the default headless chrome. be sure to exit all browser extensions

### Testing Ambient Noise

Assuming the pre-req mitigations above are complete, to test the ambient noise of your environment you can run and measure a few A/A tests. For example the control against the control. The results of which should all be near identical with no significant result.

# CLI Workflow

Assuming the TracerBench-CLI is globally [installed](https://github.com/TracerBench/tracerbench/blob/master/packages/cli/README.md#usage) and you are leveraging the optional config file [tb-config](https://github.com/TracerBench/tracerbench/blob/master/packages/cli/README.md#optional-config).

### Basic Example of benchmarking for timings

1. Start by having TracerBench record a HAR:

```s
$ tracerbench create-archive --url http://localhost:8000
...

✔ DevTools listening on ws://<address>
✔ { timestamp: 241968.79908 }
✔ HAR successfully generated from http://localhost:8000 and available here: ./trace.har
✔ Cookies successfully generated and available here: ./cookies.json
```

2. Now have TracerBench record a Trace of that HAR:

```s
$ tracerbench trace --url http://localhost:8000 --har ./trace.har
...

✔ DevTools listening on ws://<address>
...
✔ starting trace
✔ navigating to http://localhost:8000
...
✔ stopping trace
✔ Trace JSON file successfully generated and available here: ./trace.json
```

3. Now that you have "trace.har" and "trace.json" files you can benchmark for the list of timings:

```s
$ tracerbench timeline:show --urlOrFrame http://localhost:8000
...

✔ Timings:       0.00 ms navigationStart
✔ Timings:       0.29 ms fetchStart
✔ Timings:      14.75 ms responseEnd
✔ Timings:      16.56 ms unloadEventStart
✔ Timings:      16.58 ms unloadEventEnd
✔ Timings:      16.91 ms domLoading
✔ Timings:      17.24 ms CommitLoad 14D19FA88C4BD379EA6C8D2BBEA9F939 http://localhost:8000/
✔ Timings:     362.58 ms domInteractive
✔ Timings:     362.64 ms domContentLoadedEventStart
✔ Timings:     363.22 ms domContentLoadedEventEnd
✔ Timings:     400.03 ms domComplete
✔ Timings:     400.06 ms loadEventStart
✔ Timings:     400.08 ms loadEventEnd
✔ Timings:     410.85 ms firstLayout
```

# Manual Workflow

### Instrument your web application

In your app you must place a marker to let TracerBench know that you are done rendering to the DOM, it searches forward from this to find the next paint event. This is done by using a `performance.mark` function call.

```js
function endTrace() {
  // just before paint
  requestAnimationFrame(() => {
    // after paint
    requestAnimationFrame(() => {
      document.location.href = 'about:blank';
    });
  });
}

renderMyApp();
performance.mark('renderEnd');
endTrace();
```

In the example above we would mark right after we render the app and then call an `endTrace` function that ensures that we schedule after paint that transitions to a blank page. Internally tracerbench will see this as the cue to start a new sample.

### Init Benchmark & Runner

The most common and recommended consumption of TracerBench is via the [TracerBench-CLI](https://github.com/TracerBench/tracerbench/tree/master/packages/cli). Optionally, TracerBench does however expose an API directly. The most basic consumption of this is via the `InitialRenderBenchmark` and `Runner` with the option to leverage[HAR-Remix](https://github.com/TracerBench/har-remix) to serve recorded HARs.

```js
import * as fs from 'fs-extra';
import { InitialRenderBenchmark, Runner } from 'tracerbench';

// the number of samples TracerBench will run. Higher sample count = more accurate. However the duration of the test will increase. The recommendation is somewhere between 30-60 samples.
const samplesCount = 40;
// the markers leveraged tuning your web application. additionally this assumes you have tuned your web application with the following marker "renderEnd" (see "Instrument your web application" above)
const markers = [{ start: 'renderEnd', label: 'renderEnd' }];
// the interface for optional chrome browser options is robust. typings available here: https://github.com/TracerBench/chrome-debugging-client/blob/ce0cdf3341fbbff2164a1d46bac16885d39deb15/lib/types.ts#L114-L128
const browser = {
  type: 'canary',
  additionalArguments: [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--mute-audio',
    '--v8-cache-options=none',
    '--disable-cache',
    '--disable-v8-idle-tasks',
    '--crash-dumps-dir=./tmp'
  ]
};
// name, url, markers and browser are all required options
const control = new InitialRenderBenchmark({
  // some name for your control app
  name: 'control',
  // serve your control tuned application locally or
  // via HAR Remix
  url: 'http://localhost:8001/',
  markers,
  browser,
  // location to save only the control trace to
  saveTraces: () => `./control-trace.json`
});

const experiment = new InitialRenderBenchmark({
  name: 'experiment',
  url: 'http://localhost:8002/',
  markers,
  browser,
  // location to save only the experiment trace to
  saveTraces: () => `./experiment-trace.json`
});

// the runner uses the config of each benchmark to test against
// the output of which
const runner = new Runner([control, experiment]);
runner
  .run(samplesCount)
  .then(results => {
    console.log(results);
    // optionally output the results using fs to a path of your choice
    // now its time for some statistical analysis (see "Statistical Analysis")
    fs.writeFileSync(`./trace-results.json`, JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
```

# Trace-Results

The typings for "trace-results.json" is as follows:

- [samples: IITerationSample](https://github.com/TracerBench/tracerbench/blob/0508e9867b8bb8624739e16f0e812211a8346cc1/packages/tracerbench/src/benchmarks/initial-render-metric.ts#L73-L106)
- [phases: IPhaseSample](https://github.com/TracerBench/tracerbench/blob/0508e9867b8bb8624739e16f0e812211a8346cc1/packages/tracerbench/src/benchmarks/initial-render-metric.ts#L126-L141)
- [gc: IV8GCSample](https://github.com/TracerBench/tracerbench/blob/0508e9867b8bb8624739e16f0e812211a8346cc1/packages/tracerbench/src/benchmarks/initial-render-metric.ts#L39-L46)
- [blinkGC: IBlinkGCSample](https://github.com/TracerBench/tracerbench/blob/0508e9867b8bb8624739e16f0e812211a8346cc1/packages/tracerbench/src/benchmarks/initial-render-metric.ts#L48-L51)
- [runtimeCallStats?: IRuntimeCallStats](https://github.com/TracerBench/tracerbench/blob/0508e9867b8bb8624739e16f0e812211a8346cc1/packages/tracerbench/src/benchmarks/initial-render-metric.ts#L53-L71)

```ts
[{
  "meta": {
    "browserVersion": string,
    "cpus": string[]
  },
  "samples": IITerationSample[{
    "duration": number,
    "js": number,
    "phases": IPhaseSample[],
    "gc": IV8GCSample[],
    "blinkGC": IBlinkGCSample[],
    "runtimeCallStats": IRuntimeCallStats
  }],
  "set": string
}]
```

# Statistical Analysis

Assuming you have the output results ("trace-results.json") from your TracerBench run, its time to perform statistical analysis on the [Trace-Results](#Trace-Results) JSON file.

TracerBench does not currently expose an API to manually handle stat-analysis, however an industry standard is leveraging [SciPy](http://www.numpy.org/).
