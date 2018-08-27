# chrome-debugging-client

[![Build Status](https://travis-ci.org/devtrace/chrome-debugging-client.svg?branch=master)](https://travis-ci.org/devtrace/chrome-debugging-client)

An async/await friendly Chrome debugging client with TypeScript support,
designed with automation in mind.

Features:

* Promise API for async/await (most debugger commands are meant to be sequential).
* Launches Chrome with a new temp user data folder so Chrome launches an isolated instance.
  (regardless if you already have Chrome open).
* Opens an ephemeral remote debugging port so you don't need to configure a port.
* A TypeScript codegen for API autocomplete and tooltips with documentation for
  the debugger protocol https://chromedevtools.github.io/devtools-protocol/
* Cleans up processes and connections at end of session.

Example:

```js
import { createSession } from "chrome-debugging-client";
// import protocol domains "1-2", "tot", or "v8"
import { HeapProfiler } from "chrome-debugging-client/dist/protocol/tot";

createSession(async (session) => {
  // spawns a chrome instance with a tmp user data
  // and the debugger open to an ephemeral port
  const process = await session.spawnBrowser({
    additionalArguments: ['--headless', '--disable-gpu', '--hide-scrollbars', '--mute-audio'],
    windowSize: { width: 640, height: 320 }
  });

  // open the REST API for tabs
  const client = session.createAPIClient("localhost", process.remoteDebuggingPort);

  const tabs = await client.listTabs();
  const tab = tabs[0];
  await client.activateTab(tab.id);

  // open the debugger protocol
  // https://chromedevtools.github.io/devtools-protocol/
  const debuggerClient = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);

  // create the HeapProfiler domain with the debugger protocol client
  const heapProfiler = new HeapProfiler(debuggerClient);
  await heapProfiler.enable();

  // The domains are optional, this can also be
  // await debuggerClient.send("HeapProfiler.enable", {})

  let buffer = "";
  heapProfiler.addHeapSnapshotChunk = (evt) => {
    buffer += evt.chunk;
  });
  await heapProfiler.takeHeapSnapshot({ reportProgress: false });
  await heapProfiler.disable();

  return JSON.parse(buffer);
}).then((data) => {
  console.log(data.snapshot.meta);
}).catch((err) => {
  console.error(err);
});
```

## customize browser executable path

By default, this tool chrome-launcher to find chrome. It may error if it cannot find the executable. For this and other reasons, you can configure via a CHROME_PATH environment variable or pass in the executablePath like so:

```js
// example for macOS
let browser = await session.spawnBrowser({
 executablePath: '/Users/someone/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
});
```
