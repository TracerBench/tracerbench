#### !!! This is unstable, incomplete, work-in-progress software in a constant state of change. You have been warned!!!

## TracerBench-CLI: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)
[![Version](https://img.shields.io/npm/v/tracerbench-cli.svg)](https://npmjs.org/package/tracerbench-cli)
[![License](https://img.shields.io/npm/l/tracerbench-cli.svg)](https://github.com/TracerBench/tracerbench/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Optional Config](#optional-config)
* [FAQ](#faq)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g tracerbench-cli
$ tracerbench COMMAND
running command...
$ tracerbench (-v|--version|version)
tracerbench-cli/2.0.0-beta.15 darwin-x64 node-v10.15.2
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
  // comments are ok with JSON5
  "plotTitle": "TracerBench.com",
  "outputFolderPath": "./tracerbench-results",
  "fidelity": "high",
  "cpuThrottleRate": 2,
  "tbResultsFile": "tracerbench-results",
  "controlURL": "https://www.tracerbench.com/",
  "experimentURL": "https://www.tracerbench.com/",
  "url": "https://www.tracerbench.com/",
  "routes": ["/", "/foo", "/baz", "/buzz"],
  "tracingLocationSearch": "?tracing",
  "regressionThreshold": "-100ms",
  "appName": "tracerbench",
  "network": "cable",
  "markers": [{
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
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--mute-audio",
    "--v8-cache-options=none",
    "--disable-cache",
    "--disable-v8-idle-tasks",
    "--crash-dumps-dir=./tmp",
    "--disable-background-timer-throttling"
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
* [`tracerbench create-archive`](#tracerbench-create-archive)
* [`tracerbench help [COMMAND]`](#tracerbench-help-command)
* [`tracerbench marker-timings`](#tracerbench-marker-timings)
* [`tracerbench trace`](#tracerbench-trace)

## `tracerbench compare`

Compare the performance delta between an experiment and control

```
USAGE
  $ tracerbench compare

OPTIONS
  --browserArgs=browserArgs
      (required) [default: 
      --crash-dumps-dir=./tmp,--disable-background-timer-throttling,--disable-gpu,--disable-cache,--disable-v8-idle-tasks,
      --disable-translate,--disable-breakpad,--disable-sync,--disable-background-networking,--disable-default-apps,--disab
      le-extensions,--disable-notifications,--disable-hang-monitor,--headless,--hide-scrollbars,--metrics-recording-only,-
      -mute-audio,--no-default-browser-check,--no-first-run,--no-experiments,--no-sandbox,--noerrdialogs,--safebrowsing-di
      sable-auto-update,--setIgnoreCertificateErrors=true,--v8-cache-options=none] (Default Recommended) Browser 
      additional options for the TracerBench render benchmark

  --controlURL=controlURL
      (required) [default: http://localhost:8000/] Control URL to visit for compare command

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 4] CPU throttle multiplier

  --debug
      Debug flag per command. Will output noisy command

  --emulateDevice=iphone-4|iphone-5se|iphone-678|iphone-678-plus|iphone-x|blackberry-z30|nexus-4|nexus-5|nexus-5x|nexus-
  6|nexus-6p|pixel-2|pixel-2-xl|lg-optimus-l70|nokia-n9|nokia-lumia-520|microsoft-lumia-550|microsoft-lumia-950|galaxy-s
  -iii|galaxy-s5|kindle-fire-hdx|ipad-mini|ipad|ipad-pro|blackberry-playbook|nexus-10|nexus-7|galaxy-note-3|galaxy-note-
  ii|laptop-with-touch|laptop-with-hidpi-screen|laptop-with-mdpi-screen
      Emulate a mobile device.

  --experimentURL=experimentURL
      (required) [default: http://localhost:8001/] Experiment URL to visit for compare command

  --fidelity=test|low|medium|high
      (required) [default: low] Directly correlates to the number of samples per trace. High is the longest trace time.

  --json
      If supported output the command stdout with json rather than formatted results

  --markers=markers
      (required) [default: domComplete] User Timing Markers

  --network=none | offline | dialup | 2g | edge | slow-3g | em-3g | dsl | 3g | fast-3g | 4g | cable | LTE | FIOS
      (required) [default: none] Simulated network conditions.

  --regressionThreshold=regressionThreshold
      [default: 0ms] Regression threshold in negative milliseconds. eg -100ms

  --runtimeStats=runtimeStats
      (required) [default: false] Compare command output stats during run

  --socksPorts=socksPorts
      Specify a socks proxy port as browser option for control and experiment

  --tbResultsFile=tbResultsFile
      (required) [default: ./tracerbench-results] The output filepath for all tracerbench results

  --tracingLocationSearch=tracingLocationSearch
      (required) [default: ?tracing] The document location search param.
```

## `tracerbench create-archive`

Creates an automated HAR file from a URL.

```
USAGE
  $ tracerbench create-archive

OPTIONS
  --tbResultsFile=tbResultsFile  (required) [default: ./tracerbench-results] The output filepath for all tracerbench
                                 results

  --url=url                      (required) [default: http://localhost:8000/] URL to visit for create-archive, timings &
                                 trace commands
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

## `tracerbench marker-timings`

Get list of all user-timings from trace

```
USAGE
  $ tracerbench marker-timings

OPTIONS
  --filter=filter                User timing marks start with

  --tbResultsFile=tbResultsFile  (required) [default: ./tracerbench-results] The output filepath for all tracerbench
                                 results

  --traceFrame=traceFrame        Specify a trace insights frame

  --url=url                      (required) [default: http://localhost:8000/] URL to visit for create-archive, timings &
                                 trace commands
```

## `tracerbench trace`

Parses a CPU profile and aggregates time across heuristics. Can optinally be vertically sliced with event names.

```
USAGE
  $ tracerbench trace

OPTIONS
  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 4] CPU throttle multiplier

  --insights
      Analyze insights from command.

  --iterations=iterations
      (required) [default: 1] Number of runs

  --json
      If supported output the command stdout with json rather than formatted results

  --locations=locations
      include locations in names

  --network=none | offline | dialup | 2g | edge | slow-3g | em-3g | dsl | 3g | fast-3g | 4g | cable | LTE | FIOS
      [default: none] Simulated network conditions.

  --tbResultsFile=tbResultsFile
      (required) [default: ./tracerbench-results] The output filepath for all tracerbench results

  --url=url
      (required) [default: http://localhost:8000/] URL to visit for create-archive, timings & trace commands
```
<!-- commandsstop -->
