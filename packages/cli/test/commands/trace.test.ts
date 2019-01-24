import { test } from "@oclif/test";
import * as chai from "chai";
import * as path from "path";
import Trace from "../../src/commands/trace";

chai.use(require("chai-fs"));

const harFile = path.join(process.cwd() + "/test/www.tracerbench.com.har");
const url = "https://www.tracerbench.com";
const traceFile = path.join(process.cwd() + "/trace.json");

describe("trace", () => {
  test
    .stdout()
    .it(
      `runs trace --url ${url} --har ${harFile} --output ${traceFile}`,
      async () => {
        await Trace.run([
          "--url",
          url,
          "--har",
          harFile,
          "--output",
          traceFile
        ]);
        await chai.expect(traceFile).to.be.a.file();
      }
    );
});
