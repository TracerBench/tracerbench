// tslint:disable:no-console

import Protocol from 'devtools-protocol';
import * as fs from 'fs';
import * as path from 'path';
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

export async function harTrace(
  url: string,
  outputPath: string,
  additionalBrowserArgs: string[] = [],
  cookies: any = null
) {

  // the saving of the cookies should be a dif command
  // spawn browser > sign-in > done > save cookies

  // passing in the cookies file needs to be more
  // explicit (especially as its pertained to automation)

  // in the instance we are passing in the cookies

  const browser = await createBrowser(additionalBrowserArgs);
  try {
    const client = await getTab(browser.connection);
    const traceHAR = path.join(outputPath, 'trace.har');
    const cookiesJSON = path.join(outputPath, 'cookies.json');

    const requestIds: string[] = [];
    const responses: Protocol.Network.Response[] = [];
    const urls = [url];

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

    cookies = cookies ? cookies : await client.send('Network.getCookies', { urls });
    await setCookies(client, cookies);

    await client.send('Page.enable');

    await Promise.all([
      client.until('Page.loadEventFired'),
      client.send('Page.navigate', { url })
    ]);

    for (let i = 0; i < requestIds.length; i++) {
      const requestId = requestIds[i];
      const response = responses[i];
      const responseBody = await client.send('Network.getResponseBody', { requestId });
      const entry: IEntry = {
        request: { url: response.url },
        response: { content: { text: responseBody.body } },
      };
      archive.log.entries.push(entry);
    }

    fs.writeFileSync(cookiesJSON, JSON.stringify(cookies));
    fs.writeFileSync(traceHAR, JSON.stringify(archive));
  } finally {
    await browser.dispose();
  }
}
