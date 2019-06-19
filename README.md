# TracerBench: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)

TracerBench is a web application benchmarking tool for providing clear, actionable and usable insights into performance regressions. By extracting metrics around Response, Animation, Idle, and Load through automated chrome traces and controlling that each of our samples is independent, TracerBench is able to provide low variance and reproducable performance data.

# Motivation

There’s currently a gap in performance analysis tooling for web applications, especially for Ember Applications. Developers today struggle to quickly find and analyze performance regressions which would empower them to make quick, iterative changes within their local development environment. Regressions need to be automatically uncovered, propagated and reported with both regression size and actionable data that explains the problem to maximize value and usefulness for the developer.

A single trace varies far too much to detect regressions in small changes to an app unless the effect size is very large. Additionally, most statistical tests assume sample independence which given caching like Chrome's v8 caching is quite difficult to meet.

TracerBench has been greatly inspired by the Chromium benchmark tool [Telemetry](https://github.com/catapult-project/catapult/blob/master/telemetry/docs/run_benchmarks_locally.md).

When comparing TracerBench to [Lighthouse](https://github.com/GoogleChrome/lighthouse). The primary difference is TracerBench is focused on getting a low variance for a metric across many samples versus getting a hard to replicate performance report. Lighthouse enables many "disabled-by-default" tracing categories while TracerBench can be instrumented without any "disabled-by-default" and with minimal impact on your application; as such TracerBench instrumentation can be "check-in" and left in your application without worry of negative performance impacts.

# User-Stories

[Chris Garrett](https://github.com/pzuraq) leveraged TracerBench in some of his recent Ember.js work on including native accessor functions in "classic" JS classes.

> "This [TracerBench Stats Test](https://github.com/TracerBench/tracerbench/raw/master/docs/native-accessor-fn.pdf) showed us with some confidence that the changes we were making to add a new feature in Ember wouldn't cause significant regressions in existing applications. We knew that the new feature would require some amount of work on the critical path for class instantiation, and thus for application boot, so having a way to measure the overall impact was invaluable. Without this kind of test, microbenchmarks would only have given us context as to how much more or less this piece of work was in isolation, and we wouldn't have been able to know if cumulatively running the new code would have a measurable impact on end users." -- [Chris Garrett](https://github.com/pzuraq) / Ember.js Core Team Member

---

# Ambient Noise

When running a TracerBench recording command its exceptionally important to reduce ambient noise that could negatively impact the reliability of the test results. TL;DR don't just jump into leveraging TracerBench without first performing [Mitigating Ambient Noise](https://github.com/TracerBench/tracerbench/blob/master/NOISE_MITIGATION.md)

### Testing Ambient Noise

Assuming the pre-req mitigations above are complete, to test the ambient noise of your environment you can run and measure a few A/A tests. For example the control against the control. The results of which should all be near identical with no significant result and low variance.

---

# CLI

The recommended way of consuming TracerBench is via the [TracerBench-CLI](https://github.com/TracerBench/tracerbench/tree/master/packages/cli)

# CLI Workflow

Assuming the TracerBench-CLI is globally [installed](https://github.com/TracerBench/tracerbench/blob/master/packages/cli/README.md#usage) and you are leveraging the optional config file [tb-config](https://github.com/TracerBench/tracerbench/blob/master/packages/cli/README.md#optional-config).

### Basic Example of benchmarking for timings

1. Start by having TracerBench record a HAR:

```console
$ tracerbench create-archive --url http://localhost:8000
...

✔ DevTools listening on ws://<address>
✔ { timestamp: 241968.79908 }
✔ HAR successfully generated from http://localhost:8000 and available here: ./trace.har
✔ Cookies successfully generated and available here: ./cookies.json
```

2. Now have TracerBench record a Trace of that HAR:

```console
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

```console
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

# TracerBench Compare: Manual Workflow

### Instrument your web application

In your app you must place a marker to let TracerBench know that you are done rendering to the DOM, it searches forward from this to find the next paint event. This is done by using a `performance.mark` function call. Additionally the [properties](https://raw.githubusercontent.com/TracerBench/tracerbench/master/docs/nav-timings.png) of the [NavigationTiming API](https://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface) can be passed a `markers` arguments array to the `InitialRenderBenchmark`.

![Understanding-NavTiming-API](https://github.com/TracerBench/tracerbench/blob/master/docs/nav-timings.png)

```js
function renderMyApp() {
  // basic "web application"
  // literally an app with a single empty p tag
  const p = document.createElement("p");
  document.body.appendChild(p);
}

function endTrace() {
  // just before paint
  requestAnimationFrame(() => {
    // after paint
    requestAnimationFrame(() => {
      document.location.href = 'about:blank';
    });
  });
}

// render the app
renderMyApp();

// marker renderEnd
performance.mark('renderEnd');

// end trace and transition to blank page
// internally cue tracerbench for another sample
endTrace();
```

In the example above we would mark right after we render the app and then call an `endTrace` function that ensures that we schedule after paint that transitions to a blank page. Internally tracerbench will see this as the cue to start a new sample.

### Init Benchmark & Runner

The most common and recommended consumption of TracerBench is via the [TracerBench-CLI](https://github.com/TracerBench/tracerbench/tree/master/packages/cli). Optionally, TracerBench does however expose an API directly. The most basic consumption of this is via the `InitialRenderBenchmark` and `Runner` with the option to leverage [HAR-Remix](https://github.com/TracerBench/har-remix) to serve recorded HARs.

```js
import * as fs from 'fs-extra';
import { InitialRenderBenchmark, Runner } from 'tracerbench';

// the number of samples TracerBench will run. Higher sample count = more accurate. 
// However the duration of the test will increase. The recommendation is somewhere between 30-60 samples.
const samplesCount = 40;

// the markers leveraged tuning your web application. additionally this assumes you have tuned 
// your web application with the following marker "renderEnd" 
// (see "Instrument your web application" above). the full list of available markers is robust, 
// especially as it pertains to web application frameworks (ember, react etc). 
// as a baseline the `PerformanceTiming` API is fully available
const markers = [{ start: 'domComplete', label: 'domComplete' }];
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

### Trace-Results

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

### Statistical Analysis

Assuming you have the output results ("trace-results.json") from your TracerBench run, its time to perform statistical analysis on the [Trace-Results](#Trace-Results) JSON file.

When running the TracerBench-CLI `compare` command, on a successful trace a stdout statistical summary report will be generated.

### Understanding The Box-Plot Results
![box-plot-results](https://github.com/TracerBench/tracerbench/blob/master/docs/box-plot-transparent.png)

---

# Statistics Primer

Now that the tracing is complete and the data has been collected. The next step in analyzing it, is to leverage some descriptive statistics to get a feeling for the data.

### Population & Sample

Population and Sample are part of the foundation of statistical hypothesis testing.

A population is a collection of data which you want to make an assumption on. For example in a swimming pool of water this represents all of the water in the pool. Since testing every drop of water is not realistically possible. A subset of the population (subset of the pool water) is tested to analyze and make an assumption, which is called a sample. 

To represent the population well, a sample should be randomly collected and adequately large. If the sample is random and large enough, you can use the information collected from the sample to make an assumption about the larger population. Then leverage a hypothesis test to estimate the percentage of the sample to the population.

### Probability Sampling

Sampling involves choosing a method of sampling (how are we going to sample). In the example of the swimming pool, are we going to only sample the pool water from the shallow end? deep end? both ends? The method we decide on will influence the data we result with.

The two major categories in sampling are probability and non-probability sampling. For a given population (swimming pool), each element (drop of water) of that population has a chance of being "picked" as part of the sample (cup of water). In other words, no single element of the population has a zero chance of being picked. The odd/chances/probability of picking any element is known or can be calculated. This is possible if we know the total number in the entire population and are able to determine the odds of picking any one element. Probability sampling involves randomly picking elements from a population which is why no element has a zero chance of being picked to be part of a sample.

### Null hypothesis (H0)

The null hypothesis is a statement about a population. A hypothesis test uses sample data to determine whether to reject the null hypothesis. The null hypothesis states that a population parameter (such as the mean, the standard deviation, etc.) is equal to a hypothesized value. The null hypothesis is often an initial claim that is based on a previous analysis or insights.

### Standard Deviation & Variance

The standard deviation is the most common measure of how spread out the data are from the mean (dispersion). The greater the standard deviation, the greater the spread in the data.

The variance measures how much the data is scattered about their mean. The variance is equal to the standard deviation squared.

![Understanding-Standard-Deviation-and-Variance](https://github.com/TracerBench/tracerbench/blob/master/docs/std-deviation.png)

### Confidence Interval

A confidence interval is a range of values, derived from sample statistics, that is likely to contain the value of an unknown population parameter. Since they are random it's unlikely that two samples from a population will yield identical confidence intervals. However, if the sampling is repeated many times, a certain percentage of the confidence intervals would contain the unknown population parameter. For example in a 95% confidence interval, 5% would contain the unknown population parameter.

### Power

The power of a hypothesis test is the probability that the test correctly rejects the null hypothesis. The power of a hypothesis test is affected by the sample size, difference, variance and the significance level of the test.

If a test has low power, you might fail to detect an effect and mistakenly conclude that none exists. If a test has a power that is too high very small effects/changes might seem to be significant.

### Wilcoxon rank sum with continuity correction

Wilcoxon rank sum essentially calculates the difference between each set of pairs in the test and analyzes the differences in the pairs.

Continuity correction pragmatically is as simple as adding or subtracting 0.5 to the x-value of a distribution with a lookup table to determine when to add or subtract 0.5.

### Statistical Significance

Statistical significance itself doesn't imply that your results have practical consequence. If you use a test with very high power, you might conclude that a small difference from the hypothesized value is statistically significant. However, that small difference might be meaningless to your situation. Your technical insight should be leveraged to determine whether the difference is practically significant. With a large enough sample, you can likely reject the null hypothesis even though the difference is of no practical importance.

Confidence intervals are commonly more useful than hypothesis tests because they provide a way to assess practical significance in addition to statistical significance. They help you determine what parameter value is, instead of what it is not.

(statistical primer sources: https://cbmm.mit.edu/, https://www.wyzant.com, https://support.minitab.com)
