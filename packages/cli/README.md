tracerbench-cli
===============

tracerbench-cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tracerbench-cli.svg)](https://npmjs.org/package/tracerbench-cli)
[![Downloads/week](https://img.shields.io/npm/dw/tracerbench-cli.svg)](https://npmjs.org/package/tracerbench-cli)
[![License](https://img.shields.io/npm/l/tracerbench-cli.svg)](https://github.com/TracerBench/tracerbench/blob/master/package.json)

<!-- toc -->
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
tracerbench-cli/0.0.0 darwin-x64 node-v8.14.0
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
  -a, --archive=archive  (required) [default: ./test/trace.archive] Path to archive file
  -f, --file=file        (required) [default: ./test/trace.json] Path to the trace JSON file
  -m, --methods=methods  (required) [default: ''] List of methods to aggregate

  -r, --report=report    Directory path to generate a report with aggregated sums for each heuristic category and
                         aggregated sum across all heuristics

  --event=event          Slice time and see the events before and after the time slice
```

## `tracerbench compare`

Creates an automated archive file from a URL.

```
USAGE
  $ tracerbench compare

OPTIONS
  -c, --control=control
      (required) The path to the control SHA

  -e, --experiment=experiment
      (required) The path to the experiment SHA

  -n, --network=none, offline, dialup, 2g, edge, slow-3g, em-3g, dsl, 3g, fast-3g, 4g, cable, LTE, FIOS
      Simulated network conditions.

  -o, --output=output
      (required) [default: ./tracerbench-results.json] The output JSON file

  -u, --url=url
      URL to visit

  --cpuThrottle=cpuThrottle
      (required) [default: 1] CPU throttle multiplier

  --fidelity=low|high
      [default: low] Directly correlates to the number of samples per trace. High means a longer trace time.

  --marker=marker
      [default: renderEnd] DOM render complete marker
```

## `tracerbench create-archive`

Creates an automated archive file from a URL.

```
USAGE
  $ tracerbench create-archive

OPTIONS
  -u, --url=url                  (required) URL to visit
  --archiveOutput=archiveOutput  (required) [default: ./trace.json] The output filepath/name to save the trace to
```

## `tracerbench css-parse`

Aggregates CSS parsing time from a trace.

```
USAGE
  $ tracerbench css-parse

OPTIONS
  -f, --file=file  (required) [default: ./test/trace.json] Path to the trace JSON file
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
  -f, --file=file  (required) [default: ./test/trace.json] Path to the trace JSON file
```

## `tracerbench list-functions`

Lists all the functions and source locations from a trace.

```
USAGE
  $ tracerbench list-functions

OPTIONS
  -f, --file=file            (required) [default: ./test/trace.json] Path to the trace JSON file
  -l, --locations=locations  include locations in names
```

## `tracerbench timeline:find`

Get frame id from trace file and url.

```
USAGE
  $ tracerbench timeline:find

OPTIONS
  -f, --file=file  (required) [default: ./test/trace.json] Path to the trace JSON file
  -u, --url=url    (required) URL to visit
```

## `tracerbench timeline:list`

list main frame loads

```
USAGE
  $ tracerbench timeline:list

OPTIONS
  -f, --file=file  (required) [default: ./test/trace.json] Path to the trace JSON file
```

## `tracerbench timeline:show`

show tracefile with user timings

```
USAGE
  $ tracerbench timeline:show

OPTIONS
  -f, --file=file          (required) [default: ./test/trace.json] Path to the trace JSON file
  --filter=filter          User timing marks start with
  --marks=marks            Show user timing marks
  --urlOrFrame=urlOrFrame  (required) URL or Frame
```

## `tracerbench trace`

Creates an automated trace that's saved to JSON. Also takes network conditioner and CPU throttling options.

```
USAGE
  $ tracerbench trace

OPTIONS
  -h, --har=har
      (required) Filepath to the HAR file

  -n, --network=none, offline, dialup, 2g, edge, slow-3g, em-3g, dsl, 3g, fast-3g, 4g, cable, LTE, FIOS
      Simulated network conditions.

  -u, --url=url
      (required) URL to visit

  --cpuThrottle=cpuThrottle
      (required) [default: 1] CPU throttle multiplier

  --traceOutput=traceOutput
      (required) [default: ./trace.archive] The archive output file name
```
<!-- commandsstop -->
