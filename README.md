# parse-profile
A suite of CLI tools for generating and parsing CPUProfile's.

## What's Inside

### `trace`
Does an automated trace of a webpage. Also takes network conditioner and CPU throttling options.

### `create-archive`
Creates a subset of a HAR file for gather resource information and application version number.

### `parse-profile`
Parses a CPU profile and aggregates time across heuristics. Can be vertically sliced with event names.

### `timeline`
Parses a CPU profile and displays interesting events in chronological order

### `list-functions`
Lists all the functions and source locations from a trace

### `summarize-css-parse`
Aggregates CSS parsing time from a trace

### `summarize-js-eval`
Aggregates JS Eval time from a trace

## Usage

The primary usage is to `trace`, `create-archive`, `parse-profile`.

# Example
```bash
./bin/trace --url https://www.linkedin.com/feed/ --network 4g --cpu 4
./bin/create-archive --url https://www.linkedin.com/feed/
./bin/parse-profile --report ./heuristics --event mark_meaningful_paint_end
```