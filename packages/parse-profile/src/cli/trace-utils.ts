// tslint:disable:no-console

import {
  IAPIClient,
  IDebuggingProtocolClient,
  IResolveOptions,
  ISession
} from 'chrome-debugging-client';
import { Emulation, Network } from 'chrome-debugging-client/dist/protocol/tot';
import { IConditions, networkConditions } from './conditions';
import { filterObjectByKeys } from './utils';

export async function createClient(session: ISession) {
  let browserType;
  let executablePath;
  let additionalArguments = ['--headless', '--crash-dumps-dir=/tmp'];
  let windowSize = {
    width: 320,
    height: 640
  };

  if (process.env.CHROME_BIN) {
    executablePath = process.env.CHROME_BIN;
    browserType = 'exact';
  } else {
    browserType = 'system';
  }

  const browser = await session.spawnBrowser({
    browserType,
    executablePath,
    additionalArguments,
    windowSize
  } as IResolveOptions);
  const tab = await getTab(
    session.createAPIClient('127.0.0.1', browser.remoteDebuggingPort)
  );

  return await session.openDebuggingProtocol(tab.webSocketDebuggerUrl!);
}

async function getTab(apiClient: IAPIClient) {
  const tabs = await apiClient.listTabs();
  // create one tab at about:blank
  const tab = await apiClient.newTab('about:blank');
  // close other tabs
  for (let i = 0; i < tabs.length; i++) {
    await apiClient.closeTab(tabs[i].id);
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  await apiClient.activateTab(tab.id);
  return tab;
}

export async function emulate(
  client: IDebuggingProtocolClient,
  network: Network,
  conditions: IConditions
) {
  const emulation = new Emulation(client);
  if (emulation.canEmulate()) {
    await emulation.setCPUThrottlingRate({ rate: conditions.cpu });
  }

  if (
    conditions.network !== undefined &&
    network.canEmulateNetworkConditions()
  ) {
    let networkCondition = networkConditions[conditions.network];

    if (networkCondition) {
      await network.emulateNetworkConditions(networkCondition);
    } else {
      throw new Error(
        `Could not find network emulation "${conditions.network}"`
      );
    }
  }
}

export async function setCookies(
  network: Network,
  cookies: Network.SetCookieParameters[]
) {
  for (let i = 0; i < cookies.length; i++) {
    let cookie = filterObjectByKeys(cookies[i], ['name', 'value', 'domain']);
    await network.setCookie(cookie);
  }
}
