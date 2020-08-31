import { test } from "@oclif/test";
import { expect, assert } from "chai";
import Compare from "../../src/commands/compare";
import { FIXTURE_APP, TB_RESULTS_FOLDER } from "../test-helpers";
import { ICompareJSONResults } from "../../src/helpers/log-compare-results";

const fidelity = "test";
const fidelityLow = "10";
const emulateDevice = "iphone-4";
const regressionThreshold = "50";
const network = "FIOS";
describe("compare fixture: A/A", () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.control} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate=1 --config ${FIXTURE_APP.controlConfig} --network ${network} --headless --debug --report`,
      async (ctx) => {
        const results = await Compare.run([
          "--controlURL",
          FIXTURE_APP.control,
          "--experimentURL",
          FIXTURE_APP.control,
          "--fidelity",
          fidelity,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--config",
          FIXTURE_APP.controlConfig,
          "--network",
          network,
          "--cpuThrottleRate=1",
          "--headless",
          "--debug",
          "--report",
        ]);
        const resultsJSON: ICompareJSONResults = await JSON.parse(results);
        assert.exists(`${TB_RESULTS_FOLDER}/server-control-settings.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/server-experiment-settings.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/compare-flags-settings.json`);
        assert.exists(`${TB_RESULTS_FOLDER}/traces.zip`);
        // results are json and NOT significant
        assert.isFalse(resultsJSON.areResultsSignificant);
        // regression is below the threshold
        assert.isTrue(resultsJSON.isBelowRegressionThreshold);
        expect(ctx.stdout).to.contain(`SUCCESS`);
        expect(ctx.stdout).to.contain(`Benchmark Reports`);
      }
    );
});

describe("compare fixture: A/A CI", () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.control} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --cpuThrottleRate=1 --config ${FIXTURE_APP.controlConfig} --headless --isCIEnv=true`,
      async (ctx) => {
        await Compare.run([
          "--controlURL",
          FIXTURE_APP.control,
          "--experimentURL",
          FIXTURE_APP.control,
          "--fidelity",
          fidelity,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--config",
          FIXTURE_APP.controlConfig,
          "--cpuThrottleRate=1",
          "--headless",
          "--isCIEnv=true",
        ]);

        expect(ctx.stdout).to.contain(`SUCCESS`);
        expect(ctx.stdout).to.contain(`Benchmark Results Summary`);

        expect(ctx.stdout).to.not.contain("Benchmark Reports");
        expect(ctx.stdout).to.not.contain("Seven Figure Summary");
        expect(ctx.stdout).to.not.contain("Hodges–Lehmann estimated delta");
        expect(ctx.stdout).to.not.contain("Sparkline");
      }
    );
});

describe("compare regression: fixture: A/B", () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.regression} --fidelity ${fidelityLow} --tbResultsFolder ${TB_RESULTS_FOLDER} --config ${FIXTURE_APP.regressionConfig} --regressionThreshold ${regressionThreshold} --cpuThrottleRate=1 --headless`,
      async (ctx) => {
        const results = await Compare.run([
          "--controlURL",
          FIXTURE_APP.control,
          "--experimentURL",
          FIXTURE_APP.regression,
          "--fidelity",
          fidelityLow,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--config",
          FIXTURE_APP.regressionConfig,
          "--regressionThreshold",
          regressionThreshold,
          "--cpuThrottleRate=1",
          "--headless",
        ]);

        const resultsJSON: ICompareJSONResults = await JSON.parse(results);
        expect(ctx.stdout).to.contain(
          `    SUCCESS     ${fidelityLow} test samples took`
        );
        // confirm with headless flag is logging the trace stream
        expect(ctx.stdout).to.contain(`duration phase estimated regression +`);
        expect(ctx.stdout).to.contain(`ember phase no difference`);
        expect(ctx.stdout).to.contain(
          `    ! ALERT     Regression found exceeding the set regression threshold of ${regressionThreshold} ms`
        );
        assert.isAbove(
          parseInt(resultsJSON.benchmarkTableData[0].estimatorDelta, 10),
          500
        );
        assert.isAbove(
          parseInt(resultsJSON.benchmarkTableData[0].confidenceInterval[0], 10),
          500
        );
        assert.isAbove(
          parseInt(resultsJSON.benchmarkTableData[0].confidenceInterval[1], 10),
          500
        );
        // results are json and are significant
        assert.isTrue(resultsJSON.areResultsSignificant);
        // regression is over the threshold
        assert.isFalse(resultsJSON.isBelowRegressionThreshold);
      }
    );
});

describe("compare mobile horizontal: fixture: A/A", () => {
  test
    .stdout()
    .it(
      `runs compare --controlURL ${FIXTURE_APP.control} --experimentURL ${FIXTURE_APP.experiment} --fidelity ${fidelity} --tbResultsFolder ${TB_RESULTS_FOLDER} --emulateDevice ${emulateDevice} --emulateDeviceOrientation horizontal --cpuThrottleRate=6 --headless`,
      async (ctx) => {
        await Compare.run([
          "--controlURL",
          FIXTURE_APP.control,
          "--experimentURL",
          FIXTURE_APP.experiment,
          "--fidelity",
          fidelity,
          "--tbResultsFolder",
          TB_RESULTS_FOLDER,
          "--emulateDevice",
          emulateDevice,
          "--emulateDeviceOrientation",
          "horizontal",
          "--cpuThrottleRate=6",
          "--headless",
        ]);

        expect(ctx.stdout).to.contain(`SUCCESS`);
      }
    );
});
