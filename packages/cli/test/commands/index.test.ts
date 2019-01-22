import { expect, test } from "@oclif/test";

describe("hello", () => {
  test
    .stdout()
    .command(["hello"])
    .it("runs hello", ctx => {
      expect(ctx.stdout).to.contain("hello world");
    });

  test
    .stdout()
    .command(["hello", "--name", "marc"])
    .it("runs hello --name marc", ctx => {
      expect(ctx.stdout).to.contain("hello marc");
    });

  test
    .stdout()
    .command([
      "trace",
      "-u",
      "https://www.google.com",
      "-h",
      "../www.google.com.har"
    ])
    .it("runs trace -u https://www.google.com -h www.google.com.har", ctx => {
      expect(ctx.stdout).to.contain("google.com");
    });
});
