import { test } from "@oclif/test";
import { expect } from "chai";

import Profile from "../../src/commands/profile";
import { COOKIES, HAR_PATH, TB_RESULTS_FOLDER, URL } from "../test-helpers";

const CPU_THROTTLE_RATE = "6";
const NETWORK = "4g";

describe("profile: url, cookies", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --url ${URL} --tbResultsFolder ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES} --cpuThrottleRate ${CPU_THROTTLE_RATE} --network ${NETWORK}`,
      async (ctx) => {
        await Profile.run([
          HAR_PATH,
          "--url",
          URL,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--cookiespath",
          COOKIES,
          "--cpuThrottleRate",
          CPU_THROTTLE_RATE,
          "--network",
          NETWORK,
        ]);
        expect(ctx.stdout).to.contain(`JS Evaluation :: Total Duration`);
        expect(ctx.stdout).to.contain(`CSS Evaluation :: Total Duration`);
      }
    );
});

describe("profile: no url, no cookies", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --tbResultsFolder ${TB_RESULTS_FOLDER}`,
      async (ctx) => {
        await Profile.run([HAR_PATH, "--tbResultsFolder", TB_RESULTS_FOLDER]);
        expect(ctx.stdout).to.contain(`JS Evaluation :: Total Duration`);
        expect(ctx.stdout).to.contain(`CSS Evaluation :: Total Duration`);
      }
    );
});

describe("profile: marker-timings", () => {
  test
    .stdout()
    .it(
      `runs profile ${HAR_PATH} --tbResultsFolder ${TB_RESULTS_FOLDER} --cookiespath ${COOKIES}`,
      async (ctx) => {
        await Profile.run([HAR_PATH, "--tbResultsFolder", TB_RESULTS_FOLDER, "--cookiespath", COOKIES]);
        expect(ctx.stdout).to.contain(`JS Evaluation :: Total Duration`);
        expect(ctx.stdout).to.contain(`CSS Evaluation :: Total Duration`);
        expect(ctx.stdout).to.contain(`Marker Timings :: Total Duration`);
        expect(ctx.stdout).to.contain(`Navigation Start`);
        expect(ctx.stdout).to.contain(`Dom Complete`);
        expect(ctx.stdout).to.contain(`Load Event End`);
        expect(ctx.stdout).to.contain(
          `■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■`
        );
      }
    );
});
