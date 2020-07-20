import { CLIError } from "@oclif/errors";
import Protocol from "devtools-protocol";

import { deviceLookup, IDeviceLookup } from "./device-lookup";
import { convertToTypable } from "./utils";

interface ScreenDimensions {
  width: number;
  height: number;
}

export interface Screens {
  horizontal: ScreenDimensions;
  vertical?: ScreenDimensions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface EmulateDeviceSettingBase {
  userAgent: string;
  deviceScaleFactor: number;
  mobile: boolean;
  typeable: string;
}

export interface EmulateDeviceSetting {
  deviceMetricsOverride: Protocol.Emulation.SetDeviceMetricsOverrideRequest;
  userAgentOverride: Protocol.Emulation.SetUserAgentOverrideRequest;
  typeable: string;
}

export interface EmulateDeviceSettingCliOption
  extends EmulateDeviceSettingBase {
  screens: Screens;
}

const deviceSettings: EmulateDeviceSettingCliOption[] = deviceLookup.map(
  (item: IDeviceLookup) => {
    return {
      screens: item.device.screen,
      deviceScaleFactor: item.device.screen["device-pixel-ratio"] || 0,
      mobile: item.device.capabilities.indexOf("mobile") > -1,
      userAgent: item.device["user-agent"],
      typeable: convertToTypable(item.device.title),
      name: item.device.title,
    };
  }
);

/**
 * Iterate over deviceSettings until a match is found in the option's typable field. Extract the contents into EmulateDeviceSetting
 * formatted object
 *
 * @param key - One of typeable strings such as iphone-x
 * @param orientation - Either "vertical" or "horizontal"
 */
export function getEmulateDeviceSettingForKeyAndOrientation(
  key: string,
  orientation = "vertical"
): EmulateDeviceSetting {
  let deviceSetting;

  for (deviceSetting of deviceSettings) {
    if (key === deviceSetting.typeable) {
      if (!deviceSetting.screens[orientation]) {
        throw new CLIError(
          `${orientation} orientation for ${key} does not exist`
        );
      }
      return {
        deviceMetricsOverride: {
          width: deviceSetting.screens[orientation].width,
          height: deviceSetting.screens[orientation].height,
          deviceScaleFactor: deviceSetting.deviceScaleFactor,
          mobile: deviceSetting.mobile,
        },
        userAgentOverride: {
          userAgent: deviceSetting.userAgent,
        },
        typeable: deviceSetting.typeable,
      };
    }
  }

  throw new CLIError(`Device emulation settings not found for device ${key}`);
}

export default deviceSettings;
