# This is unstable, incomplete, work-in-progress software in a constant state of change. You have been warned.

# tracerbench-cli

tracerbench-cli

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)
[![Version](https://img.shields.io/npm/v/tracerbench-cli.svg)](https://npmjs.org/package/tracerbench-cli)
[![License](https://img.shields.io/npm/l/tracerbench-cli.svg)](https://github.com/TracerBench/tracerbench/blob/master/package.json)

<!-- toc -->
* [This is unstable, incomplete, work-in-progress software in a constant state of change. You have been warned.](#this-is-unstable-incomplete-work-in-progress-software-in-a-constant-state-of-change-you-have-been-warned)
* [tracerbench-cli](#tracerbench-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g tracerbench-cli
$ tracerbench COMMAND
running command...
$ tracerbench (-v|--version|version)
tracerbench-cli/1.0.0-alpha.8 darwin-x64 node-v8.14.0
$ tracerbench --help [COMMAND]
USAGE
  $ tracerbench COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`tracerbench analyze`](#tracerbench-analyze)
* [`tracerbench compare`](#tracerbench-compare)
* [`tracerbench create-archive`](#tracerbench-create-archive)
* [`tracerbench css-parse`](#tracerbench-css-parse)
* [`tracerbench help [COMMAND]`](#tracerbench-help-command)
* [`tracerbench js-eval-time`](#tracerbench-js-eval-time)
* [`tracerbench list-functions`](#tracerbench-list-functions)
* [`tracerbench timeline:find`](#tracerbench-timelinefind)
* [`tracerbench timeline:list`](#tracerbench-timelinelist)
* [`tracerbench timeline:show`](#tracerbench-timelineshow)
* [`tracerbench trace`](#tracerbench-trace)

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

  -n, --network=none, offline, dialup, 2g, edge, slow-3g, em-3g, dsl, 3g, fast-3g, 4g, cable, LTE, FIOS
      Simulated network conditions.

  -o, --output=output
      (required) [default: tracerbench-results] The output filename for compare results

  -u, --url=url
      (required) URL to visit

  --browserArgs=browserArgs
      (required) [default: 
      --headless,--disable-gpu,--hide-scrollbars,--mute-audio,--v8-cache-options=none,--disable-cache,--disable-v8-idle-ta
      sks,--crash-dumps-dir=./tmp] (Default Recommended) Browser additional options for the TracerBench render benchmark

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 1] CPU throttle multiplier

  --fidelity=test,low,medium,high
      (required) [default: low] Directly correlates to the number of samples per trace. High means a longer trace time.

  --markers=markers
      (required) [default: [object Object],[object Object],[object Object],[object Object],[object Object],[object 
      Object],[object Object]] DOM markers
```

## `tracerbench create-archive`

Creates an automated archive file from a URL.

```
USAGE
  $ tracerbench create-archive

OPTIONS
  -u, --url=url                  (required) URL to visit
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
  -u, --url=url                          (required) URL to visit
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
  -f, --traceJSONOutput=traceJSONOutput
      (required) [default: ./trace.json] Path to the existing trace JSON file

  -h, --har=har
      Filepath to the existing HAR file

  -n, --network=none, offline, dialup, 2g, edge, slow-3g, em-3g, dsl, 3g, fast-3g, 4g, cable, LTE, FIOS
      Simulated network conditions.

  -u, --url=url
      (required) URL to visit

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 1] CPU throttle multiplier
```
<!-- commandsstop -->
