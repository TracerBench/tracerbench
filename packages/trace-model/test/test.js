// ts-check
const traceModel = require("../dist/index.js");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const fixturesDir = path.resolve(__dirname, "../fixtures");

describe("TraceModel", () => {
  it("builds slices using the catapult/tracing simple_trace.json", () => {
    // check catapult tracing simple trace
    // open fixture in chrome://tracing to follow along
    const simple = readFixture("simple_trace.json");
    const trace = traceModel.buildModel(simple); // 31
    assert.equal(trace.events.length, 29);
    assert.equal(trace.processes.length, 1);
    const [ process ] = trace.processes;
    assert.equal(process.events.length, 28);
    assert.equal(process.threads.length, 3);
    const [ threadA, threadB, threadC ] = process.threads;
    assert.equal(threadA.name, 'threadA');
    assert.equal(threadA.events.length, 19);
    const aSlices = threadA.events.filter((event) => event.isComplete());
    
    assert.equal(aSlices[0].name, 'X1');
    assert.equal(aSlices[0].parent, undefined);
    assert.equal(aSlices[1].name, 'X same ts and dur as X1');
    assert.equal(aSlices[1].parent, aSlices[0]);
    assert.equal(aSlices[2].name, 'Long X type');
    assert.equal(aSlices[2].parent, undefined);
    assert.equal(aSlices[3].name, 'A long name that doesnt fit but is exceedingly informative');
    assert.equal(aSlices[3].parent, aSlices[2]);
    assert.equal(aSlices[4].name, 'Asub with a name that wont fit');
    assert.equal(aSlices[4].parent, aSlices[3]);
    assert.equal(aSlices[5].name, 'Asub');
    assert.equal(aSlices[5].parent, aSlices[3]);
    assert.equal(aSlices[6].name, 'A not as long a name');
    assert.equal(aSlices[6].parent, undefined);
    assert.equal(aSlices[7].name, 'B');
    assert.equal(aSlices[7].parent, undefined);
    assert.equal(aSlices[8].name, 'B/E over X');
    assert.equal(aSlices[8].parent, undefined);
    assert.equal(aSlices[9].name, 'X');
    assert.equal(aSlices[9].parent, aSlices[8]);
    assert.equal(aSlices[10].name, 'B/E under X');
    assert.equal(aSlices[10].parent, aSlices[9]);

    assert.equal(aSlices.length, 11);
    assert.equal(threadB.name, 'threadB');
    assert.equal(threadB.events.length, 7);
    const bSlices = threadB.events.filter((event) => event.isComplete());
    assert.equal(bSlices.length, 1);
    assert.equal(bSlices[0].name, 'A');
    assert.equal(bSlices[0].parent, undefined);
    assert.equal(threadC.name, 'threadC');
    assert.equal(threadC.events.length, 1);
  });
});

/**
 * @param {string} fixture
 * @returns {TraceEvent[] | TraceStreamJson}
 */
function readFixture(fixture) {
  return JSON.parse(
    fs.readFileSync(path.resolve(fixturesDir, fixture), "utf8"),
  );
}

/** @typedef {import("@tracerbench/trace-event").TraceStreamJson} TraceStreamJson */
/** @typedef {import("@tracerbench/trace-event").TraceEvent} TraceEvent */
