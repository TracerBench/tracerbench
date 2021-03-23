import { Marker, NavigationBenchmarkOptions } from "./create-trace-navigation-benchmark";
import { NavigationSample, PhaseSample } from "./metrics/extract-navigation-sample";
import { Benchmark, BenchmarkSampler } from "./run";
import lighthouse from "lighthouse";

import { launch, LaunchedChrome } from "chrome-launcher";
import { RaceCancellation } from "race-cancellation";

export default function createLighthouseBenchmark(
    group: string,
    url: string,
    _markers: Marker[],
    _options: Partial<NavigationBenchmarkOptions> = {}
): Benchmark<NavigationSample> {
    return {
        group,
        async setup(_raceCancellation) {
            const chrome = await launch({ chromeFlags: ['--headless'] });
            return new LighthouseSampler(chrome, url);
        }
    }
}

class LighthouseSampler implements BenchmarkSampler<NavigationSample> {
    constructor(private chrome: LaunchedChrome, private url: string) {
    }

    async dispose(): Promise<void> {
        await this.chrome.kill();
    }

    async sample(
        _iteration: number,
        _isTrial: boolean,
        _raceCancellation: RaceCancellation
    ): Promise<NavigationSample> {
        const runnerResult = await lighthouse(this.url, { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1366, height: 768 }, logLevel: 'error', output: 'html', onlyCategories: ['performance'], port: this.chrome.port });

        runnerResult.lhr.categories

        const phases: PhaseSample[] = [
            "first-contentful-paint",
            "speed-index",
            "largest-contentful-paint",
            "interactive",
            "total-blocking-time",
            "cumulative-layout-shift",
        ].map(phase => ({
            phase: phase,
            duration: runnerResult.lhr.audits[phase].numericValue * 1000,
            start: 0
        }));

        return {
            metadata: {},
            duration: 0,
            phases
        }
    }
}
