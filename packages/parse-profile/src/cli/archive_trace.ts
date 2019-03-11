// tslint:disable:no-console

import { createSession } from 'chrome-debugging-client';
import { Network, Page } from 'chrome-debugging-client/dist/protocol/tot';
const fs = require('fs-extra');
import { createClient, setCookies } from './trace-utils';
import { removeFilename } from './utils';

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

    let requestIds: string[] = [];
    let responses: Network.Response[] = [];
    let urls = [url];

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

    let har: Archive = {
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
      let requestId = requestIds[i];
      let _response = responses[i];
      let responseBody = await network.getResponseBody({ requestId });
      let entry: Entry = {
        request: { url: _response.url },
        response: { content: { text: responseBody.body } }
      };
      har.log.entries.push(entry);
    }

    if (!fs.existsSync(cookiesPath)) fs.writeFileSync(cookiesPath, JSON.stringify(cookies));
    fs.ensureDirSync(removeFilename(outputPath));
    fs.writeFileSync(outputPath, JSON.stringify(har));
  });
}
