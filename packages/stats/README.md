## TracerBench: Automated Chrome Tracing For Benchmarking

[![Build Status](https://travis-ci.org/TracerBench/tracerbench.svg?branch=master)](https://travis-ci.org/TracerBench/tracerbench)

## TracerBench

https://www.tracerbench.com/

### Installation

```sh
yarn add @tracerbench/stats
// or
npm install --save @tracerbench/stats
```

### Usage

```js
'use strict';

const { Stats, convertMSToMicroseconds } = require('@tracerbench/stats');

// sample input (in MS)
const control = [1063, 2112, 1154, 988, 1066, 2111, 1097, 1062, 1033, 1017];
const experiment = [1063, 1092, 1088, 1030, 1089, 1047, 959, 1103, 1453, 1034];

const stats = new Stats({
  // Ensure these are microseconds
  control: control.map(convertMSToMicroseconds),
  experiment: experiment.map(convertMSToMicroseconds),
  name: 'My Experiment'
});

// example output:

stats.name; // => 'My Experiment';
stats.controlMS; // => control input converted to ms
stats.experimentMS; // => experiment input converted to ms
stats.controlSortedMS; // => control input sorted + converted to ms
stats.experimentSortedMS; // => experiment input sorted + converted to ms
stats.sampleCount; // => {control: 10, experiment: 10}
stats.range; // => { min: 959, max: 2112 }
stats.sparkLine; // => {control: "█▁▁▁▁▁▁▁▁▁▂", experiment: "█▁▁▁▁▁▁▁▁▁▁"}
stats.confidenceInterval; // => {min: -46, max: 120, isSig: false}
stats.estimator; // => 9; the median difference between each input pairing (control vs experiment).
stats.sevenFigureSummary; // => {
//   control: {10: 1014, 25: 1040, 50: 1065, 75: 1140, 90: 2111, min: 988, max: 2112}
//   experiment: {10: 1023, 25: 1037, 50: 1076, 75: 1091, 90: 1138, min: 959, max: 1453}
// }
stats.outliers; // => {
//   control: {IQR: 100, lowerOutlier: 890, upperOutlier: 1290, outliers: Array(2)}
//   experiment: {IQR: 54, lowerOutlier: 956, upperOutlier: 1172, outliers: Array(1)}
// }
```

# Statistics Primer

https://www.tracerbench.com/docs/guide/stats-primer

# Stats API

https://github.com/TracerBench/tracerbench/blob/master/packages/stats/markdown/stats.md
