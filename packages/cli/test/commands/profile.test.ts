import { test } from "@oclif/test";
import { expect } from "chai";

import Profile from "../../src/commands/profile";
import { COOKIES, HAR_PATH, TB_RESULTS_FOLDER, URL } from "../test-helpers";

describe("profile: url, cookies", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES} --usertimings`,
      async (ctx) => {
        await Profile.run([
          HAR_PATH,
          "--url",
          URL,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--cookiespath",
          COOKIES,
          "--usertimings",
        ]);
        expect(ctx.stdout).to.contain(`Subtotal`);
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(
          `Frame-URL: https://www.tracerbench.com/`
        );
      }
    );
});

describe("profile: no url, no cookies", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --tbResultsFolder ${TB_RESULTS_FOLDER} --usertimings`,
      async (ctx) => {
        await Profile.run([
          HAR_PATH,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--usertimings",
        ]);
        expect(ctx.stdout).to.contain(`Subtotal`);
        expect(ctx.stdout).to.contain(`.js`);
        expect(ctx.stdout).to.contain(`.css`);
        expect(ctx.stdout).to.contain(
          `Frame-URL: https://www.tracerbench.com/`
        );
      }
    );
});

describe("profile: marker-timings", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async (ctx) => {
        await Profile.run([HAR_PATH, "--tbResultsFolder", TB_RESULTS_FOLDER]);
        expect(ctx.stdout).to.contain(`navigationStart`);
        expect(ctx.stdout).to.contain(`fetchStart`);
        expect(ctx.stdout).to.contain(`domLoading`);
        expect(ctx.stdout).to.contain(`domComplete`);
        expect(ctx.stdout).to.contain(`loadEventStart`);
        expect(ctx.stdout).to.contain(`loadEventEnd`);
      }
    );
});
