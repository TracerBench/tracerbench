import * as http from "http";
import * as zlib from "zlib";
import * as fs from "fs";
import * as mimeTypes from "mime-types";
import * as HAR from "./har";
export { HAR };

/**
 * Delegate for archive server
 */
export interface ServerDelegate {
  /**
   * Create a key for the request that will be used to match
   * the server request to the archived response.
   *
   * Return undefined if you do not want to serve this request.
   */
  keyForArchiveEntry(entry: HAR.Entry): string | undefined;

  /**
   * Create a key from the request to match against the archived requests.
   */
  keyForServerRequest(
    req: http.IncomingMessage
  ): PromiseLike<string | undefined> | string | undefined;

  /**
   * Allows simple text content to be transformed.
   *
   * Not called if entry.response.content.encoding == "base64"
   */
  textFor?(entry: HAR.Entry, key: string, text: string): string;

  /**
   * By default, only 2xx requests with content are responded to.
   *
   * To be more specific "with content" means the HAR was recorded with content.
   * 204 requests still have a content entry with the mimeType but no text key.
   */
  responseFor?(entry: HAR.Entry, key: string): Response | undefined;

  /**
   * Finalize the response before adding it, by default no headers are copied.
   *
   * This hook allows you to set headers (like cache-control, authorization, set-cookie),
   * or return a different Response.
   */
  finalizeResponse?(
    entry: HAR.Entry,
    key: string,
    response: Response
  ): Response;

  /**
   * Called if no response found.
   *
   * Allows fallback, will 404 if headers aren't sent, so you must writeHead if you
   * intend to handle the request.
   */
  missingResponse?(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ): PromiseLike<void> | undefined;
}

export interface Response {
  statusCode: number;
  headers: MapLike<string>;
  body: Buffer | undefined;
  next: Response | undefined;
}

export default class ArchiveServer {
  private responses = createMap<Response>();

  constructor(private delegate: ServerDelegate) {}

  public loadArchive(path: string) {
    this.addArchive(JSON.parse(fs.readFileSync(path, "utf8")));
  }

  public addArchive(har: HAR.Archive) {
    this.addArchiveEntries(har.log.entries);
  }

  public addArchiveEntries(entries: HAR.Entry[]) {
    for (let i = 0; i < entries.length; i++) {
      this.addArchiveEntry(entries[i]);
    }
  }

  public addArchiveEntry(entry: HAR.Entry) {
    let key = this.delegate.keyForArchiveEntry(entry);
    if (!key) return;
    let response = this.buildResponseForArchiveEntry(entry, key);
    if (response) {
      this.addResponse(key, response);
    } else {
      console.error(`unable to build response for key: ${key}`);
    }
  }

  public buildResponseForArchiveEntry(
    entry: HAR.Entry,
    key: string
  ): Response | undefined {
    let { status, content } = entry.response;
    if (content && status >= 200 && status < 300) {
      let { text, encoding, mimeType } = content;
      let body: Buffer | undefined;

      if (text === undefined) {
        body = undefined;
      } else if (mimeTypes.charset(mimeType) === 'UTF-8') {
        text = new Buffer(text, encoding).toString();

        if (this.delegate.textFor) {
          text = this.delegate.textFor(entry, key, text);
        }

        body = new Buffer(text);
      } else {
        body = new Buffer(text, encoding);
      }

      let compress =
        content.compression !== undefined && content.compression > 0;
      let response = this.buildResponse(status, mimeType, body, compress);
      if (this.delegate.finalizeResponse) {
        response = this.delegate.finalizeResponse(entry, key, response);
      }
      return response;
    }
    if (this.delegate.responseFor) {
      return this.delegate.responseFor(entry, key);
    }
  }

  public buildResponse(
    statusCode: number,
    mimeType: string,
    body: Buffer | undefined,
    compress: boolean
  ): Response {
    let headers: MapLike<string>;
    if (body && compress) {
      body = zlib.gzipSync(body, {
        level: 9
      });
      headers = this.buildHeaders(mimeType, body, true);
    } else {
      headers = this.buildHeaders(mimeType, body, false);
    }
    return { statusCode, headers, body, next: undefined };
  }

  public buildHeaders(
    mimeType: string,
    body: Buffer | undefined,
    compressed: boolean
  ): MapLike<string> {
    let headers: MapLike<string> = {
      "Content-Length": "" + (body ? body.byteLength : 0),
      "Content-Type": mimeType
    };
    if (compressed) {
      headers["Content-Encoding"] = "gzip";
    }
    return headers;
  }

  public addResponse(key: string, response: Response) {
    console.log(`add:  ${key}`);
    let res = this.responses[key];
    if (res) {
      while (res.next) {
        res = res.next;
      }
      res.next = response;
    } else {
      this.responses[key] = response;
    }
  }

  public setResponse(key: string, response: Response) {
    console.log(`set:  ${key}`);
    this.responses[key] = response;
  }

  public responseFor(key: string): Response | undefined {
    let res = this.responses[key];
    if (res && res.next) {
      this.responses[key] = res.next;
    }
    return res;
  }

  public async handle(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    let key = await Promise.resolve(this.delegate.keyForServerRequest(request));
    if (key) {
      let res = this.responseFor(key);
      if (res) {
        console.log(`hit:  ${key}`);
        response.writeHead(res.statusCode, res.headers);
        response.end(res.body);
      } else {
        console.log(`miss: ${key}`);
      }
    }

    if (this.delegate.missingResponse && !response.headersSent) {
      await Promise.resolve(this.delegate.missingResponse(request, response));
    }

    if (!response.headersSent) {
      response.writeHead(404);
      response.end();
    }

    console.log(response.statusCode, request.method, request.url);
  }

  public createServer(): http.Server {
    return http.createServer((req, res) => this.handle(req, res));
  }
}

export interface MapLike<T> {
  [key: string]: T | undefined;
}

function createMap<T>(): MapLike<T> {
  let map: MapLike<T> = Object.create(null);
  map["__"] = undefined;
  delete map["__"];
  return map;
}
