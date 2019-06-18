import Protocol from 'devtools-protocol';
import { convertToTypable } from './utils';
import { simulateDeviceOptions } from '../static/simulate-device-options';

interface ScreenDimensions {
  width: number;
  height: number;
}

export interface Screens {
  horizontal: ScreenDimensions;
  vertical?: ScreenDimensions;
  [key: string]: any;
}

export interface EmulateDeviceSettingBase {
  userAgent: string;
  deviceScaleFactor: number;
  mobile: boolean;
  typeable: string;
}

export interface EmulateDeviceSetting
  extends EmulateDeviceSettingBase,
    Protocol.Emulation.SetDeviceMetricsOverrideRequest,
    Protocol.Emulation.SetUserAgentOverrideRequest {
  width: number;
  height: number;
}

export interface EmulateDeviceSettingCliOption
  extends EmulateDeviceSettingBase {
  screens: Screens;
}

const deviceSettings: EmulateDeviceSettingCliOption[] = simulateDeviceOptions.map(
  (item: any) => {
    return {
      screens: item.device.screen,
      deviceScaleFactor: item.device.screen['device-pixel-ratio'] || 0,
      mobile: item.device.capabilities.indexOf('mobile') > -1,
      userAgent: item.device['user-agent'],
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
export function getEmulateDeviceSettingForKeyAndOrientation(key: string, orientation: string = 'vertical'): EmulateDeviceSetting | undefined {
  let deviceSetting;

  for (deviceSetting of deviceSettings) {
    if (key === deviceSetting.typeable) {
      if (!deviceSetting.screens[orientation!]) {
        throw new Error(`${orientation} orientation for ${key} does not exist.`);
      }
      return {
        width: deviceSetting.screens[orientation!].width,
        height: deviceSetting.screens[orientation!].height,
        deviceScaleFactor: deviceSetting.deviceScaleFactor,
        mobile: deviceSetting.mobile,
        userAgent: deviceSetting.userAgent,
        typeable: deviceSetting.typeable,
      };
    }
  }
}

export default deviceSettings;
