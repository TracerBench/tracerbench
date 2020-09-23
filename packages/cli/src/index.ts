import Compare from "./commands/compare";
import CompareAnalyze from "./commands/compare/analyze";
import CompareReport from "./commands/compare/report";
import Profile from "./commands/profile";
import RecordHAR from "./commands/record-har";
import RecordHARAuth from "./commands/record-har/auth";

export { run } from "@oclif/command";
export { IHARServer, ITBConfig, PerformanceTimingMark } from "./command-config";
export * from "./helpers";
export * from "./compare";

export {
  RecordHAR,
  CompareReport,
  Profile,
  Compare,
  CompareAnalyze,
  RecordHARAuth,
};

// API backwards compat exports
export { CompareReport as Report };
