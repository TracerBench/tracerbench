import { test } from "@oclif/test";
import { expect } from "chai";
import { describe } from "mocha";

import RecordHARAuth from "../../src/commands/record-har/auth";

describe("record-har:auth without arg on throw error", () => {
  test.stderr().it(`runs record-har:auth`, async () => {
    try {
      await RecordHARAuth.run([]);
    } catch (error) {
      expect(`${error}`).to.contain(`Missing required flag`);
    }
  });
});
