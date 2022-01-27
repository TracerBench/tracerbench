import { test } from "@oclif/test";
import { expect, assert } from "chai";
import { describe } from "mocha";

import { readJsonSync } from "fs-extra";

import { IHARServer } from "../../src/command-config";
import CompareReport from "../../src/commands/compare/report";
import { Report } from "../../src/index";
import {
  TB_CONFIG_FILE,
  TB_RESULTS_FOLDER,
  COMPARE_JSON,
  generateFileStructure
} from "../test-helpers";

const COMPARE = {
  "compare.json": JSON.stringify(readJsonSync(COMPARE_JSON))
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
          `${TB_CONFIG_FILE}`
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
          `${TB_CONFIG_FILE}`
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

describe("compare:report ci", () => {
  generateFileStructure(COMPARE, TB_RESULTS_FOLDER);
  test
    .stdout()
    .it(
      `runs compare:report --config ${TB_CONFIG_FILE} --tbResultsFolder ${TB_RESULTS_FOLDER} --isCIEnv true`,
      async (ctx) => {
        await CompareReport.run([
          "--tbResultsFolder",
          `${TB_RESULTS_FOLDER}`,
          "--config",
          `${TB_CONFIG_FILE}`,
          "--isCIEnv",
          `${true}`
        ]);

        expect(ctx.stdout).to.not.contain(`JSON:`);
        expect(ctx.stdout).to.not.contain(`PDF:`);
        expect(ctx.stdout).to.not.contain(`HTML:`);
        assert.exists(`${TB_RESULTS_FOLDER}/compare.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.html`);
        assert.exists(`${TB_RESULTS_FOLDER}/artifact-1.pdf`);
      }
    );
});

describe("compare:report", () => {
  it(`resolveTitles()`, () => {
    const browserVersion = "HeadlessChrome/80.0.3965.0";
    const servers: [IHARServer, IHARServer] = [
      {
        name: "Hello World",
        url: "",
        dist: "",
        socksPort: 0,
        har: ""
      },
      { name: "Hello World 2", url: "", dist: "", socksPort: 0, har: "" }
    ];
    const resolved = CompareReport.resolveTitles(
      {
        servers,
        plotTitle: "Override"
      },
      browserVersion
    );
    expect(resolved.servers[0].name).to.equal("Control: Hello World");
    expect(resolved.servers[1].name).to.equal("Experiment: Hello World 2");
    expect(resolved.plotTitle).to.equal("Override");
    expect(resolved.browserVersion).to.equal(browserVersion);
  });
});

describe("compare:report", () => {
  it(`resolveTitles():flag-override`, () => {
    const browserVersion = "HeadlessChrome/80.0.3965.0";
    const servers: [IHARServer, IHARServer] = [
      {
        name: "Hello World",
        url: "",
        dist: "",
        socksPort: 0,
        har: ""
      },
      { name: "Hello World 2", url: "", dist: "", socksPort: 0, har: "" }
    ];
    const resolved = CompareReport.resolveTitles(
      {
        servers,
        plotTitle: "Override"
      },
      browserVersion,
      "Flag-Override"
    );
    expect(resolved.servers[0].name).to.equal("Control: Hello World");
    expect(resolved.servers[1].name).to.equal("Experiment: Hello World 2");
    expect(resolved.plotTitle).to.equal("Flag-Override");
    expect(resolved.browserVersion).to.equal(browserVersion);
  });
});
