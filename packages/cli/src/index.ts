import Compare from "./commands/compare";
import CompareAnalyze from "./commands/compare/analyze";
import CompareReport from "./commands/compare/report";
import Profile from "./commands/profile";
import RecordHAR from "./commands/record-har";
import RecordHARAuth from "./commands/record-har/auth";
import { ICompareJSONResults } from "./compare/compare-results";
export { run } from "@oclif/command";
export { IHARServer, ITBConfig, PerformanceTimingMark } from "./command-config";
export * from "./helpers";
export {
  RecordHAR,
  CompareReport,
  Profile,
  Compare,
  CompareAnalyze,
  RecordHARAuth,
};
export { ICompareJSONResults };

// API backwards compat exports
export { CompareReport as Report };
