`tracerbench record-har`
========================

Generates a HAR file from a URL.

* [`tracerbench record-har`](#tracerbench-record-har)

## `tracerbench record-har`

Generates a HAR file from a URL.

```
USAGE
  $ tracerbench record-har

OPTIONS
  --config=config            Specify an alternative directory rather than the project root for the tbconfig.json. This
                             explicit config will overwrite all.

  --cookiespath=cookiespath  (required) The path to a JSON file containing cookies to authenticate against the
                             correlated URL

  --dest=dest                (required) The destination path for the generated file

  --filename=filename        (required) [default: tracerbench] The filename for the generated file

  --headless                 Run with headless chrome flags

  --marker=marker            (required) [default: loadEventEnd] The last marker before ending a HAR recording

  --url=url                  (required) URL to visit for record-har, timings & trace commands
```

_See code: [dist/src/commands/record-har.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v3.1.1/dist/src/commands/record-har.ts)_
