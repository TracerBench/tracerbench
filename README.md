# parse-profile [![Build Status](https://travis-ci.org/tracerbench/parse-profile.svg?branch=master)](https://travis-ci.org/tracerbench/parse-profile)

A suite of CLI tools for generating and parsing CPUProfile's.

## Usage

#### `profile`
The parent command that allows for running one of the subcommands below.

The primary usage would be:

```bash
# create a Chrome profile from a URL and save to a JSON file
$ ./bin/profile trace --url http://www.example.com --network 4g --cpu 4

# create a HAR file based on a URL
$ ./bin/profile create-archive --url http://www.example.com

# analyze the created profile
$ ./bin/profile analyze --file trace.json --report ./heuristics --event mark_meaningful_paint_end
```

### Subcommands

#### `trace`
Does an automated trace of a webpage. Also takes network conditioner and CPU throttling options.

#### `create-archive`
Creates a subset of a HAR file for gather resource information and application version number.

#### `analyze`
Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.

### Additional subcommands

#### `timeline`
Parses a CPU profile and displays interesting events in chronological order

#### `list-functions`
Lists all the functions and source locations from a trace

#### `summarize-css-parse`
Aggregates CSS parsing time from a trace

#### `summarize-js-eval`
Aggregates JS Eval time from a trace

## Development

To build:

```bash
yarn build
```

To run tests:

```bash
yarn test
```
