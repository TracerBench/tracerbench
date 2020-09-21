import { assert } from "chai";
import { join } from "path";
import { pathToFileURL } from "url";

import { FIXTURE_APP, TB_RESULTS_FOLDER } from "../test-helpers";
import printToPDF from "../../src/compare/print-to-pdf";

describe("printToPDF", () => {
  it(`it outputs pdf`, async () => {
    const outputPath = join(TB_RESULTS_FOLDER, "/pdf-test-file.pdf");
    await printToPDF(pathToFileURL(FIXTURE_APP.control).toString(), outputPath);
    assert.exists(outputPath);
  });
});
