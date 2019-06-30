import deviceSettings, {
  EmulateDeviceSetting,
} from './simulate-device-options';
import { Stats } from './statistics/stats';
import { getWilcoxonRankSumTest } from './statistics/wilcoxon-rank-sum';
import { getWilcoxonSignedRankTest } from './statistics/wilcoxon-signed-rank';

export {
  deviceSettings,
  EmulateDeviceSetting,
  Stats,
  getWilcoxonRankSumTest,
  getWilcoxonSignedRankTest,
};
