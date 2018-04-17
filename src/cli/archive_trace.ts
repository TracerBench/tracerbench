import { createSession, IAPIClient, IHTTPClient } from 'chrome-debugging-client';
import { Network, Page } from 'chrome-debugging-client/dist/protocol/tot';
import * as fs from 'fs';
import * as nodeURL from 'url';
import { createClient, ICookie, setCookies } from './trace-utils';
// tslint:disable:no-console

// Represents a subset of a HAR
export interface Archive {
  log: Log;
}

export interface Log {
  entries: Entry[];
}

export interface Request {
  url: string;
}

export interface Response {
  content: Content;
}

export interface Content {
  text: string;
}

export interface Entry {
  request: Request;
  response: Response;
}

export async function harTrace(url: string, cookies: ICookie[]) {
  return await createSession(async session => {
    const client = await createClient(session);
    const page = new Page(client);
    const network = new Network(client);

    let requestIds: string[] = [];
    let responses: Network.Response[] = [];

    network.responseReceived = ({ requestId, response }) => {
      if (response.mimeType === 'text/html' || response.mimeType === 'text/javascript') {
        requestIds.push(requestId);
        responses.push(response);
      }
    };

    let archive: Archive = {
      log: {
        entries: [],
      },
    };

    await network.enable({});

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

    for (let i = 0; i < requestIds.length; i++) {
      let requestId = requestIds[i];
      let _response = responses[i];
      let responseBody  = await network.getResponseBody({ requestId });
      let entry: Entry = {
        request: { url: _response.url },
        response: { content: { text: responseBody.body } },
      };
      archive.log.entries.push(entry);
    }

    let _url = new nodeURL.URL(url);

    fs.writeFileSync(`./${_url.host}.archive`, JSON.stringify(archive));
  });
}
