import { ChildProcess } from "child_process";
import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";
import { delay } from "./delay";
import { DEFAULT_FLAGS } from "./flags";
import { IBrowserProcess, ISpawnOptions } from "./types";

const PORT_FILENAME = "DevToolsActivePort";
const NEWLINE = /\r?\n/;

export default async function spawnBrowser(
  executablePath: string,
  dataDir: string,
  options?: ISpawnOptions,
): Promise<IBrowserProcess> {
  const portFile = path.join(dataDir, PORT_FILENAME);
  // delete port file before launching
  await tryDeleteFile(portFile);
  const args = getArguments(dataDir, options);
  const process: IBrowserProcess = new BrowserProcess(executablePath, args);
  try {
    let port: number = 0;
    let wsPath: string | undefined;
    let retries = 0;
    while (true) {
      if (retries === 0) {
        await delay(800);
      } else {
        await delay(Math.pow(2, retries) * 100);
      }

      [port, wsPath] = await tryReadPort(portFile);
      process.validate();
      if (port > 0) {
        process.remoteDebuggingPort = port;
        process.remoteDebuggingPath = wsPath;
        process.dataDir = dataDir;
        break;
      }

      if (++retries > 8) {
        throw new Error("failed waiting for port file");
      }
    }
    return process;
  } catch (err) {
    await process.dispose();
    throw err;
  }
}

function getArguments(dataDir: string, options?: ISpawnOptions): string[] {
  const windowSize = (options && options.windowSize) || {
    height: 736,
    width: 414,
  };
  const defaultArguments =
    options === undefined || options.disableDefaultArguments !== true
      ? DEFAULT_FLAGS
      : [];
  const additionalArguments = (options && options.additionalArguments) || [];
  return [
    "--remote-debugging-port=0",
    `--user-data-dir=${dataDir}`,
    `--window-size=${windowSize.width},${windowSize.height}`,
  ].concat(defaultArguments, additionalArguments, ["about:blank"]);
}

/* tslint:disable:max-classes-per-file */
class BrowserProcess implements IBrowserProcess {
  public remoteDebuggingPort: number = 0;
  public remoteDebuggingPath: string | undefined;
  public dataDir: string;
  public pid: number;

  private process: ChildProcess;
  private lastError: Error;
  private hasExited: boolean = false;

  constructor(executablePath: string, args: string[]) {
    const child = execa(executablePath, args, {
      // disable buffer, pipe to stdout
      maxBuffer: null as any,
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on("error", (err: Error) => (this.lastError = err));
    child.on("exit", () => (this.hasExited = true));
    this.process = child;
    this.pid = child.pid;
  }

  public get webSocketDebuggerUrl() {
    return `ws://127.0.0.1:${this.remoteDebuggingPort}${
      this.remoteDebuggingPath
    }`;
  }

  public dispose(): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.hasExited) {
        resolve();
      } else {
        this.process.on("exit", resolve);
        this.process.kill();
        // race
        setTimeout(resolve, 2000);
        setTimeout(() => this.process.kill("SIGKILL"), 2000);
      }
    })
      .then(() => {
        this.process.removeAllListeners();
      })
      .catch(err => {
        /* tslint:disable:no-console */
        console.error(err);
        /* tslint:enable:no-console */
      });
  }

  public validate() {
    if (this.hasExited) {
      throw new Error("process exited");
    }
    if (this.lastError) {
      throw this.lastError;
    }
  }
}

function tryDeleteFile(filename: string): Promise<void> {
  return new Promise<void>(resolve => fs.unlink(filename, () => resolve()));
}

function tryReadPort(filename: string) {
  return new Promise<[number, string | undefined]>(resolve => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err || data.length === 0) {
        resolve([0, undefined]);
      } else {
        const [portStr, wsPath] = data.split(NEWLINE, 2);
        const port = parseInt(portStr, 10);
        // handles NaN if write was created but port not written
        port > 0 ? resolve([port, wsPath]) : resolve([0, wsPath]);
      }
    });
  });
}
