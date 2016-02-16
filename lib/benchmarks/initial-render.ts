import { Benchmark, IBenchmarkDSL, IBenchmark } from "../benchmark";

const ITERATIONS = 30;

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
    super(name, options);
    this.url = url;
    this.startMarker = startMarker || "navigationStart";
    this.endMarker = endMarker || "firstTextPaint";
  }

  async perform(b: IBenchmarkDSL): Promise<DurationSamples> {
    let url = this.url;
    let startMarker = this.startMarker;
    let endMarker = this.endMarker;
    let samples: number[] = new Array(ITERATIONS);

    await b.clearBrowserCache();
    await b.collectGarbage();

    for (let i = 0; i < ITERATIONS; i++) {
      let tracing = await b.startTracing("blink.user_timing");
      await b.navigate(this.url);
      let trace = await tracing.traceComplete;
      let mainThread = trace.mainProcess.mainThread;
      let startEvent = mainThread.markers.find((event) => event.name === startMarker);
      let endEvent = mainThread.markers.find((event) => event.name === endMarker);

      samples[i] = endEvent.ts - startEvent.ts;

      await b.clearBrowserCache();
      await b.collectGarbage();
    }
    return {
      meta: {
        browserVersion: b.version["Browser"],
      },
      samples: samples
    };
  }
}
