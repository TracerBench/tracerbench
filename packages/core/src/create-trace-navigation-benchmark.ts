import { buildModel } from '@tracerbench/trace-model';

import type { TraceBenchmarkOptions } from './create-trace-benchmark';
import createTraceBenchmark from './create-trace-benchmark';
import extractNavigationSample, {
  NavigationSample
} from './metrics/extract-navigation-sample';
import type { Benchmark } from './run';
import type { WaitForMarkOrLCP } from './util/inject-mark-observer';
import injectMarkObserver, {
  injectLCPObserver
} from './util/inject-mark-observer';
import navigate from './util/navigate';
import type { PageSetupOptions } from './util/setup-page';
import setupPage from './util/setup-page';
import {
  LCP_EVENT_NAME,
  uniformLCPEventName,
  isTraceEndAtLCP
} from './trace/utils';

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
        start: LCP_EVENT_NAME,
        label: 'paint'
      }
    );
  }
  return createTraceBenchmark(
    group,
    async (page, _i, _isTrial, raceCancel, trace) => {
      setupPage(page, raceCancel, options.pageSetupOptions);

      const markerList = uniformLCPEventName(markers);
      const mLength = markerList.length;

      const { start: lastMarker } = markerList[mLength - 1];
      const traceEndAtLcp = isTraceEndAtLCP(markerList);
      let priorMarker = 'navigationStart';
      if (traceEndAtLcp && mLength >= 2) {
        priorMarker = markerList[mLength - 2].start;
      }

      let waitTraceEnd: WaitForMarkOrLCP;

      if (traceEndAtLcp) {
        waitTraceEnd = await injectLCPObserver(page, priorMarker);
      } else {
        waitTraceEnd = await injectMarkObserver(page, lastMarker);
      }
      return extractNavigationSample(
        buildModel(
          await trace(async (raceCancel) => {
            // do navigation
            await navigate(page, url, raceCancel);
            await waitTraceEnd(raceCancel);
          })
        ),
        markerList
      );
    },
    options
  );
}
