import type {
  ChromeWithPipeConnection,
  ProtocolConnection,
  SessionConnection
} from 'chrome-debugging-client';
import { spawnChrome } from 'chrome-debugging-client';
import type { Protocol } from 'devtools-protocol';
import { dirSync } from 'tmp';

import { IConditions, networkConditions } from './conditions';
import { Marker } from '../create-trace-navigation-benchmark';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function getBrowserArgs(explictArgs?: string[]): string[] {
  interface IViewOptions {
    windowSize: {
      width: number;
      height: number;
    };
    deviceScaleFactor: number;
    userAgent: string | undefined;
  }

  const tmpDir = dirSync({
    unsafeCleanup: true
  });

  const options: IViewOptions = {
    windowSize: {
      width: 1280,
      height: 800
    },
    deviceScaleFactor: 0,
    userAgent: undefined
  };

  let defaultFlags = [
    `--crash-dumps-dir=${tmpDir.name}`,
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-component-extensions-with-background-pages',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=NetworkPrediction',
    '--disable-features=site-per-process,TranslateUI,BlinkGenPropertyTrees',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-renderer-backgrounding',
    '--disable-sync',
    '--disable-translate',
    '--disable-v8-idle-tasks',
    `--device-scale-factor=${options.deviceScaleFactor}`,
    '--metrics-recording-only',
    '--no-pings',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-experiments',
    '--no-sandbox',
    '--password-store=basic',
    '--safebrowsing-disable-auto-update',
    '--use-mock-keychain',
    `--user-agent=${options.userAgent}`,
    `--user-data-dir=${tmpDir.name}`,
    '--v8-cache-options=none',
    `--window-size=${options.windowSize.width},${options.windowSize.height}`
  ];

  defaultFlags = explictArgs ? explictArgs.concat(defaultFlags) : defaultFlags;

  return defaultFlags;
}

export async function wait(dur: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, dur);
  });
}

export function filterObjectByKeys(
  obj: { [key: string]: any },
  keyArray: string[]
): { [key: string]: any } {
  const o = Object.assign({}, obj);
  const k = Object.keys(o);
  k.forEach((c) => {
    if (!keyArray.includes(c)) {
      delete o[c];
    }
  });

  return o;
}

export async function createBrowser(
  browserArgs: string[] = [],
  headless = false
): Promise<ChromeWithPipeConnection> {
  const browser = await spawnChrome({
    additionalArguments: browserArgs,
    stdio: headless ? 'ignore' : 'inherit',
    chromeExecutable: undefined,
    userDataDir: undefined,
    userDataRoot: undefined,
    url: undefined,
    disableDefaultArguments: false,
    headless
  });

  return browser;
}

export async function getNewTab(
  browser: ProtocolConnection,
  url = 'about:blank'
): Promise<SessionConnection> {
  const { targetId } = await browser.send('Target.createTarget', {
    url
  });
  return await browser.attachToTarget(targetId);
}

export async function getTab(
  browser: ProtocolConnection
): Promise<SessionConnection> {
  // const tabs = await apiClient.send();
  // create one tab at about:blank
  const { targetId } = await browser.send('Target.createTarget', {
    url: 'about:blank'
  });

  const tab = browser.connection(
    await browser.send('Target.attachToTarget', {
      targetId,
      flatten: true
    })
  );

  if (!tab) {
    throw Error('failed to attach to target');
  }

  // close other page targets
  const { targetInfos } = await browser.send('Target.getTargets');
  for (const targetInfo of targetInfos) {
    if (targetInfo.type === 'page' && targetInfo.targetId !== targetId) {
      await browser.send('Target.closeTarget', {
        targetId: targetInfo.targetId
      });
    }
  }

  await browser.send('Target.activateTarget', { targetId });

  return tab;
}

export async function emulate(
  client: ProtocolConnection,
  conditions: IConditions
): Promise<void> {
  // tells whether emulation is supported
  const { result: canEmulate } = await client.send('Emulation.canEmulate');
  if (canEmulate) {
    await client.send('Emulation.setCPUThrottlingRate', {
      rate: conditions.cpu
    });
  } // throw error if configured to emulate and returned false

  // needs to ensure Network.enable
  const { result: canEmulateNetworkConditions } = await client.send(
    'Network.canEmulateNetworkConditions'
  );
  if (conditions.network !== undefined && canEmulateNetworkConditions) {
    const networkCondition = networkConditions[conditions.network];

    if (networkCondition) {
      await client.send('Network.emulateNetworkConditions', networkCondition);
    } else {
      throw new Error(
        `Could not find network emulation "${conditions.network}"`
      );
    }
  }
}

export async function setCookies(
  page: ProtocolConnection,
  cookies: Protocol.Network.CookieParam[]
): Promise<void> {
  for (let i = 0; i < cookies.length; i++) {
    const cookie = filterObjectByKeys(cookies[i], ['name', 'value', 'domain']);
    try {
      await page.send(
        'Network.setCookie',
        cookie as Protocol.Network.CookieParam
      );
    } catch (error) {
      throw new Error(
        `${error}. CookieParam format invalid: https://chromedevtools.github.io/devtools-protocol/tot/Network#type-CookieParam.`
      );
    }
  }
}

// adopted from https://github.com/Modernizr/Modernizr/blob/master/test/browser/src/mq.js#L29
export const enforcePaintEventFn = `
function enforcePaintEvent() {

  const docElem = document.documentElement;
  const refNode = docElem.firstElementChild;
  const fakeBody = document.createElement('body');
  const div = document.createElement('div');

  div.id = 'mq-test-1';
  div.style.cssText = 'position:absolute;top:-100em';
  fakeBody.style.background = 'none';
  fakeBody.appendChild(div);
  div.innerHTML = '&shy;<style> #mq-test-1 { width: 42px; }</style>';
  docElem.insertBefore(fakeBody, refNode);

  try {
      return div.offsetWidth === 42;
  } finally {
      fakeBody.removeChild(div);
      docElem.removeChild(fakeBody);
  }

}
`;

export const LCP_EVENT_NAME = 'largestContentfulPaint::Candidate';
export const LCP_EVENT_NAME_ALIAS = 'largestContentfulPaint';

/**
 * check if the last marker.start is largestContentfulPaint:Candidate
 * That means user want trace to end at LCP
 * @param markers - markers array
 * @returns true if markers end at LCP event
 */
export function isTraceEndAtLCP(markers: Marker[]): boolean {
  if (markers.length > 0) {
    const { start: marker } = markers[markers.length - 1];
    return marker === LCP_EVENT_NAME;
  } else {
    return false;
  }
}

/**
 * if the config or commandline has marker name as largestContentfulPaint
 * convert it to the actual event name largestContentfulPaint:Candidate
 * return a new marker list, Keep input markers immutable.
 * @param markers - marker array
 * @returns renamed marker array
 */
export function uniformLCPEventName(markers: Marker[]): Marker[] {
  const renamedMarkers: Marker[] = [];
  let renamedMarker: Marker;
  markers.forEach((marker: Marker) => {
    if (marker.start === LCP_EVENT_NAME_ALIAS) {
      renamedMarker = {
        start: LCP_EVENT_NAME,
        label: marker.label
      };
    } else {
      renamedMarker = marker;
    }
    renamedMarkers.push(renamedMarker);
  });

  return renamedMarkers;
}

/**
 * check if an event name is largestContentfulPaint:Candidate
 * @param marker - event name
 * @returns - true or false
 */
export function isLCPEvent(marker: string): boolean {
  return marker === LCP_EVENT_NAME;
}
