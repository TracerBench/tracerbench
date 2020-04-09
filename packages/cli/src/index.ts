import Compare from "./commands/compare";
import MarkerTimings from "./commands/marker-timings";
import RecordHAR from "./commands/record-har";
import Report from "./commands/report";
import Trace from "./commands/trace";
import {
  generateDataForHTML,
  HTMLSectionRenderData,
  ITracerBenchTraceResult,
  resolveTitles,
} from "./helpers/create-consumable-html";

export { run } from "@oclif/command";
export { IHARServer, ITBConfig, PerformanceTimingMark } from "./command-config";
export * from "./helpers";
export { RecordHAR, MarkerTimings, Report, Trace, Compare };
export {
  generateDataForHTML,
  HTMLSectionRenderData,
  ITracerBenchTraceResult,
  resolveTitles,
};
