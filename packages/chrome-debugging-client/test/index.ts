import * as tape from "tape";
import { createSession } from "../index";
import { HeapProfiler, Page, Target } from "../protocol/tot";

tape("test REST API", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments: ["--headless"],
      windowSize: { width: 320, height: 640 },
    });
    const apiClient = session.createAPIClient(
      "localhost",
      browser.remoteDebuggingPort,
    );
    const version = await apiClient.version();
    t.assert(version["Protocol-Version"], "has Protocol-Version");
    t.assert(version["User-Agent"], "has User-Agent");
    const tab = await apiClient.newTab();
    t.assert(tab, "newTab returned a tab");
    t.assert(tab.id, "tab has id");
    await apiClient.activateTab(tab.id);
    const tabs = await apiClient.listTabs();
    t.assert(tabs, "listTabs returned tabs");
    t.assert(Array.isArray(tabs), "tabs isArray");
    t.assert(
      tabs.find(other => other.id === tab.id),
      "tabs from listTabs contains tab from newTab",
    );
    await apiClient.closeTab(tab.id);
  }).then(() => t.end(), err => (err ? t.error(err) : t.fail()));
});

tape("test debugging protocol domains", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments: ["--headless"],
    });
    const apiClient = session.createAPIClient(
      "localhost",
      browser.remoteDebuggingPort,
    );
    const tab = await apiClient.newTab("about:blank");
    t.assert(tab.webSocketDebuggerUrl, "has web socket url");
    const debuggingClient = await session.openDebuggingProtocol(
      tab.webSocketDebuggerUrl!,
    );
    const heapProfiler = new HeapProfiler(debuggingClient);
    let buffer = "";
    await heapProfiler.enable();
    heapProfiler.addHeapSnapshotChunk = params => {
      buffer += params.chunk;
    };
    heapProfiler.reportHeapSnapshotProgress = params => {
      t.comment(params.done / params.total + "");
    };
    await heapProfiler.takeHeapSnapshot({ reportProgress: false });
    await heapProfiler.disable();
    t.assert(buffer.length > 0, "received chunks");
    const data = JSON.parse(buffer);
    t.assert(data.snapshot.meta, "has snapshot");
  }).then(() => t.end(), err => (err ? t.error(err) : t.fail()));
});

tape("test browser protocol", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments: ["--headless"],
    });

    const browserClient = await session.openDebuggingProtocol(
      browser.webSocketDebuggerUrl!,
    );

    const targetDomain = new Target(browserClient);
    const { browserContextId } = await targetDomain.createBrowserContext();
    const { targetId } = await targetDomain.createTarget({
      browserContextId,
      url: "about:blank",
    });
    const targets = await targetDomain.getTargets();
    t.assert(
      targets.targetInfos.find(
        info =>
          info.targetId === targetId &&
          info.browserContextId === browserContextId,
      ),
      "has opened target",
    );

    const targetClient = await session.attachToTarget(browserClient, targetId);
    const page = new Page(targetClient);

    const frameTree = await page.getFrameTree();

    t.assert(frameTree.frameTree.frame, "has target has frame tree");

    await targetClient.close();

    await targetDomain.closeTarget({ targetId });

    await browserClient.send("Browser.close");
  }).then(() => t.end(), err => (err ? t.error(err) : t.fail()));
});
