import Compare from "./commands/compare";
import CompareReport from "./commands/compare/report";
import Profile from "./commands/profile";
import RecordHAR from "./commands/record-har";
import {
  generateDataForHTML,
  HTMLSectionRenderData,
  ITracerBenchTraceResult,
  resolveTitles,
} from "./helpers/create-consumable-html";

export { run } from "@oclif/command";
export { IHARServer, ITBConfig, PerformanceTimingMark } from "./command-config";
export * from "./helpers";
export { RecordHAR, CompareReport, Profile, Compare };
export {
  generateDataForHTML,
  HTMLSectionRenderData,
  ITracerBenchTraceResult,
  resolveTitles,
};

// API backwards compat exports
export { CompareReport as Report };
