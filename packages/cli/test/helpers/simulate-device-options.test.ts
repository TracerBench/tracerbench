import { getEmulateDeviceSettingForKeyAndOrientation } from "../../src/helpers/device-settings";
import { expect } from "chai";
import { describe } from "mocha";

describe("simulate-device-options", () => {
  it(`getEmulateDeviceSettingForKeyAndOrientation() with non-existent device`, () => {
    const device = "not-exist";
    try {
      getEmulateDeviceSettingForKeyAndOrientation(device);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal(
          `Device emulation settings not found for device ${device}`
        );
      }
    }
  });

  it(`getEmulateDeviceSettingForKeyAndOrientation() success path`, () => {
    const result = getEmulateDeviceSettingForKeyAndOrientation("iphone-x");
    expect(result !== undefined).to.equal(true);
    expect(typeof result!.deviceMetricsOverride.height).to.equal("number");
  });
});
