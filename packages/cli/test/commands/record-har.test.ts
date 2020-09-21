import { test } from "@oclif/test";
import { Archive } from "@tracerbench/har";
import { expect, assert } from "chai";
import { readJSONSync } from "fs-extra";
import { join } from "path";
import RecordHAR from "../../src/commands/record-har";
import { COOKIES, TB_RESULTS_FOLDER, URL } from "../test-helpers";

const FILENAME = "foo";
const INVALID_URL = "http://.com/";

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
          "--screenshots",
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
        expect(harJSON.log.entries[0].request.headers.length).to.be.gt(1);
        expect(harJSON.log.entries[0].response.headers.length).to.be.gt(1);

        assert.exists(screenshotPath);
        assert.exists(harFile);
        assert.equal(harJSON.log.creator.name, "TracerBench");
        assert.equal(harJSON.log.entries[0].response.status, 200);
      }
    );
});

describe("record-har headless no-screenshot invalid-har", () => {
  test
    .stderr()
    .it(
      `runs record-har --url ${INVALID_URL} --dest ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES} --filename ${FILENAME} --headless`,
      async () => {
        try {
          await RecordHAR.run([
            "--url",
            INVALID_URL,
            "--dest",
            TB_RESULTS_FOLDER,
            "--cookiespath",
            COOKIES,
            "--filename",
            FILENAME,
            "--headless",
          ]);
        } catch (error) {
          expect(`${error}`).to.contain(`HAR file invalid`);
          expect(`${error}`).to.contain(
            `Could not extract the URL from the HAR`
          );
        }
      }
    );
});
