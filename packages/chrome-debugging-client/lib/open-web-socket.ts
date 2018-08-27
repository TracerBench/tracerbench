import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { eventPromise } from "./event-promise";
import { IConnection } from "./types";

export default async function openWebSocket(url: string): Promise<IConnection> {
  const ws = new WebSocket(url);
  await eventPromise(ws, "open", "error");
  return new WebSocketConnection(ws);
}

class WebSocketConnection extends EventEmitter implements IConnection {
  constructor(private ws: WebSocket) {
    super();
    ws.on("message", this.onMessage.bind(this));
    ws.on("error", this.onError.bind(this));
    ws.on("close", this.onClose.bind(this));
  }

  public async send(message: string): Promise<void> {
    await send(this.ws, message);
  }

  public async close(): Promise<any> {
    if (this.ws.readyState === WebSocket.CLOSED) {
      return;
    }
    this.ws.removeAllListeners();
    const closePromise = eventPromise(this.ws, "close", "error");
    this.ws.close();
    await closePromise;
  }

  public async dispose(): Promise<any> {
    try {
      await this.close();
    } catch (err) {
      // ignore err since dispose is called in a finally
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }

  private onMessage(msg: string) {
    this.emit("message", msg);
  }

  private onError(err: Error) {
    this.emit("error", err);
  }

  private onClose() {
    this.emit("close");
    this.ws.removeAllListeners();
  }
}

function send(ws: WebSocket, data: string): Promise<void> {
  return new Promise((resolve, reject) =>
    ws.send(data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }),
  );
}
