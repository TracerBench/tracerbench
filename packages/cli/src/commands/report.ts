import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { IConfig } from '@oclif/config';
import { getConfig, TBBaseCommand } from '../command-config';
import createConsumeableHTML, {
  ITracerBenchTraceResult,
} from '../helpers/create-consumable-html';
import { tbResultsFolder, config } from '../helpers/flags';
import printToPDF from '../helpers/print-to-pdf';
import { chalkScheme } from '../helpers/utils';

const ARTIFACT_FILE_NAME = 'artifact';

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
   * Ensure the input file is valid and call the helper function "createConsumeableHTML"
   * to generate the HTML string for the output file.
   */
  public async run() {
    const tbResultsFolder = this.reportFlags.tbResultsFolder;
    const inputFilePath = join(tbResultsFolder, 'compare.json');
    let absPathToHTML;
    let absOutputPath;
    let renderedHTML;
    let htmlOutputPath;
    let outputFileName;
    let inputData: ITracerBenchTraceResult[] = [];
    // If the input file cannot be found, exit with an error
    if (!fs.existsSync(inputFilePath)) {
      this.error(
        `Input json file does not exist. Please make sure ${inputFilePath} exists`,
        { exit: 1 }
      );
    }

    try {
      inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
    } catch (error) {
      this.error(
        `Had issues parsing the input JSON file. Please make sure ${inputFilePath} is a valid JSON`,
        { exit: 1 }
      );
    }

    const controlData = inputData.find(element => {
      return element.set === 'control';
    }) as ITracerBenchTraceResult;

    const experimentData = inputData.find(element => {
      return element.set === 'experiment';
    }) as ITracerBenchTraceResult;

    if (!controlData || !experimentData) {
      this.error(`Missing control or experiment set in JSON`, { exit: 1 });
    }

    outputFileName = this.determineOutputFileName(tbResultsFolder);
    renderedHTML = createConsumeableHTML(
      controlData,
      experimentData,
      this.parsedConfig
    );
    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder, { recursive: true });
    }

    htmlOutputPath = join(tbResultsFolder, `/${outputFileName}.html`);
    absPathToHTML = resolve(htmlOutputPath);

    fs.writeFileSync(absPathToHTML, renderedHTML);

    absOutputPath = resolve(join(tbResultsFolder + `/${outputFileName}.pdf`));

    await printToPDF(`file://${absPathToHTML}`, absOutputPath);

    this.log(
      `The PDF and HTML reports are available here: ${chalkScheme.tbBranding.lime.underline.bold(
        absPathToHTML
      )} and here: ${chalkScheme.tbBranding.blue.underline.bold(
        absOutputPath
      )}\n`
    );
  }
  private async parseFlags() {
    const { tbResultsFolder } = (this.parsedConfig as unknown) as IReportFlags;

    // if the folder for the tracerbench results file
    // does not exist then create it
    if (!fs.existsSync(tbResultsFolder)) {
      fs.mkdirSync(tbResultsFolder);
    }
  }
  private determineOutputFileName(outputFolder: string): string {
    let count = 1;
    while (true) {
      const candidateHTML = join(
        outputFolder,
        `${ARTIFACT_FILE_NAME}-${count}.html`
      );
      const candidatePDF = join(
        outputFolder,
        `${ARTIFACT_FILE_NAME}-${count}.pdf`
      );
      if (!fs.existsSync(candidateHTML) && !fs.existsSync(candidatePDF)) {
        break;
      }
      count += 1;
    }
    return `artifact-${count}`;
  }
}
