import { pathToFileURL } from 'url';
import { tmpDir } from './setup';
import { join, resolve } from 'path';

const appControlFilePath = pathToFileURL(
  `${join(process.cwd(), '/test/fixtures/release/index.html')}`
).toString();
const appRegressionFilePath = pathToFileURL(
  `${join(process.cwd(), '/test/fixtures/regression/index.html')}`
).toString();
const appExperimentFilePath = pathToFileURL(
  `${join(process.cwd(), '/test/fixtures/experiment/index.html')}`
).toString();

export const FIXTURE_APP = {
  control: appControlFilePath,
  experiment: appExperimentFilePath,
  regression: appRegressionFilePath,
};

export const TB_RESULTS_FOLDER = join(process.cwd(), `${tmpDir}`);
export const TB_CONFIG_FILE = join(process.cwd(), '/test/tbconfig.json');
export const COOKIES = resolve(
  join(process.cwd(), '/test/fixtures/results/mock-cookies.json')
);
export const HAR_PATH = resolve(
  join(process.cwd(), '/test/fixtures/fixture.har')
);
export const URL = 'https://www.tracerbench.com';
export const TRACE = resolve(join(process.cwd(), '/test/fixtures/trace.json'));
