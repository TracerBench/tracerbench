import type { Protocol } from 'devtools-protocol';

import { createBrowser, getBrowserArgs, getTab, wait } from './utils';
import debug = require('debug');
import { SessionConnection } from 'chrome-debugging-client';

import type { Screenshot } from '../util/interfaces';

type QuerySelectorOptions = {
  nodeId: number;
  selector: string;
};

type AuthClientResponse = {
  cookies: Protocol.Network.Cookie[];
  screenshotData?: Screenshot[];
};

// run with DEBUG=* eg.`DEBUG=* tracerbench record-har:auth`
// run with DEBUG=tracerbench:auth eg.`DEBUG=tracerbench:auth tracerbench record-har:auth`
const debugCallback = debug('tracerbench:auth');

export async function authClient(
  url: string,
  username: string,
  password: string,
  headless = false,
  altBrowserArgs?: string[],
  screenshots?: boolean
): Promise<AuthClientResponse> {
  const browserArgs = getBrowserArgs(altBrowserArgs);
  const browser = await createBrowser(browserArgs, headless);
  const screenshotData: Screenshot[] = [];
  let cookieResponse: Protocol.Network.GetCookiesResponse;
  try {
    const chrome = await getTab(browser.connection);

    // enable Page / DOM / Network / Runtime
    await Promise.all([
      chrome.send('Page.enable'),
      chrome.send('DOM.enable'),
      chrome.send('Network.enable'),
      chrome.send('Runtime.enable')
    ]);

    // clear and disable cache
    await chrome.send('Network.clearBrowserCache');
    // navigate to the url
    await chrome.send('Page.navigate', { url });
    // wait for the app to load
    await chrome.until('Page.loadEventFired');
    // screenshot login page
    if (screenshots) {
      const loginScreenshot = await chrome.send('Page.captureScreenshot');
      screenshotData.push({ data: loginScreenshot.data, name: 'login' });
    }

    // grab the document
    const document = await chrome.send('DOM.getDocument');
    // grab the username nodeId
    const usernameNode = await waitForSelector(document.root.nodeId, '#username', chrome);
    debugCallback('usernameNode %o', usernameNode);

    // set the value for the username
    await chrome.send('DOM.setAttributeValue', {
      nodeId: usernameNode.nodeId,
      name: 'value',
      value: username
    });

    // grab the username nodeId
    const passwordNode = await waitForSelector(document.root.nodeId, '#password', chrome);
    debugCallback('passwordNode %o', passwordNode);

    // set the value for the username
    await chrome.send('DOM.setAttributeValue', {
      nodeId: passwordNode.nodeId,
      name: 'value',
      value: password
    });
    debugCallback('DOM.setAttributeValue %o', 'send');

    await click('button[type=submit]', chrome);
    debugCallback('click submit %o', 'clicked');

    await chrome.until('Page.loadEventFired');
    debugCallback('Page.loadEventFired %o', 'fired');
    // let redirects settle
    await wait(8000);
    debugCallback('await 8000 ms %o', 'done');
    // screenshot of the logged in application
    if (screenshots) {
      const appScreenshot = await chrome.send('Page.captureScreenshot');
      debugCallback('Page.captureScreenshot %o', 'app');
      screenshotData.push({ data: appScreenshot.data, name: 'app' });
    }
    // The list of URLs for which applicable cookies will be fetched
    cookieResponse = await chrome.send('Network.getCookies');
    debugCallback('Network.getCookies %o');

    await Promise.all([
      chrome.send('Network.disable'),
      chrome.send('DOM.disable'),
      chrome.send('Runtime.disable')
    ]);

    await chrome.send('Page.close');
  } catch (e) {
    throw new Error(e);
  } finally {
    if (browser) {
      await browser.dispose();
      debugCallback('browser.dispose()');
    }
  }

  return {
    cookies: cookieResponse.cookies,
    screenshotData
  };
}

/**
 * Get the node based on the selector form
 */

async function waitForSelector(
  rootNodeID: number,
  selector: string,
  chrome: SessionConnection
): Promise<{ nodeId: number; node: Protocol.DOM.ResolveNodeResponse }> {
  const options: QuerySelectorOptions = {
    nodeId: rootNodeID,
    selector
  };
  debugCallback('querySelector %O', options);
  const { nodeId } = await chrome.send('DOM.querySelector', options);
  debugCallback('resolveNode %o', nodeId);
  const node = await chrome.send('DOM.resolveNode', { nodeId });
  return { nodeId, node };
}

/**
 * Click on the submit button selector
 */

async function click(
  selector: string,
  chrome: SessionConnection
): Promise<Protocol.Runtime.RemoteObject | Record<string, unknown>> {
  const remoteObject = await evaluate(selector, chrome);
  if (remoteObject?.objectId) {
    const { exceptionDetails, result } = await chrome.send(
      'Runtime.callFunctionOn',
      {
        functionDeclaration: 'function() { return this.click() }',
        objectId: remoteObject.objectId,
        awaitPromise: true
      }
    );
    return exceptionDetails ? {} : result;
  }

  return {};
}

/**
 * Evaluates the expression
 */
async function evaluate(
  selector: string,
  chrome: SessionConnection
): Promise<Protocol.Runtime.RemoteObject | undefined> {
  const expression = `document.querySelector("${selector}")`;
  const { exceptionDetails, result } = await chrome.send('Runtime.evaluate', {
    expression
  });
  if (exceptionDetails) {
    debugCallback('evaluate', exceptionDetails);
    return undefined;
  }
  return result;
}
