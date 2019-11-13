import { bucketPhaseValues, resolveTitles, phaseSorter } from '../../src/helpers/create-consumable-html';
import { expect } from 'chai';
import { IHARServer } from '../../src/command-config'

describe('create-consumable-html test', () => {
  it(`resolveTitles()`, () => {
    const browserVersion = 'HeadlessChrome/80.0.3965.0';
    const servers: [IHARServer, IHARServer] = [{ name: 'Hello World', url: '', dist: '', socksPort: 0, har: '' }, { name: 'Hello World 2', url: '', dist: '', socksPort: 0, har: '' }]
    const resolved = resolveTitles({
      servers,
      plotTitle: 'Override'
    }, browserVersion);
    expect(resolved.servers[0].name).to.equal('Control: Hello World');
    expect(resolved.servers[1].name).to.equal('Experiment: Hello World 2');
    expect(resolved.plotTitle).to.equal('Override');
    expect(resolved.browserVersion).to.equal(browserVersion);
  });

  it(`bucketPhaseValues()`, () => {
    const testSamples = [
      {
        'duration': 6260696,
        'js': 5310439,
        'phases': [
          {
            'phase': 'load',
            'start': 0,
            'duration': 1807839,
          },
          {
            'phase': 'boot',
            'start': 1807839,
            'duration': 973172,
          },
          {
            'phase': 'transition',
            'start': 2781011,
            'duration': 1540986,
          },
          {
            'phase': 'render',
            'start': 4321997,
            'duration': 1905528,
          },
          {
            'phase': 'paint',
            'start': 6227525,
            'duration': 33171,
          },
        ]
      }, {
        'duration': 6260696,
        'js': 5310439,
        'phases': [
          {
            'phase': 'load',
            'start': 0,
            'duration': 1807839,
          },
          {
            'phase': 'boot',
            'start': 1807839,
            'duration': 973172,
          },
          {
            'phase': 'transition',
            'start': 2781011,
            'duration': 1540986,
          },
          {
            'phase': 'render',
            'start': 4321997,
            'duration': 1905528,
          },
          {
            'phase': 'paint',
            'start': 6227525,
            'duration': 33171,
          },
        ]
      }
    ];
    // @ts-ignore
    const results = bucketPhaseValues(testSamples);
    const keys = Object.keys(results);
    // Should be 5 phases + duration
    expect(keys.length).to.equal(6);
    expect(results).to.have.property('duration');
    expect(results).to.have.property('render');
    expect(results).to.have.property('boot');
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

});
