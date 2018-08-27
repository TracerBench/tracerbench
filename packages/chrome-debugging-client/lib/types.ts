/**
 * The session is a factory for the various debugging client primitives
 * that tracks all of the disposables it creates, so it can ensure they are
 * all cleaned up when it is disposed.
 *
 * It has no other state.
 */
export interface ISession extends IDisposable {
  /**
   * Spawn a chrome instance with a temporary user data folder with
   * the Chrome Debugging Protocol open on an ephemeral port.
   * @param options
   */
  spawnBrowser(
    options?: IResolveOptions & ISpawnOptions,
  ): Promise<IBrowserProcess>;

  /**
   * Open a DevTools HTTP Client for the specified host and port.
   * @param host {string}
   * @param port {number}
   * @returns {IAPIClient}
   */
  createAPIClient(host: string, port: number): IAPIClient;

  /**
   * Open a Chrome Debugging Protocol client for the specified web socket url.
   * @param webSocketUrl {string} a web socket url.
   */
  openDebuggingProtocol(
    webSocketUrl: string,
  ): Promise<IDebuggingProtocolClient>;

  /**
   * Attach a Chrome Debugging Protocol client to the specified target id.
   * @param browserClient {IDebuggingProtocolClient} Chrome Debugging Protocol client connected to the browser.
   * @param targetId {string} the id of the target.
   * @returns {IDebuggingProtocolClient} the Chrome Debugging Protocol client for the specified target.
   */
  attachToTarget(
    browserClient: IDebuggingProtocolClient,
    targetId: string,
  ): Promise<IDebuggingProtocolClient>;

  /**
   * Create a Chrome Debugging Protocol client for the specified target session id.
   *
   * Useful for creating a client for an already attached target.
   *
   * @param browserClient {IDebuggingProtocolClient} Chrome Debugging Protocol client connected to the browser.
   * @param sessionId {string} the session id of the target.
   * @returns {IDebuggingProtocolClient} the Chrome Debugging Protocol client for the specified target session.
   */
  createTargetSessionClient(
    browserClient: IDebuggingProtocolClient,
    sessionId: string,
  ): IDebuggingProtocolClient;

  /**
   * Create nested session within the current.
   *
   * Everything created within this session will be disposed with the parent,
   * but it allows you to dispose of the session earlier than the parent.
   *
   * @returns {ISession}
   */
  createSession(): ISession;
}

export interface IAPIClient {
  version(): Promise<IVersionResponse>;
  listTabs(): Promise<ITabResponse[]>;
  newTab(url?: string): Promise<ITabResponse>;
  activateTab(tabId: string): Promise<void>;
  closeTab(tabId: string): Promise<void>;
}

export interface ITabResponse {
  id: string;
  webSocketDebuggerUrl?: string;
  description?: string;
  devtoolsFrontendUrl?: string;
  faviconUrl?: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface IVersionResponse {
  Browser: string;
  "Protocol-Version": string;
  "User-Agent": string;
  "WebKit-Version": string;
}

export interface IDebuggingProtocolClient extends IEventNotifier, IDisposable {
  send<T>(command: string, params?: any): Promise<T>;
  send(command: string, params?: any): Promise<any>;
  close(): Promise<void>;
}

export interface IEventNotifier {
  on(event: string, listener: (evt?: any) => void): any;
  once(event: string, listener: (evt?: any) => void): any;
  removeListener(event: string, listener: (evt?: any) => void): any;
  removeAllListeners(event?: string): any;
}

export interface IDisposable {
  /** called in finally should not reject or will mask original error */
  dispose(): Promise<any>;
}

export interface IResolveOptions {
  browserType?: "system" | "canary" | "exact";
  executablePath?: string;
}

export interface ISpawnOptions {
  windowSize?: {
    width: number;
    height: number;
  };
  disableDefaultArguments?: boolean;
  additionalArguments?: string[];
  userDataRoot?: string;
}

export interface IBrowserProcess extends IDisposable {
  remoteDebuggingPort: number;
  remoteDebuggingPath: string | undefined;
  webSocketDebuggerUrl: string | undefined;
  dataDir: string;
  /** throws if process has exited or there has been an error */
  validate(): void;
}

export interface IHTTPClient {
  get(path: string): Promise<string>;
}

export type ErrorEventHandler = (error: Error) => void;
export type MessageEventHandler = (message: string) => void;
export type CloseEventHandler = () => void;

export interface IConnection extends IDisposable, IEventNotifier {
  send(message: string): Promise<void>;
  close(): Promise<void>;
  on(event: "message", listener: MessageEventHandler): any;
  on(event: "error", listener: ErrorEventHandler): any;
  on(event: "close", listener: CloseEventHandler): any;
  once(event: "message", listener: MessageEventHandler): any;
  once(event: "error", listener: ErrorEventHandler): any;
  once(event: "close", listener: CloseEventHandler): any;
  removeListener(event: "message", listener: MessageEventHandler): any;
  removeListener(event: "error", listener: ErrorEventHandler): any;
  removeListener(event: "close", listener: CloseEventHandler): any;
  removeAllListeners(event: "message" | "error" | "close"): any;
}
