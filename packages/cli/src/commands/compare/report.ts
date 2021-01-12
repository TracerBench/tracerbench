/* eslint-disable filenames/match-exported */

import { IConfig } from "@oclif/config";
import { existsSync, mkdirSync, writeFileSync } from "fs-extra";
import * as Handlebars from "handlebars";
import { join, resolve } from "path";

import {
  defaultFlagArgs,
  getConfig,
  ITBConfig,
  TBBaseCommand,
} from "../../command-config";
import {
  GenerateStats,
  ITracerBenchTraceResult,
  ParsedTitleConfigs,
} from "../../compare/generate-stats";
import parseCompareResult from "../../compare/parse-compare-result";
import printToPDF from "../../compare/print-to-pdf";
import {
  config,
  isCIEnv,
  plotTitle,
  tbResultsFolder,
} from "../../helpers/flags";
import { chalkScheme, logHeading } from "../../helpers/utils";
import {
  PHASE_CHART_JS_TEMPLATE_RAW,
  PHASE_DETAIL_TEMPLATE_RAW,
  REPORT_TEMPLATE_RAW,
} from "../../static";

// HANDLEBARS HELPERS
Handlebars.registerPartial("phaseChartJSSection", PHASE_CHART_JS_TEMPLATE_RAW);
Handlebars.registerPartial("phaseDetailSection", PHASE_DETAIL_TEMPLATE_RAW);
Handlebars.registerHelper("toCamel", (val) => {
  return val.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
});
Handlebars.registerHelper("isFaster", (analysis) => {
  return analysis.hlDiff > 0;
});
Handlebars.registerHelper("getQuality", (pVal, threshold) => {
  return pVal < threshold;
});
Handlebars.registerHelper("abs", (num) => {
  return Math.abs(num);
});
Handlebars.registerHelper("absSort", (num1, num2, position) => {
  const sorted = [Math.abs(num1), Math.abs(num2)];
  sorted.sort((a, b) => a - b);
  return sorted[position];
});
Handlebars.registerHelper("stringify", (ctx) => {
  return JSON.stringify(ctx);
});
Handlebars.registerHelper("logArr", (arr) => {
  return JSON.stringify(arr);
});

// CONSTANTS
const ARTIFACT_FILE_NAME = "artifact";

// TYPINGS
export interface IReportFlags {
  tbResultsFolder: string;
  config?: string;
  plotTitle?: string;
  isCIEnv?: boolean;
}

export default class CompareReport extends TBBaseCommand {
  // alias for API backwards compat
  static aliases = ["report"];
  public static description = `Generates report files (PDF/HTML) from the "tracerbench compare" command output`;
  public static flags = {
    tbResultsFolder: tbResultsFolder({ required: true }),
    config: config(),
    plotTitle: plotTitle(),
    isCIEnv: isCIEnv(),
  };
  public reportFlags: IReportFlags;

  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    const { flags } = this.parse(CompareReport);

