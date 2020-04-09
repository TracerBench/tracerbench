/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { IConfig } from "@oclif/config";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs-extra";
import { join, resolve } from "path";

import { getConfig, TBBaseCommand } from "../command-config";
import createConsumableHTML, {
  ITracerBenchTraceResult,
} from "../helpers/create-consumable-html";
import { config, tbResultsFolder } from "../helpers/flags";
import printToPDF from "../helpers/print-to-pdf";
import { chalkScheme } from "../helpers/utils";

const ARTIFACT_FILE_NAME = "artifact";

export interface IReportFlags {
  tbResultsFolder: string;
  config?: string;
}

export default class Report extends TBBaseCommand {
  public static description = `Parses the output json from tracerbench and formats it into pdf and html`;
  public static flags = {
    tbResultsFolder: tbResultsFolder({ required: true }),
    config: config(),
  };
  public reportFlags: IReportFlags;

  constructor(argv: string[], config: IConfig) {
    super(argv, config);
    const { flags } = this.parse(Report);

    this.reportFlags = flags;
  }
  // instantiated before this.run()
  public async init() {
    const { flags } = this.parse(Report);
    this.parsedConfig = getConfig(flags.config, flags, this.explicitFlags);

    this.reportFlags = flags;
    await this.parseFlags();
  }
  /**
   * Ensure the input file is valid and call the helper function "createConsumableHTML"
   * to generate the HTML string for the output file.
   */
  public async run() {
    const tbResultsFolder = this.reportFlags.tbResultsFolder;
    const inputFilePath = join(tbResultsFolder, "compare.json");
    let inputData: ITracerBenchTraceResult[] = [];
    // If the input file cannot be found, exit with an error
    if (!existsSync(inputFilePath)) {
      this.error(
        `Input json file does not exist. Please make sure ${inputFilePath} exists`,
        { exit: 1 }
      );
    }

    try {
      inputData = JSON.parse(readFileSync(inputFilePath, "utf8"));
    } catch (error) {
      this.error(
        `Had issues parsing the input JSON file. Please make sure ${inputFilePath} is a valid JSON`,
        { exit: 1 }
      );
    }

    const controlData = inputData.find((element) => {
      return element.set === "control";
    }) as ITracerBenchTraceResult;

    const experimentData = inputData.find((element) => {
      return element.set === "experiment";
    }) as ITracerBenchTraceResult;

    if (!controlData || !experimentData) {
      this.error(`Missing control or experiment set in JSON`, { exit: 1 });
    }

    const outputFileName = this.determineOutputFileName(tbResultsFolder);
    const renderedHTML = createConsumableHTML(
      controlData,
      experimentData,
      this.parsedConfig
    );
    if (!existsSync(tbResultsFolder)) {
      mkdirSync(tbResultsFolder, { recursive: true });
    }

    const htmlOutputPath = join(tbResultsFolder, `/${outputFileName}.html`);
    const absPathToHTML = resolve(htmlOutputPath);

    writeFileSync(absPathToHTML, renderedHTML);

    const absOutputPath = resolve(
      join(tbResultsFolder + `/${outputFileName}.pdf`)
    );

    await printToPDF(`file://${absPathToHTML}`, absOutputPath);
    this.log(
      `\n${chalkScheme.blackBgBlue(
        `    ${chalkScheme.white("Benchmark Reports")}    `
      )}`
    );
    this.log(
      `\nJSON: ${chalkScheme.tbBranding.blue.underline.bold(
        `${this.parsedConfig.tbResultsFolder}/compare.json`
      )}`
    );
    this.log(
      `\nPDF: ${chalkScheme.tbBranding.blue.underline.bold(absOutputPath)}`
    );
    this.log(
      `\nHTML: ${chalkScheme.tbBranding.blue.underline.bold(absPathToHTML)}\n`
    );
  }
  private async parseFlags() {
    const { tbResultsFolder } = (this.parsedConfig as unknown) as IReportFlags;

    // if the folder for the tracerbench results file
    // does not exist then create it
    if (!existsSync(tbResultsFolder)) {
      mkdirSync(tbResultsFolder);
    }
  }
  private determineOutputFileName(outputFolder: string): string {
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
}
