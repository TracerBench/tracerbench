import Compare from "./commands/compare";
import CompareAnalyze from "./commands/compare/analyze";
import CompareReport from "./commands/compare/report";
import RecordHAR from "./commands/record-har";
import RecordHARAuth from "./commands/record-har/auth";

export { run } from "@oclif/command";
export {
  getConfig,
  IHARServer,
  ITBConfig,
  PerformanceTimingMark,
  TBBaseCommand,
  IBenchmarkEnvironmentOverride,
  CONTROL_ENV_OVERRIDE_ATTR,
  EXPERIMENT_ENV_OVERRIDE_ATTR,
  defaultFlagArgs,
} from "./command-config";
export * from "./helpers";
export * from "./compare";

export { RecordHAR, CompareReport, Compare, CompareAnalyze, RecordHARAuth };

// API backwards compat exports
export { CompareReport as Report };
