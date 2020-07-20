import { buildModel } from '@tracerbench/trace-model';

import type { TraceBenchmarkOptions } from './create-trace-benchmark';
import createTraceBenchmark from './create-trace-benchmark';
import extractNavigationSample, {
  NavigationSample
} from './metrics/extract-navigation-sample';
import type { Benchmark } from './run';
import injectMarkObserver from './util/inject-mark-observer';
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
      const { start: mark } = markers[markers.length - 1];
      const waitForMark = await injectMarkObserver(page, mark);
      return extractNavigationSample(
        buildModel(
          await trace(async (raceCancel) => {
            // do navigation
            await navigate(page, url, raceCancel);
            await waitForMark(raceCancel);
          })
        ),
        markers
      );
    },
    options
  );
}
