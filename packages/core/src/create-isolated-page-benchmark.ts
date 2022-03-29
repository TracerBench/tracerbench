import {
  RootConnection,
  SessionConnection,
  spawnChrome,
  SpawnOptions
} from 'chrome-debugging-client';

import type { RaceCancellation } from 'race-cancellation';

export type SamplePageFn<TSample> = (
  page: SessionConnection,
  iteration: number,
  isTrial: boolean,
  raceCancel: RaceCancellation
) => Promise<TSample>;

import { Benchmark, BenchmarkSampler } from './run';

export default function createIsolatedPageBenchmark<TSample>(
  group: string,
  samplePage: SamplePageFn<TSample>,
  options?: Partial<SpawnOptions>
): Benchmark<TSample> {
  return {
    group,
    setup
  };

  async function setup(): Promise<BenchmarkSampler<TSample>> {
    const chrome = spawnChrome(options);
    return {
      sample,
      dispose
    };

    function sample(
      iteration: number,
      isTrial: boolean,
      raceCancellation: RaceCancellation
    ): Promise<TSample> {
      return sampleIsolatedPage(
        chrome.connection,
        samplePage,
        iteration,
        isTrial,
        raceCancellation
      );
    }

    async function dispose(): Promise<void> {
      try {
        // try graceful shutdown
        await chrome.close();
      } catch {
        // TODO log error to debug callback
        await chrome.dispose();
      }
    }
  }
}

function sampleIsolatedPage<TSample>(
  browser: RootConnection,
  samplePage: SamplePageFn<TSample>,
  iteration: number,
  isTrial: boolean,
  raceCancel: RaceCancellation
): Promise<TSample> {
  return usingBrowserContext(
    browser,
    async (browserContextId) => {
      const page = await createPage(browserContextId, browser, raceCancel);
      const sample = await samplePage(page, iteration, isTrial, raceCancel);
      return sample;
    },
    raceCancel
  );
}

async function createPage(
  browserContextId: string,
  browser: RootConnection,
  raceCancel: RaceCancellation
): Promise<SessionConnection> {
  const { targetId } = await browser.send(
    'Target.createTarget',
    {
      url: 'about:blank',
      browserContextId
    },
    raceCancel
  );
  const page = await browser.attachToTarget(targetId, raceCancel);

  const { targetInfos } = await browser.send(
    'Target.getTargets',
    undefined,
    raceCancel
  );

  // close other page targets
  for (const targetInfo of targetInfos) {
    if (targetInfo.type === 'page' && targetInfo.targetId !== targetId) {
      await browser.send(
        'Target.closeTarget',
        {
          targetId: targetInfo.targetId
        },
        raceCancel
      );
    }
  }

  await browser.send('Target.activateTarget', { targetId }, raceCancel);

  return page;
}

async function usingBrowserContext<TSample>(
  browser: RootConnection,
  takeSample: (browserContextId: string) => Promise<TSample>,
  raceCancel: RaceCancellation
): Promise<TSample> {
  const { browserContextId } = await browser.send(
    'Target.createBrowserContext',
    {},
    raceCancel
  );
  try {
    return await takeSample(browserContextId);
  } finally {
    await browser.send('Target.disposeBrowserContext', { browserContextId });
  }
}
