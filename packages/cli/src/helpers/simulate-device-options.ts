import { Emulation } from 'chrome-debugging-client/dist/protocol/tot';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { convertToTypable } from './utils';

export interface EmulateDeviceSetting extends Emulation.SetDeviceMetricsOverrideParameters {
  name: string;
  typeable: string;
  userAgent: string;
}

const deviceSettingsRaw = readFileSync(resolve(__dirname, '../static/simulate-device-options.json')).toString();
const deviceSettingsJson = JSON.parse(deviceSettingsRaw);

const deviceSettings: EmulateDeviceSetting[] = deviceSettingsJson.map((item: any) => {
  return {
    width: item.device.screen.horizontal.width,
    height: item.device.screen.horizontal.height,
    deviceScaleFactor: item.device.screen['device-pixel-ratio'] || 0,
    mobile: item.device.capabilities.indexOf('mobile') > -1,
    userAgent: item.device['user-agent'],
    typeable: convertToTypable(item.device.title),
    name: item.device.title
  };
});

export default deviceSettings;
