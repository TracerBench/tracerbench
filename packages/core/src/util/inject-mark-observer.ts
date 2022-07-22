import { ProtocolConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import { enforcePaintEventFn } from '../trace/utils';
import type { RaceCancellation } from 'race-cancellation';

import isNavigationTimingMark from './is-navigation-timing-mark';

export type WaitForMark = (raceCancellation: RaceCancellation) => Promise<void>;
export type WaitForLCP = (raceCancellation: RaceCancellation) => Promise<void>;

const LCP_EVENT = 'largest-contentful-paint event';

export default async function injectMarkObserver(
  page: ProtocolConnection,
  mark: string,
  variable = '__tracerbench'
): Promise<WaitForMark> {
  const scriptSource = isNavigationTimingMark(mark)
    ? navigationObserver(variable)
    : markObserver(mark, variable);

  await page.send('Page.addScriptToEvaluateOnLoad', {
    scriptSource
  });

  return (raceCancelation: RaceCancellation) =>
    waitForMark(page, variable, mark, raceCancelation);
}

export async function injectLCPObserver(
  page: ProtocolConnection,
  elementPattern?: string,
  variable = '__tracerbenchLCP'
): Promise<WaitForLCP> {
  const scriptSource = lcpObserver(variable, elementPattern);

  await page.send('Page.addScriptToEvaluateOnLoad', {
    scriptSource
  });

  return (raceCancelation: RaceCancellation) =>
    waitForLCP(page, variable, raceCancelation);
}

function lcpObserver(variable: string, elementPattern?: string): string {
  return `"use strict";
    var ${variable} =
      self === top &&
      opener === null &&
      new Promise((resolve) =>
        new PerformanceObserver((entryList, observer) => {
          var entries = entryList.getEntries();
          var pattern = '${elementPattern}';
          for (var i = 0; i < entries.length; i++) {
            if ( pattern !== 'undefined') {
              var elm = entries[i].element.outerHTML;;
              var regex = new RegExp(pattern);
              if (regex.test(elm)){
                requestAnimationFrame(() => {
                  resolve();
                });
              }
            } else {
              requestAnimationFrame(() => {
                resolve();
              });
              break;
            }
          }
          observer.disconnect();
        }).observe({type: 'largest-contentful-paint', buffered: true})
      );`;
}
function markObserver(mark: string, variable: string): string {
  return `"use strict";
      ${enforcePaintEventFn}
    var ${variable} =
      self === top &&
      opener === null &&
      new Promise((resolve) =>
        new PerformanceObserver((records, observer) => {
          if (records.getEntriesByName(${JSON.stringify(mark)}).length > 0) {
            requestAnimationFrame(() => {
              enforcePaintEvent();
              requestIdleCallback(() => {
                resolve();
              });
            });
            observer.disconnect();
          }
        }).observe({ type: "mark" })
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

async function waitForLCP(
  page: ProtocolConnection,
  expression: string,
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
      throw waitForMarkOrEventError(LCP_EVENT, { exceptionDetails });
    }
  } catch (original) {
    if (original instanceof Error) {
      throw waitForMarkOrEventError(LCP_EVENT, { original });
    } else {
      throw original;
    }
  }
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

    const { exceptionDetails } = result;
    if (exceptionDetails !== undefined) {
      throw waitForMarkOrEventError(mark, { exceptionDetails });
    }
  } catch (original) {
    if (original instanceof Error) {
      throw waitForMarkOrEventError(mark, { original });
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
