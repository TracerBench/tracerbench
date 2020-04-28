import {
  findFrame,
  isCommitLoad,
  isFrameNavigationStart,
  convertMSToMicroseconds,
  mergeLeft,
  ITraceEventFrame,
} from "../../src/helpers/utils";
import { expect } from "chai";
import { ITraceEvent } from "@tracerbench/core";

const event: ITraceEvent = {
  ph: "X",
  name: "CommitLoad",
  pid: 0,
  tid: 0,
  ts: 0,
  cat: "",
  args: {
    data: {
      frame: "FRAME",
      url: "https://www.tracerbench.com",
      isMainFrame: true,
    },
  },
};
const events: ITraceEvent[] = [event];
const url = "https://www.tracerbench.com";
const frame = findFrame(events, url);
const isLoad = isCommitLoad(event as ITraceEventFrame);
const isFrameMark = isFrameNavigationStart(
  frame,
  event as ITraceEventFrame,
  url
);
const micro = convertMSToMicroseconds(`-100ms`);

describe("utils", () => {
  it(`findFrame()`, () => {
    expect(frame).to.equal("FRAME");
  });

  it(`isCommitLoad()`, () => {
    expect(isLoad).to.equal(true);
  });

  it(`isFrameNavigationStart()`, () => {
    expect(isFrameMark).to.equal(false);
  });

  it(`convertMSToMicroseconds()`, () => {
    expect(micro).to.equal(-100000);
  });
});

describe("mergeLeft", () => {
  it(`Ensure merge left works as expected`, () => {
    const destination = {
      list: [1, 2, 3],
      num: 1,
      str: "string",
      flag: false,
      shouldStaySame: "same",
      shouldBeNullAfter: "not null",
      objectMerge: {
        value: 0,
      },
    };
    const toMerge = {
      list: [5],
      num: 25,
      str: "other",
      flag: true,
      shouldBeNullAfter: null,
      objectMerge: {
        value: 2,
        newValue: 1,
      },
    };
    const result = mergeLeft(destination, toMerge);

    expect(result.list).to.eql([5]);
    expect(result.num).to.equal(25);
    expect(result.str).to.equal("other");
    expect(result.flag).to.equal(true);
    expect(result.shouldBeNullAfter).to.equal(null);
    expect(result.objectMerge).to.eql({
      value: 2,
      newValue: 1,
    });
  });
});
