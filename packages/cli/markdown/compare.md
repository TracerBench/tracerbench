`tracerbench compare`
=====================

Compare the performance delta between an experiment and control

* [`tracerbench compare`](#tracerbench-compare)
* [`tracerbench compare:analyze RESULTSFILE`](#tracerbench-compareanalyze-resultsfile)
* [`tracerbench compare:report`](#tracerbench-comparereport)

## `tracerbench compare`

Compare the performance delta between an experiment and control

```
USAGE
  $ tracerbench compare

OPTIONS
  --browserArgs=browserArgs
      (required) [default: 
      --crash-dumps-dir=./tmp,--disable-background-timer-throttling,--disable-dev-shm-usage,--disable-cache,--disable-v8-i
      dle-tasks,--disable-breakpad,--disable-notifications,--disable-hang-monitor,--safebrowsing-disable-auto-update,--ign
      ore-certificate-errors,--v8-cache-options=none] (Default Recommended) Additional chrome flags for the TracerBench 
      render benchmark. TracerBench includes many non-configurable defaults in this category.

  --config=config
      Specify an alternative directory rather than the project root for the tbconfig.json. This explicit config will 
      overwrite all.

  --controlURL=controlURL
      Control URL to visit for compare command

  --cpuThrottleRate=cpuThrottleRate
      (required) [default: 2] CPU throttle multiplier

  --debug
      Debug flag per command. Will output noisy command

  --emulateDevice=iphone-4|iphone-5se|iphone-678|iphone-678-plus|iphone-x|blackberry-z30|nexus-4|nexus-5|nexus-5x|nexus-
  6|nexus-6p|pixel-2|pixel-2-xl|lg-optimus-l70|nokia-n9|nokia-lumia-520|microsoft-lumia-550|microsoft-lumia-950|galaxy-s
  -iii|galaxy-s5|kindle-fire-hdx|ipad-mini|ipad|ipad-pro|blackberry-playbook|nexus-10|nexus-7|galaxy-note-3|galaxy-note-
  ii|laptop-with-touch|laptop-with-hidpi-screen|laptop-with-mdpi-screen
      Emulate a mobile device screen size.

  --emulateDeviceOrientation=horizontal|vertical
      [default: vertical] Expected to be either "vertical" or "horizontal". Dictates orientation of device screen.

  --experimentURL=experimentURL
      Experiment URL to visit for compare command

  --fidelity=fidelity
      (required) [default: low] Directly correlates to the number of samples per trace. eg. test,low,medium,high OR any 
      number between 2-100

  --headless
      Run with headless chrome flags

  --hideAnalysis
      Hide the the analysis output in terminal

  --isCIEnv=isCIEnv
      Provides a drastically slimmed down stdout report for CI workflows. However does NOT hide analysis.

  --markers=markers
      (required) [default: domComplete] User Timing Markers

  --network=none|offline|dialup|slow-2g|2g|slow-edge|edge|slow-3g|dsl|3g|fast-3g|4g|cable|LTE|FIOS
      (required) [default: none] Simulated network conditions.

  --regressionThreshold=regressionThreshold
      [default: 50] The upper limit the experiment can regress slower in milliseconds. eg 50

  --regressionThresholdStat=estimator|ci-lower|ci-upper
      [default: estimator] The statistic which the regression threshold runs against.

  --report
      Generate a PDF report directly after running the compare command.

  --runtimeStats
      Compare command output deep-dive stats during run.

  --sampleTimeout=sampleTimeout
      [default: 30] The number of seconds to wait for a sample.

  --socksPorts=socksPorts
      Specify a socks proxy port as browser option for control and experiment

  --tbResultsFolder=tbResultsFolder
      (required) [default: ./tracerbench-results] The output folder path for all tracerbench results
```

_See code: [dist/src/commands/compare/index.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v5.2.0/dist/src/commands/compare/index.ts)_

## `tracerbench compare:analyze RESULTSFILE`

Generates stdout report from the "tracerbench compare" command output, 'compare.json'

```
USAGE
  $ tracerbench compare:analyze RESULTSFILE

ARGUMENTS
  RESULTSFILE  The "tracerbench compare" command json output file

OPTIONS
  --fidelity=fidelity                                    (required) [default: low] Directly correlates to the number of
                                                         samples per trace. eg. test,low,medium,high OR any number
                                                         between 2-100

  --isCIEnv=isCIEnv                                      (required) Provides a drastically slimmed down stdout report
                                                         for CI workflows. However does NOT hide analysis.

  --jsonReport                                           Include a JSON file from the stdout report

  --regressionThreshold=regressionThreshold              (required) [default: 50] The upper limit the experiment can
                                                         regress slower in milliseconds. eg 50

  --regressionThresholdStat=estimator|ci-lower|ci-upper  [default: estimator] The statistic which the regression
                                                         threshold runs against.
```

_See code: [dist/src/commands/compare/analyze.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v5.2.0/dist/src/commands/compare/analyze.ts)_

## `tracerbench compare:report`

Generates report files (PDF/HTML) from the "tracerbench compare" command output

```
USAGE
  $ tracerbench compare:report

OPTIONS
  --config=config                    Specify an alternative directory rather than the project root for the
                                     tbconfig.json. This explicit config will overwrite all.

  --isCIEnv=isCIEnv                  Provides a drastically slimmed down stdout report for CI workflows. However does
                                     NOT hide analysis.

  --plotTitle=plotTitle              [default: TracerBench] Specify the title of the report pdf/html files.

  --tbResultsFolder=tbResultsFolder  (required) [default: ./tracerbench-results] The output folder path for all
                                     tracerbench results

ALIASES
  $ tracerbench report
```

_See code: [dist/src/commands/compare/report.ts](https://github.com/TracerBench/tracerbench/tree/master/packages/cli/blob/v5.2.0/dist/src/commands/compare/report.ts)_
