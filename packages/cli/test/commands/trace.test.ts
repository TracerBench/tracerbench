import { test } from "@oclif/test";
import * as chai from "chai";
import * as path from "path";
import Trace from "../../src/commands/trace";
import * as rimraf from "rimraf";

chai.use(require("chai-fs"));

const harFile = path.join(process.cwd() + "/test/www.tracerbench.com.har");
const url = "https://www.tracerbench.com";
const traceFile = path.join(process.cwd() + "/trace.json");

describe("trace", () => {
  before(() => {
    rimraf(traceFile, () => {
      console.log(`Deleted trace file at path ${traceFile}`);
    });
  });

  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --output ${traceFile}`,
      async ctx => {
        await Trace.run([
          "--url",
          url,
          "--har",
          harFile,
          "--output",
          traceFile
        ]);
        chai.expect(ctx.stdout).to.contain(`Trace`);
        chai.expect(traceFile).to.be.a.file();
      }
    );
});
