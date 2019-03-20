// tslint:disable:no-console

import { createSession } from 'chrome-debugging-client';
import { Network, Page } from 'chrome-debugging-client/dist/protocol/tot';
import * as fs from 'fs';

import { createClient, setCookies } from './trace-utils';

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
  outputPath: string = './trace.har',
  cookies: any = null
) {
  return await createSession(async session => {
    const client = await createClient(session);
    const page = new Page(client);
    const network = new Network(client);
    const cookiesPath = './cookies.json';

    const requestIds: string[] = [];
    const responses: Network.Response[] = [];
    const urls = [url];

    network.responseReceived = ({ requestId, response }) => {
      if (
        response.mimeType === 'text/html' ||
        response.mimeType === 'text/javascript' ||
        response.mimeType === 'application/javascript'
      ) {
        requestIds.push(requestId);
        responses.push(response);
      }
    };

    const archive: IArchive = {
      log: {
        entries: []
      }
    };

    await network.enable({});

    cookies = cookies ? cookies : await network.getCookies({ urls });
    await setCookies(network, cookies);

    await page.enable();

    const pageLoad = new Promise(resolve => {
      page.loadEventFired = evt => {
        console.log(evt);
        resolve();
      };
    });

    await page.navigate({
      url
    });

    await pageLoad;

    for (let i = 0; i < requestIds.length; i++) {
      const requestId = requestIds[i];
      const response = responses[i];
      const responseBody = await network.getResponseBody({ requestId });
      const entry: IEntry = {
        request: { url: response.url },
        response: { content: { text: responseBody.body } }
      };
      archive.log.entries.push(entry);
    }

    fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
    fs.writeFileSync(outputPath, JSON.stringify(archive));
  });
}
