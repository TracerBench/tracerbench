import { readFileSync } from "fs-extra";
import { join } from "path";

const CHART_CSS_PATH = join(__dirname, "chart-bootstrap.css");
const CHART_JS_PATH = join(__dirname, "chartjs-2.9.3-chart.min.js");
const REPORT_PATH = join(__dirname, "report-template.hbs");
const PHASE_DETAIL_PARTIAL = join(__dirname, "phase-detail-partial.hbs");
const PHASE_CHART_JS_PARTIAL = join(__dirname, "phase-chart-js-partial.hbs");
const CHART_CSS = readFileSync(CHART_CSS_PATH, "utf8");
const CHART_JS = readFileSync(CHART_JS_PATH, "utf8");
const PHASE_DETAIL_TEMPLATE_RAW = readFileSync(PHASE_DETAIL_PARTIAL, "utf8");
const PHASE_CHART_JS_TEMPLATE_RAW = readFileSync(
  PHASE_CHART_JS_PARTIAL,
  "utf8"
);

let REPORT_TEMPLATE_RAW = readFileSync(REPORT_PATH, "utf8");
REPORT_TEMPLATE_RAW = REPORT_TEMPLATE_RAW.toString()
  .replace(
    "{{!-- TRACERBENCH-CHART-BOOTSTRAP.CSS --}}",
    `<style>${CHART_CSS}</style>`
  )
  .replace("{{!-- TRACERBENCH-CHART-JS --}}", `<script>${CHART_JS}</script>`);

export {
  REPORT_TEMPLATE_RAW,
  PHASE_CHART_JS_TEMPLATE_RAW,
  PHASE_DETAIL_TEMPLATE_RAW,
};
