export { default as createIsolatedPageBenchmark } from './create-isolated-page-benchmark';
export type { SamplePageFn } from './create-isolated-page-benchmark';
export { default as createTraceBenchmark } from './create-trace-benchmark';
export type {
  TraceBenchmarkOptions,
  TraceOptions,
  TraceFn,
  SampleTraceFn,
  SaveTraceAsFn
} from './create-trace-benchmark';
export { default as createTraceNavigationBenchmark } from './create-trace-navigation-benchmark';
export type {
  Marker,
  NavigationBenchmarkOptions
} from './create-trace-navigation-benchmark';
export type {
  RuntimeCallStats,
  RuntimeCallStatGroup,
  RuntimeCallStat,
  NavigationSample,
  PhaseSample
} from './metrics/extract-navigation-sample';
export type { PageSetupOptions } from './util/setup-page';
export { default as setupPage } from './util/setup-page';
export { default as injectMarkObserver } from './util/inject-mark-observer';
export { default as navigate } from './util/navigate';
export type { UsingTracingCallback } from './util/run-trace';
export { default as runTrace } from './util/run-trace';
export { default as gc } from './util/gc';
export { default as run } from './run';

export type {
  Benchmark,
  BenchmarkSampler,
  SampleGroup,
  SampleProgressCallback,
  RunOptions
} from './run';
export {
  networkConditions,
  getBrowserArgs,
  IConditions,
  recordHARClient,
  INetworkConditions,
  authClient,
  getNewTab,
  createBrowser,
  getTab
} from './trace';
