import { Emulation } from 'chrome-debugging-client/dist/protocol/tot';
import { readFileSync } from 'fs';
import { convertToTypable } from './utils';
import * as path from 'path';

export interface EmulateDeviceSetting
  extends Emulation.SetDeviceMetricsOverrideParameters,
    Emulation.SetUserAgentOverrideParameters {
  userAgent: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  mobile: boolean;
  typeable: string;
}

const deviceOptionsJSON = path.join(
  `${process.cwd()}`,
  '/src/static/simulate-device-options.json'
);
const deviceSettingsJson = JSON.parse(readFileSync(deviceOptionsJSON, 'utf8'));
const deviceSettings: EmulateDeviceSetting[] = deviceSettingsJson.map(
  (item: any) => {
    return {
      width: item.device.screen.horizontal.width,
      height: item.device.screen.horizontal.height,
      deviceScaleFactor: item.device.screen['device-pixel-ratio'] || 0,
      mobile: item.device.capabilities.indexOf('mobile') > -1,
      userAgent: item.device['user-agent'],
      typeable: convertToTypable(item.device.title),
      name: item.device.title,
    };
  }
);

export default deviceSettings;
