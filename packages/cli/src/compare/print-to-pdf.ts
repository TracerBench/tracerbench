import { spawnChrome } from "chrome-debugging-client";
import { writeFileSync } from "fs-extra";
import * as listr from "listr";

import { sleep } from "../helpers/utils";

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
  const tasks = new listr([
    {
      title: "Generating Benchmark Reports",
      task: async () => {
        await chromePrintToPDF(url, outputPath);
      },
    },
  ]);

  await tasks.run().catch((error) => {
    throw new Error(error);
  });

  return;
}

async function chromePrintToPDF(
  url: string,
  outputPath: string
): Promise<void> {
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
    // sleep required for chart.js to animate the graphs in
    // we want this feature for the web view
    await sleep(2000);
    const { data } = await page.send("Page.printToPDF", {});

    writeFileSync(outputPath, Buffer.from(data, "base64"));

    await chrome.close();
  } finally {
    if (chrome) {
      await chrome.dispose();
    }
  }
}
