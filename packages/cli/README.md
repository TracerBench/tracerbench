## TracerBench: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)
[![Version](https://img.shields.io/npm/v/tracerbench.svg)](https://npmjs.org/package/tracerbench)
[![License](https://img.shields.io/npm/l/tracerbench.svg)](https://github.com/TracerBench/tracerbench/blob/master/package.json)

# TracerBench Core
https://github.com/TracerBench/tracerbench/blob/master/README.md

<!-- toc -->
* [TracerBench Core](#tracerbench-core)
* [Usage](#usage)
* [Optional Config](#optional-config)
* [Example Travis-CI Integration](#example-travis-ci-integration)
* [FAQ](#faq)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g tracerbench
$ tracerbench COMMAND
running command...
$ tracerbench (-v|--version|version)
tracerbench/2.2.1 darwin-x64 node-v10.16.3
$ tracerbench --help [COMMAND]
USAGE
  $ tracerbench COMMAND
...
```
<!-- usagestop -->

# Optional Config

The optional existance of a "tbconfig.json" file in the project root will be consumed by TracerBench and specifies default command flag options. Please note this file is optional, however is strongly recommended as this drastically speeds up running TracerBench tests succinctly [Example](https://github.com/TracerBench/tracerbench/blob/master/packages/cli/test/tbconfig.json):

```json-c
{
  "$schema": "https://raw.githubusercontent.com/TracerBench/tracerbench/master/packages/cli/tb-schema.json",
  // the title of the report pdf file
  "plotTitle": "tbconfig_base file",
  "cpuThrottleRate": 2,
  "tbResultsFolder": "../tracerbench-results",
  "controlURL": "https://www.tracerbench.com/",
  "experimentURL": "https://www.tracerbench.com/",
  "url": "https://www.tracerbench.com/",
  "tracingLocationSearch": "?tracing",
  "regressionThreshold": "-100ms",
  "appName": "tracerbench",
  "network": "cable",
  "markers": [
    {
      "start": "fetchStart",
      "label": "jquery"
    },
    {
      "start": "jqueryLoaded",
      "label": "ember"
    },
    {
      "start": "emberLoaded",
      "label": "application"
    },
    {
      "start": "startRouting",
      "label": "routing"
    },
    {
      "start": "willTransition",
      "label": "transition"
    },
    {
      "start": "didTransition",
      "label": "render"
    },
    {
      "start": "renderEnd",
      "label": "afterRender"
    }
  ],
  "browserArgs": [
    "--crash-dumps-dir=./tmp",
    "--disable-background-timer-throttling",
    "--disable-dev-shm-usage",
    "--disable-cache",
    "--disable-v8-idle-tasks",
    "--disable-breakpad",
    "--disable-notifications",
    "--disable-hang-monitor",
    "--safebrowsing-disable-auto-update",
    "--setIgnoreCertificateErrors=true",
    "--v8-cache-options=none"
  ],
  "servers": [
    {
      "name": "control tracerbench-build_1.0.1234",
      "url": "https://www.tracerbench.com/",
      "dist": "./relative-path-to-control-dist-files/",
      "har": "./relative-path-location-to-control-har-file/",
      "socksPort": 8880
    },
    {
      "name": "experiment tracerbench-build-2-78ffg6a678g95",
      "url": "https://www.tracerbench.com/",
      "dist": "./relative-path-to-experiment-dist-files/",
      "har": "./relative-path-location-to-experiment-har-file/",
      "socksPort": 8881
    }
  ]
}

```

# Example Travis-CI Integration

In this working example the `travis-script.js` would be called from the travis yml file `travis.yml` via `yarn run <script>` included within your applications package.json (not shown) eg: `yarn tracerbench:compare`.

- [travis.yml](https://github.com/TracerBench/tracerbench/blob/master/docs/travis-example.yml)
- [travis-script.js](https://github.com/TracerBench/tracerbench/blob/master/docs/travis-example.js)

The results of this test would resolve in

1. The results are statistically significant
2. The results contained a regression, however the regression is below a set threshold from `tbconfig.json`. (For example to mitigate against false-positives).
3. The results contained a regression and the delta was significant enough to cause concern. (Recommend running the test again with a higher sample size to confirm).
4. The results are statistically insignificant. All is good.

# FAQ

_What exactly is contained within the `tracerbench compare` "tracerbench-results.json"?_
An overview of "tracerbench-results.json" is available [here](https://github.com/TracerBench/tracerbench/blob/master/README.md#trace-results)

_What exactly is a HAR file?_
HAR (HTTP Archive) is a file format used by several HTTP session tools to export the captured data. The format is basically a JSON object with a particular field distribution. In any case, please note that not all the fields are mandatory, and many times some information won't be saved to the file ["Additional insight on Google's HAR Analyzer"](https://toolbox.googleapps.com/apps/har_analyzer/)

_What exactly is contained within the output file "trace.json"?_
The file "trace.json" is leveraged by TracerBench to capture an array of trace events. The interface of an individual trace event is essentially:

```ts
// process id
pid: number;
// thread id
tid: number;
// timestamp in μs
ts: number;
// event phase
ph: TRACE_EVENT_PHASE;
// event categories (comma delimited)
cat: string;
// event name
name: string;
// event key/value pairs
args: { [key: string]: any } | ARGS.STRIPPED;
// ?timestamp in μs for trace event phase complete
dur?: number;
// ?thread clock timestamp in μs
tts?: number;
// ?thread clock duration in μs for trace event phase complete
tdur?: number;
// ?thread clock timestamp for related async events
use_async_tts?: number;
// ?scope of id
scope?: string;
// ?event id. optionally serialized as int64
id?: string;
// ?scoped event ids
id2?: | { local: string; } | { global: string; };
// ?async event/event associations
bp?: string;
// ?flow binding id optionally serialized as int64
bind_id?: string;
// ?incoming flow flag
flow_in?: boolean;
// ?outgoing flow flag
flow_out?: boolean;
// ?scope for TRACE_EVENT_PHASE_INSTANT events
s?: TRACE_EVENT_SCOPE;
```

# Commands

<!-- commands -->
* [`tracerbench compare`](#tracerbench-compare)
* [`tracerbench compare:analyze RESULTSFILE`](#tracerbench-compareanalyze-resultsfile)
* [`tracerbench create-archive`](#tracerbench-create-archive)
* [`tracerbench help [COMMAND]`](#tracerbench-help-command)
* [`tracerbench marker-timings`](#tracerbench-marker-timings)
* [`tracerbench report`](#tracerbench-report)
* [`tracerbench trace`](#tracerbench-trace)

## `tracerbench compare`

Compare the performance delta between an experiment and control

```
USAGE
  $ tracerbench compare

OPTIONS
  --browserArgs=browserArgs
      (required) [default: 
      --crash-dumps-dir=./tmp,--disable-background-timer-throttling,--disable-dev-shm-usage,--disable-cache,--disable-v8-i
      dle-tasks,--disable-breakpad,--disable-notifications,--disable-hang-monitor,--safebrowsing-disable-auto-update,--ign
      ore-certificate-errors,--v8-cache-options=none] (Default Recommended) Additional chrome flags for the TracerBench 
      render benchmark. TracerBench includes many non-configurable defaults in this category.

  --config=config
      Specify an alternative directory rather than the project root for the tbconfig.json. This explicit config will 
      overwrite all.

  --controlURL=controlURL
      (required) [default: http://localhost:8000/] Control URL to visit for compare command

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 2] CPU throttle multiplier

  --debug
      Debug flag per command. Will output noisy command

  --emulateDevice=iphone-4|iphone-5se|iphone-678|iphone-678-plus|iphone-x|blackberry-z30|nexus-4|nexus-5|nexus-5x|nexus-
  6|nexus-6p|pixel-2|pixel-2-xl|lg-optimus-l70|nokia-n9|nokia-lumia-520|microsoft-lumia-550|microsoft-lumia-950|galaxy-s
  -iii|galaxy-s5|kindle-fire-hdx|ipad-mini|ipad|ipad-pro|blackberry-playbook|nexus-10|nexus-7|galaxy-note-3|galaxy-note-
  ii|laptop-with-touch|laptop-with-hidpi-screen|laptop-with-mdpi-screen
      Emulate a mobile device screen size.

  --emulateDeviceOrientation=horizontal|vertical
      [default: vertical] Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.

  --experimentURL=experimentURL
      (required) [default: http://localhost:8001/] Experiment URL to visit for compare command

  --fidelity=fidelity
      (required) [default: low] Directly correlates to the number of samples per trace. High is the longest trace time.

  --headless
      Run with headless chrome flags

  --hideAnalysis
      Hide the the analysis output in terminal

  --markers=markers
      (required) [default: domComplete] User Timing Markers

  --network=none | offline | dialup | 2g | edge | slow-3g | em-3g | dsl | 3g | fast-3g | 4g | cable | LTE | FIOS
      (required) [default: none] Simulated network conditions.

  --regressionThreshold=regressionThreshold
      [default: 0ms] Regression threshold in negative milliseconds. eg -100ms

  --report
      Generate a PDF report directly after running the compare command.

  --runtimeStats
      Compare command output deep-dive stats during run.

  --socksPorts=socksPorts
      Specify a socks proxy port as browser option for control and experiment

  --tbResultsFolder=tbResultsFolder
      (required) [default: ./tracerbench-results] The output folder path for all tracerbench results

  --tracingLocationSearch=tracingLocationSearch
      (required) [default: ?tracing] The document location search param.
```

## `tracerbench compare:analyze RESULTSFILE`

Run an analysis of a benchmark run from a results json file and output to terminal

```
USAGE
  $ tracerbench compare:analyze RESULTSFILE

ARGUMENTS
  RESULTSFILE  Results JSON file

OPTIONS
  --fidelity=fidelity                (required) [default: low] Directly correlates to the number of samples per trace.
                                     High is the longest trace time.

  --tbResultsFolder=tbResultsFolder  (required) [default: ./tracerbench-results] The output folder path for all
                                     tracerbench results
```

## `tracerbench create-archive`

Creates an automated HAR file from a URL.

```
USAGE
  $ tracerbench create-archive

OPTIONS
  --browserArgs=browserArgs
      (required) [default: 
      --crash-dumps-dir=./tmp,--disable-background-timer-throttling,--disable-dev-shm-usage,--disable-cache,--disable-v8-i
      dle-tasks,--disable-breakpad,--disable-notifications,--disable-hang-monitor,--safebrowsing-disable-auto-update,--ign
      ore-certificate-errors,--v8-cache-options=none] (Default Recommended) Additional chrome flags for the TracerBench 
      render benchmark. TracerBench includes many non-configurable defaults in this category.

  --tbResultsFolder=tbResultsFolder
      (required) [default: ./tracerbench-results] The output folder path for all tracerbench results

  --url=url
      (required) [default: http://localhost:8000/] URL to visit for create-archive, timings & trace commands
```

## `tracerbench help [COMMAND]`

display help for tracerbench

```
USAGE
  $ tracerbench help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `tracerbench marker-timings`

Get list of all user-timings from trace

```
USAGE
  $ tracerbench marker-timings

OPTIONS
  --filter=filter                    User timing marks start with

  --tbResultsFolder=tbResultsFolder  (required) [default: ./tracerbench-results] The output folder path for all
                                     tracerbench results

  --traceFrame=traceFrame            Specify a trace insights frame

  --url=url                          (required) [default: http://localhost:8000/] URL to visit for create-archive,
                                     timings & trace commands
```

## `tracerbench report`

Parses the output json from tracerbench and formats it into pdf and html

```
USAGE
  $ tracerbench report

OPTIONS
  --config=config                    Specify an alternative directory rather than the project root for the
                                     tbconfig.json. This explicit config will overwrite all.

  --tbResultsFolder=tbResultsFolder  (required) [default: ./tracerbench-results] The output folder path for all
                                     tracerbench results
```

## `tracerbench trace`

Parses a CPU profile and aggregates time across heuristics. Can optinally be vertically sliced with event names.

```
USAGE
  $ tracerbench trace

OPTIONS
  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 2] CPU throttle multiplier

  --insights
      Analyze insights from command.

  --iterations=iterations
      (required) [default: 1] Number of runs

  --locations=locations
      include locations in names

  --network=none | offline | dialup | 2g | edge | slow-3g | em-3g | dsl | 3g | fast-3g | 4g | cable | LTE | FIOS
      [default: none] Simulated network conditions.

  --tbResultsFolder=tbResultsFolder
      (required) [default: ./tracerbench-results] The output folder path for all tracerbench results

  --url=url
      (required) [default: http://localhost:8000/] URL to visit for create-archive, timings & trace commands
```
<!-- commandsstop -->
