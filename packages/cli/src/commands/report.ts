// import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import { join, resolve } from 'path';

import { Command } from '@oclif/command';
// import { findChrome } from 'chrome-debugging-client';
import {
    inputFilePath,
    tbResultsFolder,
} from '../helpers/flags';
import createConsumeableHTML, {
    TracerBenchTraceResult,
} from '../helpers/create-consumeable-html';

const ARTIFACT_FILE_NAME = 'artifact';

export default class Report extends Command {
    public static description = `Parses the output json from tracerbench and formats it into pdf and html`;
    public static flags = {
        inputFilePath: inputFilePath({ required: true }),
        tbResultsFolder: tbResultsFolder({ required: true })
    };

    public static determineOutputFileName(outputFolder: string): string {
        let count = 1;
        while (true) {
            const candidateHTML = join(outputFolder, `${ARTIFACT_FILE_NAME}-${count}.html`);
            const candidatePDF = join(outputFolder, `${ARTIFACT_FILE_NAME}-${count}.pdf`);
            if (!fs.existsSync(candidateHTML) && !fs.existsSync(candidatePDF)) {
                break;
            }
            count += 1;
        }
        return `artifact-${count}`;
    }

    /**
     * Ensure the input file is valid and call the helper function "createConsumeableHTML"
     * to generate the HTML string for the output file.
     */
    public async run() {
        const { flags } = this.parse(Report);
        const { inputFilePath, tbResultsFolder } = flags;
        let absPathToHTML;
        let absOutputPath;
        let renderedHTML;
        let htmlOutputPath;
        let outputFileName;
        // let chromeArgs;

        let inputData: TracerBenchTraceResult[] = [];

        // If the input file cannot be found, exit with and error
        if (!fs.existsSync(inputFilePath)) {
            this.error(`Input json file does not exist. Please make sure ${inputFilePath} exists`, { exit: 1 });
        }

        try {
            inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
        } catch (error) {
            this.error(`Had issues parsing the input JSON file. Please make sure ${inputFilePath} is a valid JSON`, { exit: 1 });
        }
        const controlData = inputData.find((element) => {
            return element.set === 'control';
        });
        const experimentData = inputData.find((element) => {
            return element.set === 'experiment';
        });

        if (!controlData || !experimentData) {
            this.error(`Missing control or experiment set in JSON`, { exit: 1 });
        }

        outputFileName = Report.determineOutputFileName(tbResultsFolder);
        // @ts-ignore
        renderedHTML = createConsumeableHTML(controlData, experimentData);
        if (!fs.existsSync(tbResultsFolder)) {
            fs.mkdirSync(tbResultsFolder, { recursive: true });
        }

        htmlOutputPath = join(tbResultsFolder, `/${outputFileName}.html`);
        absPathToHTML = resolve(htmlOutputPath);

        fs.writeFileSync(absPathToHTML, renderedHTML);

        absOutputPath = resolve(join(tbResultsFolder + `/${outputFileName}.pdf`));

        // chromeArgs = `--headless --disable-gpu --print-to-pdf=${absOutputPath} file://${absPathToHTML}`;
        // execSync(`${findChrome()} ${chromeArgs}`);
        this.log(`Written files out at ${absPathToHTML} and ${absOutputPath}`);
    }
}