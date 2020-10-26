`tracerbench record-har`
========================

Generates a HAR file from a URL.

* [`tracerbench record-har`](#tracerbench-record-har)
* [`tracerbench record-har:auth`](#tracerbench-record-harauth)

## `tracerbench record-har`

Generates a HAR file from a URL.

```
USAGE
  $ tracerbench record-har

OPTIONS
  --config=config                    Specify an alternative directory rather than the project root for the
                                     tbconfig.json. This explicit config will overwrite all.

  --cookiespath=cookiespath          (required) The path to a JSON file containing cookies to authenticate against the
                                     correlated URL

  --dest=dest                        (required) The destination path for the generated file. Default process.cwd()

  --filename=filename                (required) [default: tracerbench] The filename for the generated file

  --headless                         Run with headless chrome flags

  --marker=marker                    (required) [default: loadEventEnd] The last marker before ending a HAR recording

  --proxy=proxy                      Uses a specified proxy server, overrides system settings. Only affects HTTP and
                                     HTTPS requests.

  --screenshots                      Include chrome screenshots from command execution

  --tbResultsFolder=tbResultsFolder  [default: ./tracerbench-results] The output folder path for all tracerbench results

  --url=url                          (required) URL to visit for record-har, auth, timings & trace commands
```

_See code: [dist/src/commands/record-har/index.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v4.5.0/dist/src/commands/record-har/index.ts)_

## `tracerbench record-har:auth`

Authenticate with a given login URL, username, password and retrieve auth cookies

```
USAGE
  $ tracerbench record-har:auth

OPTIONS
  --config=config                    Specify an alternative directory rather than the project root for the
                                     tbconfig.json. This explicit config will overwrite all.

  --dest=dest                        (required) The destination path for the generated file. Default process.cwd()

  --filename=filename                (required) [default: cookies] The filename for the generated file

  --headless                         Run with headless chrome flags

  --password=password                (required) The password to login to the form

  --proxy=proxy                      Uses a specified proxy server, overrides system settings. Only affects HTTP and
                                     HTTPS requests.

  --screenshots                      Include chrome screenshots from command execution

  --tbResultsFolder=tbResultsFolder  [default: ./tracerbench-results] The output folder path for all tracerbench results

  --url=url                          (required) URL to visit for record-har, auth, timings & trace commands

  --username=username                (required) The username to login to the form
```

_See code: [dist/src/commands/record-har/auth.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v4.5.0/dist/src/commands/record-har/auth.ts)_
