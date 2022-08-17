import { ProtocolConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import { enforcePaintEventFn } from '../trace/utils';
import type { RaceCancellation } from 'race-cancellation';

import isNavigationTimingMark from './is-navigation-timing-mark';

export type WaitForMarkOrLCP = (
  raceCancellation: RaceCancellation
) => Promise<void>;

const LCP_EVENT_MSG = 'largest-contentful-paint event';

export default async function injectMarkObserver(
  page: ProtocolConnection,
  mark: string,
  variable = '__tracerbench'
): Promise<WaitForMarkOrLCP> {
  const scriptSource = isNavigationTimingMark(mark)
    ? navigationObserver(variable)
    : markObserver(mark, variable);

  await page.send('Page.addScriptToEvaluateOnLoad', {
    scriptSource
  });

  return (raceCancelation: RaceCancellation) =>
    waitForMarkOrLCP(page, variable, mark, raceCancelation);
}

export async function injectLCPObserver(
  page: ProtocolConnection,
  priorMarker?: string,
  variable = '__tracerbenchLCP'
): Promise<WaitForMarkOrLCP> {
  const scriptSource = lcpObserver(variable, priorMarker);

  await page.send('Page.addScriptToEvaluateOnLoad', {
    scriptSource
  });

  return (raceCancelation: RaceCancellation) =>
    waitForMarkOrLCP(page, variable, LCP_EVENT_MSG, raceCancelation);
}

function lcpObserver(variable: string, priorMarker?: string): string {
  return `"use strict";
    var __tracerbenchPriorMarkerObserved = (typeof ${priorMarker} === 'undefined')? true : false;
    if (!__tracerbenchPriorMarkerObserved){
      new PerformanceObserver((entryList, observer) => {
        if (!__tracerbenchPriorMarkerObserved) {
          var markerEntries = entryList.getEntriesByName(${priorMarker});
          if (markerEntries.length > 0) {
            __tracerbenchPriorMarkerObserved = true;
            observer.disconnect();
          }
        }
      }).observe({ type: 'mark' });
    }
    var ${variable} =
      self === top &&
      opener === null &&
      new Promise((resolve) =>
        new PerformanceObserver((entryList, observer) => {
          var lcpEntries = entryList.getEntriesByType('largest-contentful-paint');
          if (lcpEntries.length > 0 && __tracerbenchPriorMarkerObserved) {
            requestAnimationFrame(() => {
              resolve();
            });
          }
          observer.disconnect();
        }).observe({ type: 'largest-contentful-paint', buffered: true })
      );`;
}
function markObserver(mark: string, variable: string): string {
  return `"use strict";
    var ${variable} =
      self === top &&
      opener === null &&
      new Promise((resolve) =>
        new PerformanceObserver((records, observer) => {
          if (records.getEntriesByName(${JSON.stringify(mark)}).length > 0) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve();
              });
            });
            observer.disconnect();
          }
        }).observe({ type: 'mark' })
      );`;
}

function navigationObserver(variable: string): string {
  return `"use strict";
  ${enforcePaintEventFn}
var ${variable} =
  self === top &&
  opener === null &&
  new Promise((resolve) =>
    new PerformanceObserver((records, observer) => {
      if (records.getEntries().length > 0) {
        requestAnimationFrame(() => {
          enforcePaintEvent();
          requestIdleCallback(() => {
            resolve();
          });
        });
        observer.disconnect();
      }
    }).observe({ type: "navigation" })
  );`;
}

async function waitForMarkOrLCP(
  page: ProtocolConnection,
  expression: string,
  waitType: string,
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

    const { exceptionDetails } = result;
    if (exceptionDetails !== undefined) {
      throw waitForMarkOrEventError(waitType, { exceptionDetails });
    }
  } catch (original) {
    if (original instanceof Error) {
      throw waitForMarkOrEventError(waitType, { original });
    } else {
      throw original;
    }
  }
}

interface ErrorDetail {
  exceptionDetails?: Protocol.Runtime.ExceptionDetails;
  original?: Error;
}

function waitForMarkOrEventError(
  target: string,
  { original, exceptionDetails }: ErrorDetail
): Error {
  let message = `errored while waiting for ${target}`;
  if (exceptionDetails) {
    message += `: ${exceptionDetails.text}`;
  }
  if (original) {
    message += `: ${original.message}`;
  }
  const error: Error & {
    exceptionDetails?: Protocol.Runtime.ExceptionDetails;
    original?: Error;
  } = new Error(message);
  error.exceptionDetails = exceptionDetails;
  error.original = original;
  return error;
}
