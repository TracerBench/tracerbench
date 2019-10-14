// tslint:disable:no-console

import Protocol from 'devtools-protocol';
import { createBrowser, getTab, setCookies } from './trace-utils';

// Represents a subset of a HAR
export interface IArchive {
  log: ILog;
}

export interface ILog {
  entries: IEntry[];
}

export interface IRequest {
  url: string;
}

export interface IResponse {
  content: IContent;
}

export interface IContent {
  text: string;
}

export interface IEntry {
  request: IRequest;
  response: IResponse;
}

export async function recordHARClient(
  url: string,
  browserArgs: string[],
  cookies: Protocol.Network.CookieParam[]
): Promise<IArchive> {
  const browser = await createBrowser(browserArgs);
  try {
    const client = await getTab(browser.connection);

    const requestIds: string[] = [];
    const responses: Protocol.Network.Response[] = [];

    client.on('Network.responseReceived', ({ requestId, response }) => {
      if (
        response.mimeType === 'text/html' ||
        response.mimeType === 'text/javascript' ||
        response.mimeType === 'application/javascript'
      ) {
        requestIds.push(requestId);
        responses.push(response);
      }
    });

    const archive: IArchive = {
      log: {
        entries: [],
      },
    };

    await client.send('Network.enable');

    await setCookies(client, cookies);

    await client.send('Page.enable');

    await Promise.all([
      client.until('Page.loadEventFired'),
      client.send('Page.navigate', { url }),
    ]);

    for (let i = 0; i < requestIds.length; i++) {
      const requestId = requestIds[i];
      const response = responses[i];
      const responseBody = await client.send('Network.getResponseBody', {
        requestId,
      });
      const entry: IEntry = {
        request: { url: response.url },
        response: { content: { text: responseBody.body } },
      };
      archive.log.entries.push(entry);
    }
    return archive;
  } finally {
    await browser.dispose();
  }
}
