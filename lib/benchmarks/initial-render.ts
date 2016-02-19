import { Benchmark, BenchmarkParams, BenchmarkMeta, ITab } from "../benchmark";
import { TraceEvent } from "../trace/trace_event";

export interface DurationSamples {
  meta: BenchmarkMeta;
  /**
   * samples are in microseconds
   */
  samples: {
    /**
     * Time from navigationStart until paint after ending marker.
     */
    initialRender: number[];
    /**
     * Parse and compile JS duration (wall clock).
     */
    scriptEvalWall: number[];
    /**
     * Parse and compile JS duration (thread clock).
     */
    scriptEvalCPU: number[];
    /**
     * Function execute duration (wall clock).
     */
    functionCallWall: number[];
    /**
     * Function execute duration (thread clock).
     */
    functionCallCPU: number[];
  };
};

export interface InitialRenderBenchmarkParams extends BenchmarkParams {
  /**
   * URL to measure initial render of.
   */
  url: string;
  /**
   * Marker to measure from.
   * Defaults to "navigationStart"
   */
  startMarker?: string;
  /**
   * Marker to mark end of initial render DOM updating.
   */
  endMarker: string;
}

export class InitialRenderBenchmark extends Benchmark<InitialRenderBenchmarkParams, DurationSamples> {
  constructor(params: InitialRenderBenchmarkParams) {
    validateParams(params);
    super(params);
  }

  createResults(meta: BenchmarkMeta): DurationSamples {
    let samples = {
      initialRender: [],
      scriptEvalWall: [],
      scriptEvalCPU: [],
      functionCallWall: [],
      functionCallCPU: []
    };
    return { meta, samples };
  }

  async performIteration(t: ITab, results: DurationSamples, i: number): Promise<void> {
    let url = this.params.url;
    let startMarker = this.params.startMarker;
    let endMarker = this.params.endMarker;

    let tracing = await t.startTracing("blink.user_timing,devtools.timeline");

    await t.navigate(url);

    let trace = await tracing.traceComplete;

    let mainThread = trace.mainProcess.mainThread;
    let startEvent = mainThread.markers.find((event) => event.name === startMarker);
    let endEvent = mainThread.markers.find((event) => event.name === endMarker);

    this.addSample(results, i, mainThread.events, startEvent.ts, endEvent.ts);
  }

  addSample(results: DurationSamples, index: number, events: TraceEvent[], start: number, end: number) {
    let initialRender = 0;
    let scriptEvalWall = 0;
    let scriptEvalCPU = 0;
    let functionCallWall = 0;
    let functionCallCPU = 0;

    eventLoop:
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      if (event.ph !== "X") {
        continue;
      }
      switch (event.name) {
        case "EvaluateScript":
          scriptEvalWall += event.dur;
          scriptEvalCPU  += event.tdur;
          break;
        case "FunctionCall":
          functionCallWall += event.dur;
          functionCallCPU  += event.tdur;
          break;
        case "Paint":
          if (event.ts > end) {
            initialRender = event.ts + event.dur - start;
            break eventLoop;
          }
          break;
      }
    }

    results.samples.initialRender[index] = initialRender;
    results.samples.scriptEvalWall[index] = scriptEvalWall;
    results.samples.scriptEvalCPU[index] = scriptEvalCPU;
    results.samples.functionCallWall[index] = functionCallWall;
    results.samples.functionCallCPU[index] = functionCallCPU;
  }
}

function validateParams(params: InitialRenderBenchmarkParams) {
  if (!params.iterations) {
    params.iterations = 30;
  }
  if (!params.startMarker) {
    params.startMarker = "navigationStart";
  }
  if (!params.url) {
    throw new Error("url is required");
  }
  if (!params.endMarker) {
    throw new Error("endMarker is required");
  }
}
