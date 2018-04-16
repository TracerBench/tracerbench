import { createSession, IAPIClient, IHTTPClient } from 'chrome-debugging-client';
import { Network, Page } from 'chrome-debugging-client/dist/protocol/tot';
import { createClient, ICookie, setCookies } from './trace-utils';

// tslint:disable:no-console

export async function harTrace(url: string, cookies: ICookie[]) {
  return await createSession(async session => {
    const client = await createClient(session);
    const page = new Page(client);
    const network = new Network(client);

    network.dataReceived = () => {
      console.log('fire');
    };

    await setCookies(network, cookies);

    await page.enable();

    const pageLoad = new Promise(resolve => {
      page.loadEventFired = evt => {
        console.log(evt);
        resolve();
      };
    });

    await page.navigate({
      url,
    });

    await pageLoad;
  });
}
