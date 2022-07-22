import { buildModel } from '@tracerbench/trace-model';

import type { TraceBenchmarkOptions } from './create-trace-benchmark';
import createTraceBenchmark from './create-trace-benchmark';
import extractNavigationSample, {
  NavigationSample
} from './metrics/extract-navigation-sample';
import type { Benchmark } from './run';
import type { WaitForLCP, WaitForMark } from './util/inject-mark-observer';
import injectMarkObserver, {
  injectLCPObserver
} from './util/inject-mark-observer';
import navigate from './util/navigate';
import type { PageSetupOptions } from './util/setup-page';
import setupPage from './util/setup-page';

export interface Marker {
  start: string;
  label: string;
}

export interface NavigationBenchmarkOptions extends TraceBenchmarkOptions {
  pageSetupOptions: Partial<PageSetupOptions>;
}

export default function createTraceNavigationBenchmark(
  group: string,
  url: string,
  markers: Marker[],
  options: Partial<NavigationBenchmarkOptions> = {}
): Benchmark<NavigationSample> {
  if (markers.length === 0) {
    markers.push(
      {
        start: 'navigationStart',
        label: 'load'
      },
      {
        start: 'loadEventEnd',
        label: 'paint'
      }
    );
  }
  return createTraceBenchmark(
    group,
    async (page, _i, _isTrial, raceCancel, trace) => {
      setupPage(page, raceCancel, options.pageSetupOptions);

      let traceEndAtLcp = false;
      let lcpRegex: string | undefined;
      if (options.traceOptions) {
        traceEndAtLcp = options.traceOptions.traceEndAtLcp ?? false;
        lcpRegex = options.traceOptions.lcpRegex;
      }

      let waitForLcp: WaitForLCP;
      let waitForMark: WaitForMark;
      const { start: mark } = markers[markers.length - 1];
      if (traceEndAtLcp) {
        waitForLcp = await injectLCPObserver(page, lcpRegex);
      } else {
        waitForMark = await injectMarkObserver(page, mark);
      }
      return extractNavigationSample(
        buildModel(
          await trace(async (raceCancel) => {
            // do navigation
            await navigate(page, url, raceCancel);
            if (traceEndAtLcp) {
              await waitForLcp(raceCancel);
            } else {
              await waitForMark(raceCancel);
            }
          })
        ),
        markers
      );
    },
    options
  );
}
