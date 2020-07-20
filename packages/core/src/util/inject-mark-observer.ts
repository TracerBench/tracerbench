import { ProtocolConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import { RaceCancellation } from 'race-cancellation';

import isNavigationTimingMark from './is-navigation-timing-mark';

export type WaitForMark = (raceCancellation: RaceCancellation) => Promise<void>;

export default async function injectMarkObserver(
  page: ProtocolConnection,
  mark: string
): Promise<(raceCancelation: RaceCancellation) => Promise<void>> {
  const scriptSource = isNavigationTimingMark(mark)
    ? navigationObserver()
    : observerScript(mark);

  await page.send('Page.addScriptToEvaluateOnLoad', {
    scriptSource
  });

  return (raceCancelation: RaceCancellation) =>
    waitForMark(page, '__tracerbench.done', mark, raceCancelation);
}

function observerScript(mark: string): string {
  return `"use strict";
  var __tracerbench = {
    stop() {},
    done: Promise.resolve(),
  };

  (() => {
    if (self !== top || opener !== null) {
      return;
    }
    __tracerbench.done = new Promise((resolve) => (__tracerbench.stop = resolve));
    (new PerformanceObserver((list, observer) => {
      console.log(JSON.stringify(list.getEntries()));
      if (list.getEntriesByName(${JSON.stringify(mark)}).length > 0) {
        requestIdleCallback(() => {
          __tracerbench.stop();
        });
        observer.disconnect();
      }
    })).observe({ entryTypes: ["mark"] });
  })();`;
}

function navigationObserver(): string {
  return `"use strict";
  var __tracerbench = {
    stop() {},
    done: Promise.resolve(),
  };

  (() => {
    if (self !== top || opener !== null) {
      return;
    }
    self.on('load', () => {
      requestIdleCallback(() => {
        __tracerbench.stop();
      });
    });
  })();`;
}

async function waitForMark(
  page: ProtocolConnection,
  expression: string,
  mark: string,
  raceCancelation: RaceCancellation
): Promise<void> {
  let result: Protocol.Runtime.EvaluateResponse;
  try {
    result = await page.send(
      'Runtime.evaluate',
      {
        expression,
        awaitPromise: true,
        returnByValue: true
      },
      raceCancelation
    );
  } catch (original) {
    throw waitForMarkError(mark, { original });
  }
  const { exceptionDetails } = result;
  if (exceptionDetails !== undefined) {
    throw waitForMarkError(mark, { exceptionDetails });
  }
}

function waitForMarkError(
  mark: string,
  detail: {
    exceptionDetails?: Protocol.Runtime.ExceptionDetails;
    original?: Error;
  }
): Error {
  const error: Error & {
    exceptionDetails?: Protocol.Runtime.ExceptionDetails;
    original?: Error;
  } = new Error(`errored while waiting for ${mark}`);
  error.exceptionDetails = detail.exceptionDetails;
  error.original = detail.original;
  return error;
}
