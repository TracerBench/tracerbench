import { test } from "@oclif/test";
import { Archive } from "@tracerbench/har";
import { expect, assert } from "chai";
import { describe } from "mocha";

import { readJSONSync } from "fs-extra";
import { join } from "path";
import RecordHAR from "../../src/commands/record-har";
import { COOKIES, TB_RESULTS_FOLDER, URL } from "../test-helpers";

const FILENAME = "foo";

describe("record-har headless", () => {
  test
    .stdout()
    .it(
      `runs record-har --url ${URL} --dest ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES} --filename ${FILENAME} --headless --screenshots`,
      async (ctx) => {
        await RecordHAR.run([
          "--url",
          URL,
          "--dest",
          TB_RESULTS_FOLDER,
          "--cookiespath",
          COOKIES,
          "--filename",
          FILENAME,
          "--headless",
          "--screenshots"
        ]);

        const harFile = join(TB_RESULTS_FOLDER, `${FILENAME}.har`);
        const screenshotPath = join(
          TB_RESULTS_FOLDER,
          "record-har-app-screenshot.png"
        );
        const harJSON: Archive = readJSONSync(harFile);

        expect(ctx.stdout).to.contain(`app screenshot:`);
        expect(ctx.stdout).to.contain(`Validating HAR`);
        expect(ctx.stdout).to.contain(`HAR recorded`);
        expect(harJSON.log.entries.length).to.be.gt(1);
        expect(harJSON.log.entries[0].request.url).to.contain(`${URL}`);
        expect(harJSON.log.entries[0].request.headers.length).eq(1);
        expect(harJSON.log.entries[0].response.headers.length).to.be.gt(1);

        assert.exists(screenshotPath);
        assert.exists(harFile);
        assert.equal(harJSON.log.creator.name, "TracerBench");
        assert.equal(harJSON.log.entries[0].response.status, 200);
      }
    );
});