    this.reportFlags = flags;
  }
  // instantiated before this.run()
  public async init(): Promise<void> {
    const { flags } = this.parse(CompareReport);
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);

    await this.parseFlags();
  }

  public async run(): Promise<void> {
    const { tbResultsFolder } = (this.parsedConfig as unknown) as IReportFlags;
    const inputFilePath = join(tbResultsFolder, "compare.json");

    const { controlData, experimentData } = parseCompareResult(inputFilePath);

    const { absOutputPath, absPathToHTML } = await this.printPDF(
      controlData,
      experimentData,
      tbResultsFolder
    );

    if (!this.parsedConfig.isCIEnv) {
      this.logReportPaths(tbResultsFolder, absOutputPath, absPathToHTML);
    }
  }

  private logReportPaths(
    tbResultsFolder: string,
    absOutputPath: string,
    absPathToHTML: string
  ): void {
    const chalkBlueBold = chalkScheme.tbBranding.blue.underline.bold;

    logHeading("Benchmark Reports");
    this.log(`\nJSON: ${chalkBlueBold(`${tbResultsFolder}/compare.json`)}`);
    this.log(`\nPDF: ${chalkBlueBold(absOutputPath)}`);
    this.log(`\nHTML: ${chalkBlueBold(absPathToHTML)}\n`);
  }

  private async printPDF(
    controlData: ITracerBenchTraceResult,
    experimentData: ITracerBenchTraceResult,
    tbResultsFolder: string
  ): Promise<{ absOutputPath: string; absPathToHTML: string }> {
    const outputFileName = this.determineOutputFileNamePrefix(tbResultsFolder);
    const renderedHTML = this.createConsumableHTML(
      controlData,
      experimentData,
      this.parsedConfig,
      this.reportFlags.plotTitle
    );

    const absPathToHTML = resolve(
      join(tbResultsFolder, `/${outputFileName}.html`)
    );

    writeFileSync(absPathToHTML, renderedHTML);

    const absOutputPath = resolve(
      join(tbResultsFolder + `/${outputFileName}.pdf`)
    );

    await printToPDF(`file://${absPathToHTML}`, absOutputPath);

    return {
      absOutputPath,
      absPathToHTML,
    };
  }

  private async parseFlags(): Promise<void> {
    const { tbResultsFolder } = (this.parsedConfig as unknown) as IReportFlags;

    // if the folder for the tracerbench results file
    // does not exist then create it
    try {
      mkdirSync(tbResultsFolder, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  // increment the report filename prefix by 1
  private determineOutputFileNamePrefix(outputFolder: string): string {
    let count = 1;
    const running = true;
    while (running) {
      const candidateHTML = join(
        outputFolder,
        `${ARTIFACT_FILE_NAME}-${count}.html`
      );
      const candidatePDF = join(
        outputFolder,
        `${ARTIFACT_FILE_NAME}-${count}.pdf`
      );
      if (!existsSync(candidateHTML) && !existsSync(candidatePDF)) {
        break;
      }
      count += 1;
    }
    return `artifact-${count}`;
  }

  private createConsumableHTML(
    controlData: ITracerBenchTraceResult,
    experimentData: ITracerBenchTraceResult,
    tbConfig: ITBConfig,
    plotTitle?: string
  ): string {
    const version =
      controlData.meta.browserVersion ||
      controlData.meta["product-version"] ||
      "HeadlessChrome";

    const reportTitles = CompareReport.resolveTitles(
      tbConfig,
      version,
      plotTitle
    );

    const {
      durationSection,
      subPhaseSections,
      cumulativeData,
    } = new GenerateStats(controlData, experimentData, reportTitles);

    const template = Handlebars.compile(REPORT_TEMPLATE_RAW);

    return template({
      cumulativeData,
      durationSection,
      reportTitles,
      subPhaseSections,
      configsSJSONString: JSON.stringify(tbConfig, null, 4),
      sectionFormattedDataJson: JSON.stringify(subPhaseSections),
    });
  }

  /**
   * Override the default server and plot title attributes
   *
   * @param tbConfig - Concerned only about the "servers" and "plotTitle"
   *   attribute
   * @param version - Browser version
   * @param plotTitle - Optional explicit title from cli flag
   */
  public static resolveTitles(
    tbConfig: Partial<ITBConfig>,
    version: string,
    plotTitle?: string
  ): ParsedTitleConfigs {
    const reportTitles = {
      servers: [{ name: "Control" }, { name: "Experiment" }],
      plotTitle: tbConfig.plotTitle
        ? tbConfig.plotTitle
        : defaultFlagArgs.plotTitle,
      browserVersion: version,
    };

    if (tbConfig.servers) {
      reportTitles.servers = tbConfig.servers.map((titleConfig, idx) => {
        if (idx === 0) {
          return { name: `Control: ${titleConfig.name}` };
        } else {
          return { name: `Experiment: ${titleConfig.name}` };
        }
      });
    }

    // if passing an explicit plotTitle via cli flag this trumps
    // the tbConfig.plotTitle and defaults
    if (plotTitle) {
      reportTitles.plotTitle = plotTitle;
    }

    return reportTitles;
  }
}
