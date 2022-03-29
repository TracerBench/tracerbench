import { expect } from "chai";
import { describe } from "mocha";

import { test } from "@oclif/test";

import parseCompareResult from "../../src/compare/parse-compare-result";
import { COMPARE_JSON } from "../test-helpers";

const jsonResults = {
  meta: {
    browserVersion: "",
    cpus: ""
  },
  samples: [{}],
  set: ""
};

const sample = {
  duration: 0,
  js: 0,
  phases: [{}],
  blinkGC: [{}],
  gc: [{}]
};

describe("parse-compare-result", () => {
  test.stdout().it(`stdout`, async () => {
    const { controlData, experimentData } = parseCompareResult(COMPARE_JSON);
    expect(controlData).to.have.all.keys(jsonResults);
    expect(controlData.samples[0]).to.have.all.keys(sample);
    expect(experimentData).to.have.all.keys(jsonResults);
    expect(experimentData.samples[0]).to.have.all.keys(sample);
  });
});
