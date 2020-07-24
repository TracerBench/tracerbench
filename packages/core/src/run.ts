import {
  RaceCancellation,
  throwIfCancelled,
  withRaceTimeout
} from 'race-cancellation';

import gc from './util/gc';

const SETUP_TIMEOUT = 5000;
const SAMPLE_TIMEOUT = 30 * 1000;

export interface Benchmark<TSample> {
  readonly group: string;
  setup(raceCancellation: RaceCancellation): Promise<BenchmarkSampler<TSample>>;
}

export interface BenchmarkSampler<TSample> {
  dispose(): Promise<void>;
  sample(
    iteration: number,
    isTrial: boolean,
    raceCancellation: RaceCancellation
  ): Promise<TSample>;
}

export interface SampleGroup<TSample> {
  group: string;
  samples: TSample[];
}

interface GroupedSamples<TSample> {
  [group: string]: TSample[];
}

/**
 * @param ellasped - time since starting to take samples
 * @param completed - number of samples completed across groups
 * @param remaining - remaining samples across groups
 * @param group - group name of sampler we are about to sample
 * @param iteration - current sample iteration
 */
export type SampleProgressCallback = (
  ellasped: number,
  completed: number,
  remaining: number,
  group: string,
  iteration: number
) => void;

export interface RunOptions {
  setupTimeoutMs: number;
  sampleTimeoutMs: number;
  raceCancellation: RaceCancellation;
}

export default async function run<TSample>(
  benchmarks: Benchmark<TSample>[],
  iterations: number,
  progress: SampleProgressCallback,
  options: Partial<RunOptions> = {}
): Promise<SampleGroup<TSample>[]> {
  checkUniqueNames(benchmarks);
  const samplers: { [group: string]: BenchmarkSampler<TSample> } = {};
  const {
    setupTimeoutMs = SETUP_TIMEOUT,
    sampleTimeoutMs = SAMPLE_TIMEOUT,
    raceCancellation
  } = options;
  let sampleGroups: SampleGroup<TSample>[];
  try {
    await setupSamplers(benchmarks, samplers, setupTimeoutMs, raceCancellation);
    sampleGroups = await takeSamples(
      samplers,
      iterations,
      progress,
      sampleTimeoutMs,
      raceCancellation
    );
  } finally {
    await disposeSamplers(samplers);
  }
  return sampleGroups;
}

async function takeSamples<TSample>(
  samplers: { [group: string]: BenchmarkSampler<TSample> },
  samplesPerGroup: number,
  progress: SampleProgressCallback,
  sampleTimeoutMs: number,
  raceCancellation: RaceCancellation | undefined
): Promise<SampleGroup<TSample>[]> {
  const groups = Object.keys(samplers);
  const sampleCount = (samplesPerGroup + 1) * groups.length;
  const sampleGroups: SampleGroup<TSample>[] = [];
  const groupedSamples: GroupedSamples<TSample> = {};
  const start = Date.now();
  let completed = 0;
  // we take 1 extra iteration we don't keep
  for (let i = 0; i <= samplesPerGroup; i++) {
    // don't bother shuffling throw away iteration
    if (i > 0) {
      shuffle(groups);
    }
    for (const group of groups) {
      progress(
        Date.now() - start,
        completed,
        sampleCount - completed,
        group,
        i
      );
      gc();
      const sampler = samplers[group];
      const sample = await sampleWithTimeout(
        sampler,
        i,
        i === 0,
        sampleTimeoutMs,
        raceCancellation
      );
      if (i === 0) {
        const samples: TSample[] = new Array(samplesPerGroup);
        groupedSamples[group] = samples;
        sampleGroups.push({ group, samples });
      } else {
        groupedSamples[group][i - 1] = sample;
      }
      completed++;
    }
  }
  return sampleGroups;
}

async function setupWithTimeout<TSample>(
  benchmark: Benchmark<TSample>,
  setupTimeoutMs: number,
  raceCancellation?: RaceCancellation
): Promise<BenchmarkSampler<TSample>> {
  const sampler = await withRaceTimeout(
    (raceTimeout) => benchmark.setup(raceTimeout),
    setupTimeoutMs
  )(raceCancellation);
  return throwIfCancelled(sampler);
}

async function sampleWithTimeout<TSample>(
  sampler: BenchmarkSampler<TSample>,
  iteration: number,
  isTrial: boolean,
  sampleTimeoutMs: number,
  raceCancellation?: RaceCancellation
): Promise<TSample> {
  const sample = await withRaceTimeout(
    (raceTimeout) => sampler.sample(iteration, isTrial, raceTimeout),
    sampleTimeoutMs
  )(raceCancellation);
  return throwIfCancelled(sample);
}

async function setupSamplers<TSample>(
  benchmarks: Benchmark<TSample>[],
  samplers: { [group: string]: BenchmarkSampler<TSample> },
  setupTimeoutMs: number,
  raceCancellation?: RaceCancellation
): Promise<void> {
  void (await Promise.all(
    benchmarks.map(async (benchmark) => {
      const sampler = await setupWithTimeout(
        benchmark,
        setupTimeoutMs,
        raceCancellation
      );
      samplers[benchmark.group] = sampler;
    })
  ));
}

async function disposeSamplers<
  TSample,
  TSampler extends BenchmarkSampler<TSample>
>(samplers: { [group: string]: TSampler }): Promise<void> {
  void (await Promise.all(
    Object.keys(samplers).map((group) => samplers[group].dispose())
  ));
}

function shuffle(arr: string[]): void {
  // for i from n−1 downto 1 do
  //      j ← random integer such that 0 ≤ j ≤ i
  //      exchange a[j] and a[i]
  for (let i = arr.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[j];
    arr[j] = arr[i];
    arr[i] = tmp;
  }
}

function checkUniqueNames(benchmarks: Benchmark<unknown>[]): void {
  const set = new Set<string>();
  for (const benchmark of benchmarks) {
    if (set.has(benchmark.group)) {
      throw new Error(`duplicate benchmark group name ${benchmark.group}`);
    }
  }
}
