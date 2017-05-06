import {
  createSessions,
  IAPIClient,
  ISession,
} from "chrome-debugging-client";

export interface IBenchmark<State, Result> {
  name: string;

  /** convenience to run the benchmark, returning result */
  run(iterations: number): Promise<Result>;

  /** alternatively, the following can be invoked manually in order */

  /** setup the benchmark */
  setup(session: ISession): Promise<State>;

  /** run a single iteration of the benchmark */
  perform(session: ISession, state: State, iteration: number): Promise<State>;

  /** finalize the benchmark, returning result */
  finalize(session: ISession, state: State): Promise<Result>;
}

export class Runner<R, S> {
  constructor(private benchmarks: Array<IBenchmark<S, R>>) {
  }

  public async run(iterations: number): Promise<R[]> {
    const benchmarks = this.benchmarks;
    return createSessions(benchmarks.length, async (sessions) => {
      let states = await this.inSequence((benchmark, i) => benchmark.setup(sessions[i]));

      for (let iteration = 0; iteration < iterations; iteration++) {
        states = await this.inSequence((benchmark, i) => benchmark.perform(sessions[i], states[i], iteration));
      }

      return this.inSequence((benchmark, i) => benchmark.finalize(sessions[i], states[i]));
    });
  }

  private async inSequence<T>(callback: (benchmark: IBenchmark<S, R>, i: number) => Promise<T>): Promise<T[]> {
    const benchmarks = this.benchmarks;
    const results: T[] = [];

    for (let i = 0; i < benchmarks.length; i++) {
      results.push(await callback(benchmarks[i], i));
    }

    return results;
  }
}

function shuffle(arr: number[]) {
  // for i from n−1 downto 1 do
  //      j ← random integer such that 0 ≤ j ≤ i
  //      exchange a[j] and a[i]
  for (let i = 0; i < arr.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[j];
    arr[j] = arr[i];
    arr[i] = tmp;
  }
}
