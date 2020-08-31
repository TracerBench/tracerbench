import {
  bucketPhaseValues,
  generateDataForHTML,
  resolveTitles,
  phaseSorter,
  Sample,
  formatPhaseData,
  HTMLSectionRenderData,
} from "../../src/helpers/create-consumable-html";
import { expect } from "chai";
import { IHARServer } from "../../src/command-config";
const control = [
  54106,
  51389,
  51389,
  51822,
  48795,
  48891,
  48954,
  51935,
  52039,
  52065,
  52159,
  52199,
  52475,
  52814,
  52901,
  52954,
  54194,
  54893,
  49294,
  49441,
  49458,
  50248,
  50397,
  50578,
  51097,
];

const experiment = [
  1136150,
  1130550,
  1130841,
  1130856,
  1124565,
  1125724,
  1126078,
  1126482,
  1131473,
  1131611,
  1131770,
  1132622,
  1133104,
  1133154,
  1134401,
  1138230,
  1138314,
  1128269,
  1129836,
  1131026,
  1131376,
  1131391,
  1131411,
  1131419,
  1129367,
];
const TEST_SAMPLES: Sample[] = [
  {
    gc: [],
    blinkGC: [],
    duration: 6260696,
    js: 5310439,
    phases: [
      {
        phase: "load",
        start: 0,
        duration: 1807839,
      },
      {
        phase: "boot",
        start: 1807839,
        duration: 973172,
      },
      {
        phase: "transition",
        start: 2781011,
        duration: 1540986,
      },
      {
        phase: "render",
        start: 4321997,
        duration: 1905528,
      },
      {
        phase: "paint",
        start: 6227525,
        duration: 33171,
      },
    ],
  },
  {
    gc: [],
    blinkGC: [],
    duration: 6260696,
    js: 5310439,
    phases: [
      {
        phase: "load",
        start: 0,
        duration: 1807839,
      },
      {
        phase: "boot",
        start: 1807839,
        duration: 973172,
      },
      {
        phase: "transition",
        start: 2781011,
        duration: 1540986,
      },
      {
        phase: "render",
        start: 4321997,
        duration: 1905528,
      },
      {
        phase: "paint",
        start: 6227525,
        duration: 33171,
      },
    ],
  },
];

