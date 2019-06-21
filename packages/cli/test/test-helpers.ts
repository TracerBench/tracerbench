import { pathToFileURL } from 'url';
import * as path from 'path';
import { tmpDir } from './setup';

const appControlFilePath = pathToFileURL(
  `${path.join(process.cwd() + '/test/fixtures/release/index.html')}`
).toString();
const appRegressionFilePath = pathToFileURL(
  `${path.join(process.cwd() + '/test/fixtures/regression/index.html')}`
).toString();
const appExperimentFilePath = pathToFileURL(
  `${path.join(process.cwd() + '/test/fixtures/experiment/index.html')}`
).toString();

export const FIXTURE_APP = {
  control: appControlFilePath,
  experiment: appExperimentFilePath,
  regression: appRegressionFilePath,
};

export const TB_RESULTS_FOLDER = path.join(`${process.cwd()}/${tmpDir}`);
