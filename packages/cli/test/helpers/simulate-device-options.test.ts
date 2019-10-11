import { getEmulateDeviceSettingForKeyAndOrientation } from '../../src/helpers/simulate-device-options';
import { expect } from 'chai';

describe('simulate-device-options', () => {
  it(`getEmulateDeviceSettingForKeyAndOrientation() with non-existent device`, () => {
    const device = 'not-exist';
    try {
      getEmulateDeviceSettingForKeyAndOrientation(device);
    } catch (error) {
      expect(error.message).to.equal(
        `Device emulation settings not found for device ${device}`
      );
    }
  });

  it(`getEmulateDeviceSettingForKeyAndOrientation() success path`, () => {
    const result = getEmulateDeviceSettingForKeyAndOrientation('iphone-x');
    expect(result !== undefined).to.equal(true);
    expect(typeof result!.height).to.equal('number');
  });
});
