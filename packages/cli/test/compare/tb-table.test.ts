import { expect } from "chai";
import {
  Stats,
  roundFloatAndConvertMicrosecondsToMS
} from "@tracerbench/stats";
import TBTable from "../../src/compare/tb-table";
import {
  REGRESSION_RESULTS,
  HIGH_VARIANCE_RESULTS,
  ON_LINE_RESULTS,
  IMPROVEMENT_RESULTS
} from "../fixtures/results/stats";

const TABLE = new TBTable("Foo Table");
const statsHighVarianceMS = new Stats(
  {
    control: HIGH_VARIANCE_RESULTS.control,
    experiment: HIGH_VARIANCE_RESULTS.experiment,
    name: "stats-high-variance-ms-test"
  },
  roundFloatAndConvertMicrosecondsToMS
);
const statsMS = new Stats(
  {
    control: REGRESSION_RESULTS.control,
    experiment: REGRESSION_RESULTS.experiment,
    name: "stats-regression-ms-test"
  },
  roundFloatAndConvertMicrosecondsToMS
);
const statsOnLineMS = new Stats(
  {
    control: ON_LINE_RESULTS.control,
    experiment: ON_LINE_RESULTS.experiment,
    name: "stats-on-line-ms-test"
  },
  roundFloatAndConvertMicrosecondsToMS
);
const statsImprovementMS = new Stats(
  {
    control: IMPROVEMENT_RESULTS.control,
    experiment: IMPROVEMENT_RESULTS.experiment,
    name: "stats-improvement-ms-test"
  },
  roundFloatAndConvertMicrosecondsToMS
);
TABLE.display.push(
  statsHighVarianceMS,
  statsMS,
  statsOnLineMS,
  statsImprovementMS
);

describe("tb-table", () => {
  it(`generates new CLI-Table-3`, () => {
    expect(TABLE.heading).to.equal("Foo Table");
    expect(TABLE.display.length).to.equal(4);
    expect(TABLE.isSigArray.length).to.equal(0);
    expect(TABLE.estimatorDeltas.length).to.equal(0);
  });
  it(`render() and setTableData()`, () => {
    const tableRendered = TABLE.render();
    expect(tableRendered).to.contain("Control Sparkline");
    expect(tableRendered).to.contain("Experiment Sparkline");
  });
  it(`getData()`, () => {
    const tableData = TABLE.getData();
    expect(tableData.length).to.equal(4);
    // not a regression
    expect(tableData[0].phaseName).to.equal("stats-high-variance-ms-test");
    expect(tableData[0].asPercent.percentMin).to.equal(-3.332);
    expect(tableData[0].asPercent.percentMedian).to.equal(0.07933);
    expect(tableData[0].asPercent.percentMax).to.equal(3.768);
    expect(tableData[0].estimatorDelta).to.equal("2ms");
    expect(tableData[0].pValue).to.equal(0.967);
    expect(tableData[0].confidenceInterval[0]).to.equal("-84ms");
    expect(tableData[0].confidenceInterval[1]).to.equal("95ms");
    expect(tableData[0].isSignificant).to.be.false;
    // regression
    expect(tableData[1].phaseName).to.equal("stats-regression-ms-test");
    expect(tableData[1].asPercent.percentMin).to.equal(2081);
    expect(tableData[1].asPercent.percentMedian).to.equal(2083);
    expect(tableData[1].asPercent.percentMax).to.equal(2086);
    expect(tableData[1].estimatorDelta).to.equal("1080ms");
    expect(tableData[1].pValue).to.equal(1.416e-9);
    expect(tableData[1].confidenceInterval[0]).to.equal("1078ms");
    expect(tableData[1].confidenceInterval[1]).to.equal("1081ms");
    expect(tableData[1].isSignificant).to.be.true;
    // on-the-line
    expect(tableData[2].phaseName).to.equal("stats-on-line-ms-test");
    expect(tableData[2].asPercent.percentMin).to.equal(-1.149);
    expect(tableData[2].asPercent.percentMedian).to.equal(-0.2712);
    expect(tableData[2].asPercent.percentMax).to.equal(0.586);
    expect(tableData[2].estimatorDelta).to.equal("-7ms");
    expect(tableData[2].pValue).to.equal(0.4778);
    expect(tableData[2].confidenceInterval[0]).to.equal("-29ms");
    expect(tableData[2].confidenceInterval[1]).to.equal("15ms");
    expect(tableData[2].isSignificant).to.be.false;
    // improvement
    expect(tableData[3].phaseName).to.equal("stats-improvement-ms-test");
    expect(tableData[3].asPercent.percentMin).to.equal(-4.138);
    expect(tableData[3].asPercent.percentMedian).to.equal(-3.144);
    expect(tableData[3].asPercent.percentMax).to.equal(-1.868);
    expect(tableData[3].estimatorDelta).to.equal("-90ms");
    expect(tableData[3].pValue).to.equal(0.00000177);
    expect(tableData[3].confidenceInterval[0]).to.equal("-118ms");
    expect(tableData[3].confidenceInterval[1]).to.equal("-53ms");
    expect(tableData[3].isSignificant).to.be.true;
  });
});
