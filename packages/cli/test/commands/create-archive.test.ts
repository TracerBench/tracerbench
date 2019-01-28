/* tslint:disable:no-console */

import { test } from "@oclif/test";
import * as chai from "chai";
import * as path from "path";
import * as rimraf from "rimraf";
import CreateArchive from "../../src/commands/create-archive";

chai.use(require("chai-fs"));

const url = "https://www.tracerbench.com";
const traceFile = path.join(process.cwd() + "/trace.archive");

describe("create-archive", () => {
  before(() => {
    rimraf(traceFile, () => {
      console.log(`Deleted trace file at path ${traceFile}`);
    });
  });

  test
    .stdout()
    .it(`runs create-archive --url ${url} --output ${traceFile}`, async ctx => {
      await CreateArchive.run(["--url", url, "--output", traceFile]);
      chai.expect(ctx.stdout).to.contain(`HAR successfully generated`);
      chai.expect(traceFile).to.be.a.file();
    });
});
