import {
  convertMicrosecondsToMS,
  convertMSToMicroseconds,
  toNearestHundreth
} from '../src/utils';
import { expect } from 'chai';

describe('utils test', () => {
  it(`convertMicrosecondsToMS()`, () => {
    expect(convertMicrosecondsToMS(1000000)).to.eql(1000);
  });

  it(`convertMSToMicroseconds()`, () => {
    expect(convertMSToMicroseconds(1000)).to.eql(1000000);
  });

  it(`toNearestHundreth()`, () => {
    expect(toNearestHundreth(12.46878)).to.eql(12.47);
    expect(toNearestHundreth(1.8456457897)).to.eql(1.85);
    expect(toNearestHundreth(0.555)).to.eql(0.56);
  });
});
