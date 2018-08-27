import { EventEmitter } from "events";
import { IConnection, IDebuggingProtocolClient } from "./types";

interface ICommandRequest {
  id: number;
  method: string;
  params: any;

  response: Promise<ICommandResponseMessage>;
}

interface IEventMessage {
  method: string;
  params: any;
}

interface ISuccessResponseMessage {
  id: number;
  result: any;
}

interface IResponseError {
  code: number;
  message: string;
  data?: string;
}

interface IErrorResponseMessage {
  id: number;
  error: IResponseError;
}

interface IMessage
  extends IEventMessage,
    ISuccessResponseMessage,
    IErrorResponseMessage {}

interface ICommandResponseMessage
  extends ISuccessResponseMessage,
    IErrorResponseMessage {}

export default function createDebuggingProtocolClient(
  connection: IConnection,
): IDebuggingProtocolClient {
  return new DebuggingProtocol(connection);
}

/* tslint:disable:max-classes-per-file */
class DebuggingProtocol extends EventEmitter
  implements IDebuggingProtocolClient {
  private seq = 0;
  private pendingRequests = new Map<number, CommandRequest>();

  constructor(private connection: IConnection) {
    super();
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);

    this.connection.on("message", this.onMessage);
    this.connection.on("error", this.onError);
    this.connection.on("close", this.onClose);
  }

  public async send(method: string, params?: any): Promise<any> {
    const request = this.createRequest(method, params);
    try {
      const [, response] = await Promise.all([
        this.sendRequest(request),
        this.getResponse(request),
      ]);
      return response;
    } finally {
      this.deleteRequest(request);
    }
  }

  public onMessage(data: string) {
    try {
      const msg: IMessage = JSON.parse(data);
      if (msg.id !== undefined) {
        const request = this.pendingRequests.get(msg.id);
        if (request) {
          request.resolve(msg);
        }
      } else {
        this.emit(msg.method, msg.params);
      }
    } catch (err) {
      this.onError(err);
    }
  }

  public close(): Promise<void> {
    return this.connection.close();
  }

  public onClose() {
    this.clearPending(new Error("socket disconnect"));
    this.emit("close");
  }

  public onError(err: Error) {
    this.clearPending(err);
    this.emit("error", err);
  }

  public async dispose() {
    this.connection.removeListener("message", this.onMessage);
    this.connection.removeListener("error", this.onError);
    this.connection.removeListener("close", this.onClose);
  }

  private createRequest(method: string, params: any): ICommandRequest {
    const req = new CommandRequest(this.seq++, method, params);
    this.pendingRequests.set(req.id, req);
    return req;
  }

  private async getResponse(request: ICommandRequest) {
    const response = await request.response;

    if (response.error) {
      throw protocolError(response.error);
    }

    return response.result;
  }

  private sendRequest(req: ICommandRequest): Promise<void> {
    return this.connection.send(JSON.stringify(req));
  }

  private deleteRequest(req: ICommandRequest): void {
    this.pendingRequests.delete(req.id);
  }

  private clearPending(err: Error) {
    if (this.pendingRequests.size) {
      this.pendingRequests.forEach(req => {
        req.reject(err);
      });
      this.pendingRequests.clear();
    }
  }
}

export type ProtocolError = Error & { code: number };

class CommandRequest implements ICommandRequest {
  public response: Promise<ICommandResponseMessage>;
  public resolve: (res: ICommandResponseMessage) => void;
  public reject: (reason: any) => void;

  constructor(public id: number, public method: string, public params: any) {
    this.response = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

function protocolError({ message, code, data }: IResponseError): ProtocolError {
  const msg = data ? `${message}:${data}` : message;
  const err = new Error(msg);
  return Object.assign(err, { code });
}