describe("create-consumable-html test", () => {
  it(`resolveTitles()`, () => {
    const browserVersion = "HeadlessChrome/80.0.3965.0";
    const servers: [IHARServer, IHARServer] = [
      {
        name: "Hello World",
        url: "",
        dist: "",
        socksPort: 0,
        har: "",
      },
      { name: "Hello World 2", url: "", dist: "", socksPort: 0, har: "" },
    ];
    const resolved = resolveTitles(
      {
        servers,
        plotTitle: "Override",
      },
      browserVersion
    );
    expect(resolved.servers[0].name).to.equal("Control: Hello World");
    expect(resolved.servers[1].name).to.equal("Experiment: Hello World 2");
    expect(resolved.plotTitle).to.equal("Override");
    expect(resolved.browserVersion).to.equal(browserVersion);
  });

  it(`resolveTitles():flag-override`, () => {
    const browserVersion = "HeadlessChrome/80.0.3965.0";
    const servers: [IHARServer, IHARServer] = [
      {
        name: "Hello World",
        url: "",
        dist: "",
        socksPort: 0,
        har: "",
      },
      { name: "Hello World 2", url: "", dist: "", socksPort: 0, har: "" },
    ];
    const resolved = resolveTitles(
      {
        servers,
        plotTitle: "Override",
      },
      browserVersion,
      "Flag-Override"
    );
    expect(resolved.servers[0].name).to.equal("Control: Hello World");
    expect(resolved.servers[1].name).to.equal("Experiment: Hello World 2");
    expect(resolved.plotTitle).to.equal("Flag-Override");
    expect(resolved.browserVersion).to.equal(browserVersion);
  });

  it(`bucketPhaseValues()`, () => {
    // @ts-ignore
    const results = bucketPhaseValues(TEST_SAMPLES);
    const keys = Object.keys(results);
    // Should be 5 phases + duration
    expect(keys.length).to.equal(6);
    expect(results).to.have.property("duration");
    expect(results).to.have.property("render");
    expect(results).to.have.property("boot");
    expect(results.duration.length).to.equal(2);
  });

  it(`phaseSorter()`, () => {
    // Above 0 means the first object is above the second
    // Below 0 means the second object is above the first

    const slowest = { isSignificant: true, hlDiff: -150 };
    const slower = { isSignificant: true, hlDiff: -125 };
    const faster = { isSignificant: true, hlDiff: 125 };
    const fastest = { isSignificant: true, hlDiff: 150 };
    const inSignificant = { isSignificant: false, hlDiff: 500 };

    // @ts-ignore
    expect(phaseSorter(slower, inSignificant)).to.be.below(0);
    // @ts-ignore
    expect(phaseSorter(slowest, slower)).to.be.below(0);
    // @ts-ignore
    expect(phaseSorter(slower, slowest)).to.be.above(0);
    // @ts-ignore
    expect(phaseSorter(slowest, slowest)).to.equal(0);
    // @ts-ignore
    expect(phaseSorter(inSignificant, inSignificant)).to.equal(0);
    // @ts-ignore
    expect(phaseSorter(slowest, faster)).to.be.below(0);
    // @ts-ignore
    expect(phaseSorter(fastest, faster)).to.be.above(0);
    // @ts-ignore
    expect(phaseSorter(fastest, inSignificant)).to.be.below(0);
    // @ts-ignore
    expect(phaseSorter(inSignificant, fastest)).to.be.above(0);
  });

  /**
   * The mocked data is duplicated so the differences should be 0
   */
  it("generateDataForHTML()", () => {
    const { durationSection, subPhaseSections } = generateDataForHTML(
      {
        samples: TEST_SAMPLES,
        meta: {
          browserVersion: "HeadlessChrome/78.0.3904.97",
          cpus: ["Intel(R) Core(TM) i9-8950HK CPU @ 2.90GHz"],
        },
        set: "control",
      },
      {
        samples: TEST_SAMPLES,
        meta: {
          browserVersion: "HeadlessChrome/78.0.3904.97",
          cpus: ["Intel(R) Core(TM) i9-8950HK CPU @ 2.90GHz"],
        },
        set: "experiment",
      },
      {
        servers: [],
        plotTitle: "Random Title",
        browserVersion: "0.0.2",
      }
    );
    expect(subPhaseSections).to.length(5);
    expect(durationSection.hlDiff).to.equal(0);
  });

  it("formatPhaseData()", () => {
    const phase = "foo";
    const data: HTMLSectionRenderData = formatPhaseData(
      control,
      experiment,
      phase
    );
    const controlSamples = JSON.parse(data.controlFormatedSamples);
    const experimentSamples = JSON.parse(data.experimentFormatedSamples);

    expect(data.phase).to.eq(phase);
    expect(data.isSignificant).to.be.true;
    expect(data.sampleCount).to.eq(control.length);
    expect(data.ciMin).to.eq(-1081);
    expect(data.ciMax).to.eq(-1078);
    expect(data.hlDiff).to.eq(-1080);

    expect(controlSamples.min).to.eq(49);
    expect(controlSamples.q1).to.eq(50);
    expect(controlSamples.median).to.eq(52);
    expect(controlSamples.q3).to.eq(52);
    expect(controlSamples.max).to.eq(55);
    expect(controlSamples.outliers.length).to.eq(0);

    expect(experimentSamples.min).to.eq(1125);
    expect(experimentSamples.q1).to.eq(1130);
    expect(experimentSamples.median).to.eq(1131);
    expect(experimentSamples.q3).to.eq(1133);
    expect(experimentSamples.max).to.eq(1138);
    expect(experimentSamples.outliers.length).to.eq(0);
  });
});
