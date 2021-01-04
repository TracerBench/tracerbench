import { IncomingMessage } from "http";
import { pipeline } from "stream";
import * as https from "https";

export async function getJSON(url: string) {
  const response = await getResponse(url);
  const body = await readBody(response);
  return JSON.parse(body);
}

export function getResponse(url: string) {
  return new Promise<IncomingMessage>((resolve, reject) => {
    const req = https.get(url, resolve);
    req.once("error", reject);
  });
}

export function waitForFinish(readable: NodeJS.ReadableStream, writable: NodeJS.WritableStream) {
  return new Promise<void>((resolve, reject) => {
    pipeline(readable, writable, (err) => {
      if (err) reject(err);
      else resolve();
    })
  });
}

export function readBody(res: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", chunk => (body += chunk));
    res.once("error", reject);
    res.once("end", () => resolve(body));
    return body;
  });
}
