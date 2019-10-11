import deviceSettings, {
  EmulateDeviceSetting,
  getEmulateDeviceSettingForKeyAndOrientation,
} from './simulate-device-options';
import { Stats } from './statistics/stats';
import { getWilcoxonRankSumTest } from './statistics/wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './statistics/wilcoxon-signed-rank';
import createConsumeableHTML, {
  ITracerBenchTraceResult,
} from './create-consumable-html';

export {
  deviceSettings,
  EmulateDeviceSetting,
  Stats,
  getWilcoxonRankSumTest,
  getWilcoxonSignedRankTest,
  createConsumeableHTML,
  ITracerBenchTraceResult,
  getEmulateDeviceSettingForKeyAndOrientation,
};
