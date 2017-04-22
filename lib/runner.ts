import {
  createSession,
  IAPIClient,
  ISession,
  Tab,
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

function createSessions<T>(count: number, callback: (sessions: ISession[]) => T | PromiseLike<T>): Promise<T> {
  if (count === 1) {
    return createSession((session) => callback([session]));
  } else {
    return createSessions(count - 1, (sessions) => createSession((session) => callback([session].concat(sessions))));
  }
}

export class Runner<R> {
  private benchmarks: Array<IBenchmark<any, R>>;

  constructor(benchmarks: Array<IBenchmark<any, R>>) {
    this.benchmarks = benchmarks;
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

  private async inSequence<T>(callback: (benchmark: IBenchmark<any, R>, i: number) => Promise<T>): Promise<T[]> {
    const benchmarks = this.benchmarks;
    const results = [];

    for (let i = 0; i < benchmarks.length; i++) {
      results.push(await callback(benchmarks[i], i));
    }

    return results;
  }
}
