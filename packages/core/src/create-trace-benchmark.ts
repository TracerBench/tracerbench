import { TraceStreamJson } from '@tracerbench/trace-event';
import type { ProtocolConnection, SpawnOptions } from 'chrome-debugging-client';
import { RaceCancellation } from 'race-cancellation';

import createIsolatedPageBenchmark from './create-isolated-page-benchmark';
import type { Benchmark } from './run';
import type { UsingTracingCallback } from './util/run-trace';
import runTrace from './util/run-trace';

function disabledByDefault(category: string): string {
  return `disabled-by-default-${category}`;
}

const defaultCategories = [
  'devtools.timeline',
  'v8.execute',
  'blink.user_timing',
  'loading',
  'latencyInfo'
];

const captureAllDevtoolsTimelineCategories = [
  'devtools.timeline*',
  disabledByDefault('devtools.timeline*')
];

const captureDevtoolsTimelineCategories = [
  'blink.console',
  disabledByDefault('devtools.timeline'),
  disabledByDefault('devtools.timeline.frame'),
  disabledByDefault('devtools.timeline.stack')
];

const captureV8RuntimeStatsCategories = [
  'v8', // includes stats rollup on v8 events but breaks timeline display of CPU profile
  disabledByDefault('v8.runtime_stats')
];

const captureCpuProfileCategories = [
  disabledByDefault('v8.cpu_profiler'),
  disabledByDefault('v8.runtime_stats_sampling')
];

const captureCpuProfilesHiresCategory = disabledByDefault(
  'v8.cpu_profiler.hires'
);

const captureFilmStripCategory = disabledByDefault('devtools.screenshot');
const capturePaintProfileCategories = [
  disabledByDefault('devtools.timeline.layers'),
  disabledByDefault('devtools.timeline.picture'),
  disabledByDefault('blink.graphics_context_annotations')
];

export interface TraceBenchmarkOptions {
  spawnOptions: Partial<SpawnOptions>;
  traceOptions: Partial<TraceOptions>;
}

export interface TraceOptions {
  captureDevtoolsTimeline: boolean;
  captureV8RuntimeStats: boolean;
  captureCpuProfile: boolean;
  captureFilmStrip: boolean;
  capturePaintProfile: boolean;
  additionalCategories: string[];
  additionalTrialCategories: string[];
  saveTraceAs: SaveTraceAsFn;
}

export type TraceFn = (
  usingTracing: UsingTracingCallback
) => Promise<TraceStreamJson>;
export type SampleTraceFn<TSample> = (
  page: ProtocolConnection,
  i: number,
  isTrial: boolean,
  raceCancellation: RaceCancellation,
  trace: TraceFn
) => Promise<TSample>;
export type SaveTraceAsFn = (group: string, iteration: number) => string;

export default function createTraceBenchmark<TSample>(
  group: string,
  sampleTrace: SampleTraceFn<TSample>,
  options: Partial<TraceBenchmarkOptions> = {}
): Benchmark<TSample> {
  const { spawnOptions, traceOptions = {} } = options;
  const { saveTraceAs = () => void 0 } = traceOptions;
  return createIsolatedPageBenchmark(
    group,
    async (page, iteration, isTrial, raceCancellation) =>
      sampleTrace(page, iteration, isTrial, raceCancellation, (usingTracing) =>
        runTrace(
          page,
          getCategories(isTrial, traceOptions),
          raceCancellation,
          usingTracing,
          saveTraceAs(group, iteration)
        )
      ),
    spawnOptions
  );
}

function getCategories(
  isTrial: boolean,
  options: Partial<TraceOptions>
): string[] {
  const categories = ['-*', ...defaultCategories];
  if (isTrial) {
    categories.push(
      ...captureAllDevtoolsTimelineCategories,
      ...captureCpuProfileCategories,
      captureCpuProfilesHiresCategory,
      captureFilmStripCategory,
      ...capturePaintProfileCategories
    );
    if (options.additionalTrialCategories) {
      categories.push(...options.additionalTrialCategories);
    }
  } else {
    // include the basic disabled by default devtools categories
    if (options.captureDevtoolsTimeline) {
      categories.push(...captureDevtoolsTimelineCategories);
    }
    if (options.captureV8RuntimeStats) {
      // this breaks devtools display of CPU profile in dev tools
      categories.push(...captureV8RuntimeStatsCategories);
    }
    if (options.captureCpuProfile) {
      // includes runtime samples
      categories.push(...captureCpuProfileCategories);
    }
    if (options.captureFilmStrip) {
      categories.push(captureFilmStripCategory);
    }
    if (options.capturePaintProfile) {
      categories.push(...capturePaintProfileCategories);
    }
    if (options.additionalCategories) {
      categories.push(...options.additionalCategories);
    }
  }
  return categories;
}
