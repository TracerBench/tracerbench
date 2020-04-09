import { spawnChrome } from "chrome-debugging-client";
import { writeFileSync } from "fs-extra";
import * as ora from "ora";

/**
 * Spawn a chrome process and visit the given url. Wait until page load event is fired
 * and then create PDF.
 *
 * @param url - URL of page for chrome to visit
 * @param outputPath - Output pdf to this file
 */
export default async function printToPDF(
  url: string,
  outputPath: string
): Promise<void> {
  const spinner = ora("\n Generating Benchmark Reports").start();
  const chrome = spawnChrome({ headless: true });
  try {
    const browser = chrome.connection;
    const { targetId } = await browser.send("Target.createTarget", {
      url: "about:blank",
    });
    const page = await browser.attachToTarget(targetId);

    await page.send("Page.enable");
    await Promise.all([
      page.until("Page.loadEventFired"),
      page.send("Page.navigate", { url }),
    ]);
    const { data } = await page.send("Page.printToPDF", {});

    writeFileSync(outputPath, Buffer.from(data, "base64"));

    await chrome.close();
  } finally {
    await spinner.stop();
    await chrome.dispose();
  }
  return;
}
