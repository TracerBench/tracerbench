import {
  findFrame,
  isCommitLoad,
  isFrameNavigationStart,
  convertMSToMicroseconds,
} from '../../src/helpers/utils';
import { expect } from 'chai';
import { ITraceEvent } from 'tracerbench';

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

describe('utils', () => {
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
