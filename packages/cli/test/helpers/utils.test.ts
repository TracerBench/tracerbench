import {
  checkEnvironmentSpecificOverride,
  findFrame,
  isCommitLoad,
  isFrameNavigationStart,
  convertMSToMicroseconds,
  getConfigDefault,
} from '../../src/helpers/utils';
import { expect } from 'chai';
import { ITraceEvent } from 'tracerbench';
import * as path from 'path';

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
const tbConfigPath = path.join(process.cwd(), '/test/tbconfig.json');

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
    const defaultValues = { 'network': 'defaultValue' };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride('network', defaultValues, 'overrideName');
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists but environment config missing case`, () => {
    const defaultValues = { 'network': 'defaultValue' };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride('network', defaultValues, 'overrideName', {});
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists but config missing case`, () => {
    const defaultValues = { 'network': 'defaultValue' };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride('network', defaultValues, 'overrideName', tbConfig);
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists and config exists case`, () => {
    const defaultValues = { 'cpuThrottleRate': 100 };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride('cpuThrottleRate', defaultValues, 'overrideName', tbConfig);
    expect(result).to.equal(1);
  });
});
