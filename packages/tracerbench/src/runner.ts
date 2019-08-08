export interface IBenchmark<State, Result> {
  name: string;

  /** convenience to run the benchmark, returning result */
  run(iterations: number): Promise<Result>;

  /** alternatively, the following can be invoked manually in order */

  /** setup the benchmark */
  setup(): Promise<State>;

  /** run a single iteration of the benchmark */
  perform(state: State, iteration: number): Promise<State>;

  /** finalize the benchmark, returning result */
  finalize(state: State): Promise<Result>;

  dispose(): Promise<void>;
}

export class Runner<R, S> {
  constructor(private benchmarks: Array<IBenchmark<S, R>>) {}

  /**
   * Shuffle when to run the benchmarks
   *
   * @param iterations - Number of iterations to run for each Benchmark
   * @param logger - If CLI command is using this, a log function (this.log) can be passed and will be used to indicate progress
   */
  public async run(iterations: number, logger?: (msg: string) => void): Promise<R[]> {
    try {
      let states = await this.inSequence(benchmark => benchmark.setup());

      for (let iteration = 0; iteration < iterations; iteration++) {
        states = await this.shuffled((benchmark, i) =>
          benchmark.perform(states[i], iteration)
        );

        if (logger) {
          logger(`Finished ${iteration} of ${iterations} runs.`);
        }
      }

      return this.inSequence((benchmark, i) => benchmark.finalize(states[i]));
    } finally {
      for (const benchmark of this.benchmarks) {
        await benchmark.dispose();
      }
    }
  }

  private async inSequence<T>(
    callback: (benchmark: IBenchmark<S, R>, i: number) => Promise<T>
  ): Promise<T[]> {
    const benchmarks = this.benchmarks;
    const results: T[] = [];

    for (let i = 0; i < benchmarks.length; i++) {
      results.push(await callback(benchmarks[i], i));
    }

    return results;
  }

  private async shuffled<T>(
    callback: (benchmark: IBenchmark<S, R>, i: number) => Promise<T>
  ): Promise<T[]> {
    const benchmarks = this.benchmarks;
    const results: T[] = new Array(benchmarks.length);
    const indices = benchmarks.map((_, i) => i);

    shuffle(indices);

    for (const index of indices) {
      results[index] = await callback(benchmarks[index], index);
    }

    return results;
  }
}

function shuffle(arr: number[]) {
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
