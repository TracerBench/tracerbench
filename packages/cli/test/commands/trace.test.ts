import { expect, test } from "@oclif/test";

const harFile = process.cwd() + "/test/www.tracerbench.com.har";
const url = "https://www.tracerbench.com";

describe("trace", () => {
  test
    .stdout()
    .command(["trace", "--url", url, "--har", harFile])
    .it(`runs trace --url ${url} --har ${harFile}`, ctx => {
      expect(ctx.stdout).to.contain("tracerbench.com");
    });
});
