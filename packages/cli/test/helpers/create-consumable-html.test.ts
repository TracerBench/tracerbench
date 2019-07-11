import { bucketPhaseValues, resolveTitles } from '../../src/helpers/create-consumable-html';
import { expect } from 'chai';


describe('create-consumable-html test', () => {
  it(`resolveTitles()`, () => {
    const resolved = resolveTitles({
      // @ts-ignore
      servers: [{ name: 'Hello World' }, { name: 'Hello World 2' }],
      plotTitle: 'Override',
    });
    expect(resolved.servers[0].name).to.equal('Hello World');
    expect(resolved.servers[1].name).to.equal('Hello World 2');
    expect(resolved.plotTitle).to.equal('Override');
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

});
