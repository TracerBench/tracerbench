import { test } from "@oclif/test";
import { expect } from "chai";

import CompareAnalyze from "../../src/commands/compare/analyze";
import { COMPARE_JSON } from "../test-helpers";

const regressionThreshold = "10";

describe("compare:analyze", () => {
  test.stdout().it(`runs compare:analyze COMPARE`, async (ctx) => {
    await CompareAnalyze.run([`${COMPARE_JSON}`]);

    expect(ctx.stdout).to.contain(`Initial Render : duration`);
    expect(ctx.stdout).to.contain(`Sub Phase of Duration : application`);
    expect(ctx.stdout).to.contain(`Hodges–Lehmann estimated delta`);
    expect(ctx.stdout).to.contain(`Benchmark Results Summary`);
    expect(ctx.stdout).to.contain(`duration phase estimated regression +`);
    expect(ctx.stdout).to.contain(`application phase estimated regression +`);
  });
});

describe("compare:analyze low fidelity, low threshold", () => {
  test
    .stdout()
    .it(
      `runs compare:analyze COMPARE --fidelity=2 --regressionThreshold=10`,
      async (ctx) => {
        await CompareAnalyze.run([
          `${COMPARE_JSON}`,
          "--fidelity",
          "2",
          "--regressionThreshold",
          regressionThreshold,
        ]);

        expect(ctx.stdout).to.contain(
          `    WARNING     The fidelity setting was set below the recommended for a viable result. Rerun TracerBench with at least "--fidelity=low" OR >= 10`
        );
        expect(ctx.stdout).to.not.contain(
          `    ! ALERT     Regression found exceeding the set regression threshold of ${regressionThreshold} ms`
        );
      }
    );
});

describe("compare:analyze low threshold", () => {
  test
    .stdout()
    .it(
      `runs compare:analyze COMPARE --fidelity=10 --regressionThreshold=10`,
      async (ctx) => {
        await CompareAnalyze.run([
          `${COMPARE_JSON}`,
          "--fidelity",
          "10",
          "--regressionThreshold",
          regressionThreshold,
        ]);

        expect(ctx.stdout).to.contain(
          `    ! ALERT     Regression found exceeding the set regression threshold of ${regressionThreshold} ms`
        );
      }
    );
});
