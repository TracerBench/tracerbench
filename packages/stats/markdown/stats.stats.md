<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@tracerbench/stats](./stats.md) &gt; [Stats](./stats.stats.md)

## Stats class

Statistics class which powers the TracerBench statistical reporter

<b>Signature:</b>

```typescript
export declare class Stats 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(options, unitConverterFn)](./stats.stats._constructor_.md) |  | Constructs a new instance of the <code>Stats</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [buckets](./stats.stats.buckets.md) |  | Bucket\[\] |  |
|  [confidenceInterval](./stats.stats.confidenceinterval.md) |  | [IConfidenceInterval](./stats.iconfidenceinterval.md) |  |
|  [confidenceIntervals](./stats.stats.confidenceintervals.md) |  | { \[key: number\]: [IConfidenceInterval](./stats.iconfidenceinterval.md)<!-- -->; } |  |
|  [control](./stats.stats.control.md) |  | number\[\] |  |
|  [controlSorted](./stats.stats.controlsorted.md) |  | number\[\] |  |
|  [estimator](./stats.stats.estimator.md) |  | number |  |
|  [experiment](./stats.stats.experiment.md) |  | number\[\] |  |
|  [experimentSorted](./stats.stats.experimentsorted.md) |  | number\[\] |  |
|  [name](./stats.stats.name.md) |  | string |  |
|  [outliers](./stats.stats.outliers.md) |  | { control: [IOutliers](./stats.ioutliers.md)<!-- -->; experiment: [IOutliers](./stats.ioutliers.md)<!-- -->; } |  |
|  [populationVariance](./stats.stats.populationvariance.md) |  | { control: number; experiment: number; } |  |
|  [range](./stats.stats.range.md) |  | { min: number; max: number; } |  |
|  [sampleCount](./stats.stats.samplecount.md) |  | { control: number; experiment: number; } |  |
|  [sevenFigureSummary](./stats.stats.sevenfiguresummary.md) |  | { control: [ISevenFigureSummary](./stats.isevenfiguresummary.md)<!-- -->; experiment: [ISevenFigureSummary](./stats.isevenfiguresummary.md)<!-- -->; } |  |
|  [sparkLine](./stats.stats.sparkline.md) |  | { control: string; experiment: string; } |  |

