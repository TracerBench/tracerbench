import { ClientRequest, get, IncomingMessage } from "http";
import { eventPromise } from "./event-promise";
import { IHTTPClient } from "./types";

export default function createHTTPClient(
  host: string,
  port: number,
): IHTTPClient {
  return new HTTPClient(host, port);
}

class HTTPClient implements IHTTPClient {
  private host: string;
  private port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  public async get(path: string): Promise<string> {
    const { host, port } = this;
    const request = get({ host, port, path });
    const response = await getResponse(request);
    const statusCode = response.statusCode;
    const body = await readResponseBody(response);
    if (typeof statusCode === "number" && statusCode !== 200) {
      throw new ResponseError(body, statusCode);
    }
    return body;
  }
}

async function getResponse(request: ClientRequest): Promise<IncomingMessage> {
  return eventPromise<IncomingMessage>(request, "response", "error");
}

async function readResponseBody(response: IncomingMessage): Promise<string> {
  let body = "";
  response.setEncoding("utf8");
  response.on("data", chunk => {
    body += chunk;
  });
  await eventPromise(response, "end", "error");
  return body;
}

/* tslint:disable:max-classes-per-file */
class ResponseError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
