import { ICompareFlags } from './../../src/commands/compare';
import {
  checkEnvironmentSpecificOverride,
  findFrame,
  isCommitLoad,
  isFrameNavigationStart,
  convertMSToMicroseconds,
  getConfigDefault,
  mergeLeft,
  resolveConfigFile,
} from '../../src/helpers/utils';
import { expect } from 'chai';
import { ITraceEvent } from 'tracerbench';
import * as mock from 'mock-fs';

const event: ITraceEvent = {
  ph: 'X',
  name: 'CommitLoad',
  pid: 0,
  tid: 0,
  ts: 0,
  cat: '',
  args: {
    data: {
      frame: 'FRAME',
      url: 'https://www.tracerbench.com',
      isMainFrame: true,
    },
  },
};
const events: ITraceEvent[] = [event];
const url = 'https://www.tracerbench.com';
const frame = findFrame(events, url);
const isLoad = isCommitLoad(event);
const isFrameMark = isFrameNavigationStart(frame, event);
const micro = convertMSToMicroseconds(`-100ms`);
const tbConfigPath = 'test/fixtures/release';

describe('utils', () => {
  it(`getConfigDefault() from tbconfig at alt path`, () => {
    const regressionThreshold = getConfigDefault(
      'regressionThreshold',
      '50ms',
      tbConfigPath
    );
    expect(regressionThreshold).to.equal('-100ms');
  });

  it(`getConfigDefault() from default`, () => {
    const regressionThreshold = getConfigDefault('regressionThreshold', '50ms');
    expect(regressionThreshold).to.equal('50ms');
  });

  it(`findFrame()`, () => {
    expect(frame).to.equal('FRAME');
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

describe('checkEnvironmentSpecificOverride', () => {
  it(`tbConfig missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    // @ts-ignore
    // @ts-nocheck
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName'
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists but environment config missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      {}
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists but config missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      tbConfig
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists and config exists case`, () => {
    const defaultValues = { cpuThrottleRate: 100 };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'cpuThrottleRate',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      tbConfig
    );
    expect(result).to.equal(1);
  });
});

describe('mergeLeft', () => {
  it(`Ensure merge left works as expected`, () => {
    const destination = {
      list: [1, 2, 3],
      num: 1,
      str: 'string',
      flag: false,
      shouldStaySame: 'same',
      shouldBeNullAfter: 'not null',
      objectMerge: {
        value: 0,
      },
    };
    const toMerge = {
      list: [5],
      num: 25,
      str: 'other',
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
    expect(result.str).to.equal('other');
    expect(result.flag).to.equal(true);
    expect(result.shouldBeNullAfter).to.equal(null);
    expect(result.objectMerge).to.eql({
      value: 2,
      newValue: 1,
    });
  });
});

describe('resolveConfigFile', () => {
  const mockFileSystem = {
    parent: {
      child: {
        grandchild: {
          'tbconfig.json': Buffer.from(
            JSON.stringify({ extends: '../tbconfig.json', cpuThrottleRate: 0 })
          ),
          'shouldfail.json': Buffer.from(
            JSON.stringify({ extends: '../lostparent.json' })
          ),
        },
        'tbconfig.json': Buffer.from(
          JSON.stringify({ extends: '../tbconfig.json', cpuThrottleRate: 1 })
        ),
      },
      'tbconfig.json': Buffer.from(
        JSON.stringify({
          extends: '../tbconfig.json',
          cpuThrottleRate: 3,
          regressionThreshold: 5,
        })
      ),
    },
    'tbconfig.json': Buffer.from(JSON.stringify({ cpuThrottleRate: 4 })),
  };

  it('Make sure the output has the correct values replaced', () => {
    mock(mockFileSystem);

    const [resolvedConfig] = resolveConfigFile(
      'parent/child/grandchild/tbconfig.json'
    );
    expect(resolvedConfig.cpuThrottleRate).to.equal(0);
    expect(resolvedConfig.regressionThreshold).to.equal(5);

    mock.restore();
  });

  it('Ensure if parent does not exist, an Error is thrown', () => {
    mock(mockFileSystem);

    const shouldThrowError = () => {
      resolveConfigFile('parent/child/grandchild/failparent.json');
    };
    expect(shouldThrowError).to.throw();

    mock.restore();
  });
});
