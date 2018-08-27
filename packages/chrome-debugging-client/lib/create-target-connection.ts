import { EventEmitter } from "events";
import { IConnection, IDebuggingProtocolClient } from "./types";

export default function createTargetConnection(
  client: IDebuggingProtocolClient,
  sessionId: string,
): IConnection {
  return new TargetConnection(client, sessionId);
}

class TargetConnection extends EventEmitter implements IConnection {
  constructor(
    private client: IDebuggingProtocolClient,
    private sessionId: string,
  ) {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onDetach = this.onDetach.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.installListeners();
  }

  public send(message: string): Promise<void> {
    const { sessionId } = this;
    return this.client.send("Target.sendMessageToTarget", {
      message,
      sessionId,
    });
  }

  public close(): Promise<void> {
    const { sessionId } = this;
    return this.client.send("Target.detachFromTarget", { sessionId });
  }

  public async dispose(): Promise<any> {
    const { sessionId } = this;
    if (sessionId !== undefined) {
      try {
        await this.close();
      } catch (err) {
        // ignore in dispose
        // tslint:disable-next-line:no-console
        console.error(err);
      }
      this.sessionId = undefined as any;
      this.uninstallListeners();
    }
  }

  private installListeners() {
    const { client } = this;
    client.on("Target.receivedMessageFromTarget", this.onMessage);
    client.on("Target.detachedFromTarget", this.onDetach);
    client.on("error", this.onError);
    client.on("close", this.onClose);
  }

  private uninstallListeners() {
    const { client } = this;
    client.removeListener("Target.receivedMessageFromTarget", this.onMessage);
    client.removeListener("Target.detachedFromTarget", this.onDetach);
    client.removeListener("error", this.onError);
    client.removeListener("close", this.onClose);
  }

  private onMessage({
    sessionId,
    message,
  }: {
    sessionId: string;
    message: string;
  }) {
    if (this.sessionId === sessionId) {
      this.emit("message", message);
    }
  }

  private onDetach({ sessionId }: { sessionId: string }) {
    if (this.sessionId === sessionId) {
      this.onClose();
    }
  }

  private onClose() {
    this.emit("close");
    this.sessionId = undefined as any;
    this.uninstallListeners();
  }

  private onError(err: Error) {
    this.emit("error", err);
  }
}
