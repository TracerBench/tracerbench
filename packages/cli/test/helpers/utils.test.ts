import {
  convertMSToMicroseconds,
  mergeLeft,
  parseMarkers,
  secondsToTime
} from "../../src/helpers/utils";
import { expect } from "chai";
import { describe } from "mocha";

const micro = convertMSToMicroseconds(`-100ms`);

describe("utils", () => {
  it(`convertMSToMicroseconds()`, () => {
    expect(micro).to.equal(-100000);
  });

  it(`parseMarkers`, () => {
    expect(parseMarkers("navigationStart,domComplete")).to.deep.equal([
      {
        start: "navigationStart",
        label: "domComplete"
      },
      {
        start: "domComplete",
        label: "paint"
      }
    ]);
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
        value: 0
      }
    };
    const toMerge = {
      list: [5],
      num: 25,
      str: "other",
      flag: true,
      shouldBeNullAfter: null,
      objectMerge: {
        value: 2,
        newValue: 1
      }
    };
    const result = mergeLeft(destination, toMerge);

    expect(result.list).to.eql([5]);
    expect(result.num).to.equal(25);
    expect(result.str).to.equal("other");
    expect(result.flag).to.equal(true);
    expect(result.shouldBeNullAfter).to.equal(null);
    expect(result.objectMerge).to.eql({
      value: 2,
      newValue: 1
    });
  });
});

describe("secondsToTime", () => {
  it(`Ensure seconds to time works as expected`, () => {
    const timeWithMin = secondsToTime(123);
    const timeWithoutMin = secondsToTime(31);

    expect(timeWithMin).to.eq("02m:03s");
    expect(timeWithoutMin).to.eq("00m:31s");
  });
});
