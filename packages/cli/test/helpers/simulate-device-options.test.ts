import {
  getEmulateDeviceSettingForKeyAndOrientation
} from '../../src/helpers/simulate-device-options';
import { expect } from 'chai';


describe('simulate-device-options', () => {
  it(`getEmulateDeviceSettingForKeyAndOrientation() with non-existent device`, () => {
    const result = getEmulateDeviceSettingForKeyAndOrientation('not-exist');
    expect(result).to.equal(undefined);
  });

  it(`getEmulateDeviceSettingForKeyAndOrientation() success path`, () => {
    const result = getEmulateDeviceSettingForKeyAndOrientation('iphone-x');
    expect(result !== undefined).to.equal(true);
    expect(typeof result!.height).to.equal('number');
  });
});
