import * as HAR from '@tracerbench/har';
import { IncomingMessage, ServerResponse } from 'http';

export interface Response {
  statusCode: number;
  headers?: MapLike<string> | null;
  body?: Uint8Array | null;
}

export interface MapLike<T> {
  [key: string]: T;
}

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
    req: IncomingMessage
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
    request: IncomingMessage,
    response: ServerResponse
  ): PromiseLike<void> | undefined;
}

export interface CertificateInfo {
  /**
   * Private key in PEM format
   */
  key: string;

  /**
   * Certificate in PEM format
   */
  cert: string;

  /**
   * SPKI Fingerprint
   * base64( sha256( Public key in DER format ) )
   */
  fingerprint: string;
}
