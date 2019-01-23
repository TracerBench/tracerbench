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
* [`tracerbench hello [FILE]`](#tracerbench-hello-file)
* [`tracerbench help [COMMAND]`](#tracerbench-help-command)
* [`tracerbench trace [FILE]`](#tracerbench-trace-file)

## `tracerbench hello [FILE]`

describe the command here

```
USAGE
  $ tracerbench hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
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

## `tracerbench trace [FILE]`

Does an automated trace of a webpage. Also takes network conditioner and CPU throttling options.

```
USAGE
  $ tracerbench trace [FILE]

OPTIONS
  -c, --cpu=cpu          (required) [default: 1] cpu throttle multiplier
  -h, --har=har          (required) filepath to the HAR file

  -n, --network=network  simulated network conditions for none, offline, dialup, 2g, edge, slow-3g, em-3g, dsl, 3g,
                         fast-3g, 4g, cable, LTE, FIOS

  -o, --output=output    (required) [default: trace.json] the filename to save the trace to

  -u, --url=url          (required) url to visit
```
<!-- commandsstop -->
