import createAPIClient from "./create-api-client";
import createDebuggingProtocolClient from "./create-debugging-protocol-client";
import createHTTPClient from "./create-http-client";
import createTargetConnection from "./create-target-connection";
import createTmpDir from "./create-tmpdir";
import Disposables from "./disposables";
import openWebSocket from "./open-web-socket";
import resolveBrowser from "./resolve-browser";
import spawnBrowser from "./spawn-browser";
import {
  IAPIClient,
  IBrowserProcess,
  IConnection,
  IDebuggingProtocolClient,
  IDisposable,
  IResolveOptions,
  ISession,
  ISpawnOptions,
} from "./types";

export type SessionCallback<T> = (session: ISession) => PromiseLike<T> | T;

export function createSession<T>(cb: SessionCallback<T>): Promise<T>;
export function createSession(): ISession;
export function createSession(
  cb?: SessionCallback<any>,
): Promise<any> | ISession {
  if (cb === undefined) {
    return new Session();
  }
  return usingSession(cb);
}

async function usingSession(cb: SessionCallback<any>) {
  const session = new Session();
  try {
    return await cb(session);
  } finally {
    await session.dispose();
  }
}

class Session implements ISession {
  private disposables = new Disposables();

  public async spawnBrowser(
    options?: IResolveOptions & ISpawnOptions,
  ): Promise<IBrowserProcess> {
    const executablePath = resolveBrowser(options);
    const tmpDir = await createTmpDir(options && options.userDataRoot);
    this.disposables.add(tmpDir);
    const browserProcess = await spawnBrowser(
      executablePath,
      tmpDir.path,
      options,
    );
    this.disposables.add(browserProcess);
    return browserProcess;
  }

  public createAPIClient(host: string, port: number): IAPIClient {
    return createAPIClient(createHTTPClient(host, port));
  }

  public async openDebuggingProtocol(
    webSocketDebuggerUrl: string,
  ): Promise<IDebuggingProtocolClient> {
    return this.createDebuggingProtocolClient(
      this.addDisposable(await openWebSocket(webSocketDebuggerUrl)),
    );
  }

  public async attachToTarget(
    browserClient: IDebuggingProtocolClient,
    targetId: string,
  ): Promise<IDebuggingProtocolClient> {
    const { sessionId } = await browserClient.send<{ sessionId: string }>(
      "Target.attachToTarget",
      {
        targetId,
      },
    );
    return this.createTargetSessionClient(browserClient, sessionId);
  }

  public createTargetSessionClient(
    browserClient: IDebuggingProtocolClient,
    sessionId: string,
  ) {
    const connection = this.addDisposable(
      createTargetConnection(browserClient, sessionId),
    );
    return this.createDebuggingProtocolClient(connection);
  }

  public createSession(): ISession {
    return this.addDisposable(new Session());
  }

  public dispose() {
    return this.disposables.dispose();
  }

  private createDebuggingProtocolClient(connection: IConnection) {
    return this.addDisposable(createDebuggingProtocolClient(connection));
  }

  private addDisposable<T extends IDisposable>(disposable: T): T {
    return disposable;
  }
}
