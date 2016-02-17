import { Benchmark, ITab, IBenchmark } from "../benchmark";

export class DurationSamples {
  meta: {
    browserVersion: string;
  };
  samples: number[];
}

export class InitialRenderBenchmark extends Benchmark<DurationSamples> {
  url: string;
  startMarker: string;
  endMarker: string;

  constructor(name: string, url: string, startMarker?: string, endMarker?: string, options?: any) {
    super(name, 30, options);
    this.url = url;
    this.startMarker = startMarker || "navigationStart";
    this.endMarker = endMarker || "firstTextPaint";
  }

  createResults(browserVersion): DurationSamples {
    return {
      meta: {
        browserVersion: browserVersion
      },
      samples: []
    };
  }

  async performIteration(t: ITab, results: DurationSamples, i: number): Promise<void> {
    let url = this.url;
    let startMarker = this.startMarker;
    let endMarker = this.endMarker;

    let tracing = await t.startTracing("blink.user_timing");
    await t.navigate(this.url);

    let trace = await tracing.traceComplete;
    let mainThread = trace.mainProcess.mainThread;
    let startEvent = mainThread.markers.find((event) => event.name === startMarker);
    let endEvent = mainThread.markers.find((event) => event.name === endMarker);

    results.samples[i] = endEvent.ts - startEvent.ts;
  }
}
