import { test } from "@oclif/test";
import { expect, assert } from "chai";
import { readJsonSync } from "fs-extra";

import CompareReport from "../../src/commands/compare/report";
import { Report } from "../../src/index";
import {
  TB_CONFIG_FILE,
  TB_RESULTS_FOLDER,
  COMPARE_JSON,
  generateFileStructure,
} from "../test-helpers";

const COMPARE = {
  "compare.json": JSON.stringify(readJsonSync(COMPARE_JSON)),
};

describe("compare:report", () => {
  generateFileStructure(COMPARE, TB_RESULTS_FOLDER);
  test
    .stdout()
    .it(
      `runs compare:report --config ${TB_CONFIG_FILE} --tbResultsFolder ${TB_RESULTS_FOLDER} `,
      async (ctx) => {
        await CompareReport.run([
          "--tbResultsFolder",
          `${TB_RESULTS_FOLDER}`,
          "--config",
          `${TB_CONFIG_FILE}`,
        ]);

        expect(ctx.stdout).to.contain(`JSON:`);
        expect(ctx.stdout).to.contain(`PDF:`);
        expect(ctx.stdout).to.contain(`HTML:`);
        assert.exists(`${TB_RESULTS_FOLDER}/compare.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.html`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.pdf`);
      }
    );
});

describe("report - backwards compat test", () => {
  generateFileStructure(COMPARE, TB_RESULTS_FOLDER);
  test
    .stdout()
    .it(
      `runs report --config ${TB_CONFIG_FILE} --tbResultsFolder ${TB_RESULTS_FOLDER} `,
      async (ctx) => {
        await Report.run([
          "--tbResultsFolder",
          `${TB_RESULTS_FOLDER}`,
          "--config",
          `${TB_CONFIG_FILE}`,
        ]);

        expect(ctx.stdout).to.contain(`JSON:`);
        expect(ctx.stdout).to.contain(`PDF:`);
        expect(ctx.stdout).to.contain(`HTML:`);
        assert.exists(`${TB_RESULTS_FOLDER}/compare.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.html`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.pdf`);
      }
    );
});
