// tslint:disable:no-console
import { ProtocolConnection } from '@tracerbench/protocol-connection';
import { spawnChrome } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import { IConditions, networkConditions } from './conditions';
import { filterObjectByKeys } from './utils';

export async function createBrowser(
  browserArgs: string[] = [],
  headless: boolean = true
) {
  const browser = await spawnChrome({
    additionalArguments: browserArgs,
    stdio: 'inherit',
    chromeExecutable: undefined,
    userDataDir: undefined,
    userDataRoot: undefined,
    url: undefined,
    disableDefaultArguments: false,
    headless,
  });

  return browser;
}

export async function newTab(
  browser: ProtocolConnection,
  url: string = 'about:blank'
) {
  const { targetId } = await browser.send('Target.createTarget', {
    url,
  });
  return await browser.attachToTarget(targetId);
}

export async function getTab(browser: ProtocolConnection) {
  // const tabs = await apiClient.send();
  // create one tab at about:blank
  const { targetId } = await browser.send('Target.createTarget', {
    url: 'about:blank',
  });

  const tab = browser.connection(
    await browser.send('Target.attachToTarget', {
      targetId,
      flatten: true,
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
        targetId: targetInfo.targetId,
      });
    }
  }

  await browser.send('Target.activateTarget', { targetId });

  return tab;
}

export async function emulate(
  client: ProtocolConnection,
  conditions: IConditions
) {
  // tells whether emulation is supported
  const { result: canEmulate } = await client.send('Emulation.canEmulate');
  if (canEmulate) {
    await client.send('Emulation.setCPUThrottlingRate', {
      rate: conditions.cpu,
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
) {
  for (let i = 0; i < cookies.length; i++) {
    const cookie = filterObjectByKeys(cookies[i], ['name', 'value', 'domain']);
    try {
      await page.send('Network.setCookie', cookie);
    } catch (error) {
      throw new Error(
        `${error}. CookieParam format invalid: https://chromedevtools.github.io/devtools-protocol/tot/Network#type-CookieParam.`
      );
    }
  }
}
