#### !!! This is unstable, incomplete, work-in-progress software in a constant state of change. You have been warned!!!

## TracerBench-CLI: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)
[![Version](https://img.shields.io/npm/v/tracerbench-cli.svg)](https://npmjs.org/package/tracerbench-cli)
[![License](https://img.shields.io/npm/l/tracerbench-cli.svg)](https://github.com/TracerBench/tracerbench/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Optional Config](#optional-config)
- [FAQ](#faq)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```s
$ npm install -g tracerbench-cli
$ tracerbench COMMAND
running command...
$ tracerbench (-v|--version|version)
tracerbench-cli/1.0.0-alpha.9 darwin-x64 node-v8.14.0
$ tracerbench --help [COMMAND]
USAGE
  $ tracerbench COMMAND
...
```

<!-- usagestop -->

# Optional Config

The optional existance of a "tbconfig.json" file in the project root will be consumed by TracerBench and specifies default command flag options. Please note this file is optional, however is strongly recommended as this drastically speeds up running TracerBench tests succinctly. [Typings]("https://github.com/TracerBench/tracerbench/blob/master/packages/cli/src/utils.ts#L7-L33") and Example:

```json
{
  "file": "./trace.json",
  "fidelity": "low",
  "methods": "''",
  "cpuThrottleRate": 2,
  "output": "tracerbench-results",
  "urlOrFrame": "https://www.tracerbench.com",
  "url": "https://www.tracerbench.com",
  "harsPath": "./hars",
  "routes": ["/about", "/contact"],
  "appName": "tracerbench",
  "markers": [
    {
      "start": "fetchStart",
      "label": "fetchStart"
    },
    {
      "start": "jqueryLoaded",
      "label": "jqueryLoaded"
    },
    {
      "start": "renderEnd",
      "label": "renderEnd"
    }
  ]
}
```

# FAQ

_What exactly is contained within the `tracerbench compare` "tracerbench-results.json"?_

[Trace-Results]("https://github.com/TracerBench/tracerbench/blob/master/README.md#trace-results")

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

- [`tracerbench analyze`](#tracerbench-analyze)
- [`tracerbench compare`](#tracerbench-compare)
- [`tracerbench create-archive`](#tracerbench-create-archive)
- [`tracerbench css-parse`](#tracerbench-css-parse)
- [`tracerbench help [COMMAND]`](#tracerbench-help-command)
- [`tracerbench js-eval-time`](#tracerbench-js-eval-time)
- [`tracerbench list-functions`](#tracerbench-list-functions)
- [`tracerbench timeline:find`](#tracerbench-timelinefind)
- [`tracerbench timeline:list`](#tracerbench-timelinelist)
- [`tracerbench timeline:show`](#tracerbench-timelineshow)
- [`tracerbench trace`](#tracerbench-trace)

## `tracerbench analyze`

Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.

```
USAGE
  $ tracerbench analyze

OPTIONS
  -a, --archive=archive                  (required) [default: ./trace.har] Path to the existing HAR file
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
  -m, --methods=methods                  (required) [default: ""] List of methods to aggregate

  -r, --report=report                    Directory path to generate a report with aggregated sums for each heuristic
                                         category and aggregated sum across all heuristics

  --event=event                          Slice time and see the events before and after the time slice
```

## `tracerbench compare`

Compare the performance delta between an experiment and control

```
USAGE
  $ tracerbench compare

OPTIONS
  -c, --control=control
      The path to the control SHA

  -e, --experiment=experiment
      The path to the experiment SHA

  -n, --network=none|offline|dialup|2g|edge|slow-3g|em-3g|dsl|3g|fast-3g|4g|cable|LTE|FIOS
      Simulated network conditions.

  -o, --output=output
      (required) [default: tracerbench-results] The output filename for compare results

  -u, --url=url
      (required) [default: http://localhost:8000/?tracing] URL to visit

  --browserArgs=browserArgs
      (required) [default:
      --headless,--disable-gpu,--hide-scrollbars,--mute-audio,--v8-cache-options=none,--disable-cache,--disable-v8-idle-ta
      sks,--crash-dumps-dir=./tmp] (Default Recommended) Browser additional options for the TracerBench render benchmark

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 1] CPU throttle multiplier

  --fidelity=test|low|medium|high
      (required) [default: low] Directly correlates to the number of samples per trace. High means a longer trace time.

  --markers=markers
      (required) [default: [object Object],[object Object],[object Object],[object Object],[object Object],[object
      Object],[object Object]] DOM markers
```

## `tracerbench create-archive`

Creates an automated HAR file from a URL.

```
USAGE
  $ tracerbench create-archive

OPTIONS
  -u, --url=url                  (required) [default: http://localhost:8000/?tracing] URL to visit
  --archiveOutput=archiveOutput  (required) [default: ./trace.har] The output filepath/name to save the HAR to
```

## `tracerbench css-parse`

Aggregates CSS parsing time from a trace.

```
USAGE
  $ tracerbench css-parse

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `tracerbench js-eval-time`

Aggregates JS Eval time from a trace.

```
USAGE
  $ tracerbench js-eval-time

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
```

## `tracerbench list-functions`

Lists all the functions and source locations from a trace.

```
USAGE
  $ tracerbench list-functions

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
  -l, --locations=locations              include locations in names
```

## `tracerbench timeline:find`

Get frame id from trace JSON file and url.

```
USAGE
  $ tracerbench timeline:find

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
  -u, --url=url                          (required) [default: http://localhost:8000/?tracing] URL to visit
```

## `tracerbench timeline:list`

list main frame loads

```
USAGE
  $ tracerbench timeline:list

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
```

## `tracerbench timeline:show`

show tracefile with user timings

```
USAGE
  $ tracerbench timeline:show

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput  (required) [default: ./trace.json] Path to the existing trace JSON file
  --filter=filter                        User timing marks start with
  --marks=marks                          Show user timing marks
  --urlOrFrame=urlOrFrame                (required) URL or Frame
```

## `tracerbench trace`

Creates an automated trace JSON file. Also takes network conditioner and CPU throttling options.

```
USAGE
  $ tracerbench trace

OPTIONS
  -f, --traceJSONOutput=traceJSONOutput                                                     (required) [default:
                                                                                            ./trace.json] Path to the
                                                                                            existing trace JSON file

  -h, --har=har                                                                             Filepath to the existing HAR
                                                                                            file

  -n, --network=none|offline|dialup|2g|edge|slow-3g|em-3g|dsl|3g|fast-3g|4g|cable|LTE|FIOS  Simulated network
                                                                                            conditions.

  -u, --url=url                                                                             (required) [default:
                                                                                            http://localhost:8000/?traci
                                                                                            ng] URL to visit

  --archiveOutput=archiveOutput                                                             (required) [default:
                                                                                            ./trace.har] The output
                                                                                            filepath/name to save the
                                                                                            HAR to

  --cpuThrottleRate=cpuThrottleRate                                                         (required) [default: 1] CPU
                                                                                            throttle multiplier

  --iterations=iterations                                                                   (required) [default: 1]
                                                                                            Number of runs
```

<!-- commandsstop -->
