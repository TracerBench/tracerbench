`tracerbench profile`
=====================

Parses a CPU profile with asset and marker timings

* [`tracerbench profile HARPATH`](#tracerbench-profile-harpath)

## `tracerbench profile HARPATH`

Parses a CPU profile with asset and marker timings

```
USAGE
  $ tracerbench profile HARPATH

ARGUMENTS
  HARPATH  The path to the HTTP Archive File (HAR)

OPTIONS
  --cookiespath=cookiespath
      (required) The path to a JSON file containing cookies to authenticate against the correlated URL

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 2] CPU throttle multiplier

  --network=none|offline|dialup|slow-2g|2g|slow-edge|edge|slow-3g|dsl|3g|fast-3g|4g|cable|LTE|FIOS
      [default: none] Simulated network conditions.

  --tbResultsFolder=tbResultsFolder
      (required) [default: ./tracerbench-results] The output folder path for all tracerbench results

  --url=url
      (required) URL to visit for record-har, auth, timings & trace commands

ALIASES
  $ tracerbench trace
```

_See code: [dist/src/commands/profile.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v5.2.0/dist/src/commands/profile.ts)_
