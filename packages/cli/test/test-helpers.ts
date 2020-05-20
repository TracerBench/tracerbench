import { dirSync } from "tmp";
import { pathToFileURL } from "url";
import { join, resolve } from "path";
import { mkdirpSync, writeFileSync } from "fs-extra";

export const FIXTURE_APP = {
  control: pathToFileURL(
    `${join(process.cwd(), "/test/fixtures/release/index.html")}`
  ).toString(),
  experiment: pathToFileURL(
    `${join(process.cwd(), "/test/fixtures/experiment/index.html")}`
  ).toString(),
  regression: pathToFileURL(
    `${join(process.cwd(), "/test/fixtures/regression/index.html")}`
  ).toString(),
  controlConfig: join(process.cwd(), "/test/fixtures/release/tbconfig.json"),
  experimentConfig: join(
    process.cwd(),
    "/test/fixtures/experiment/tbconfig.json"
  ),
  regressionConfig: join(
    process.cwd(),
    "/test/fixtures/regression/tbconfig.json"
  ),
};

export const TB_RESULTS_FOLDER = dirSync().name;
export const TB_CONFIG_FILE = join(process.cwd(), "/test/tbconfig.json");
export const COOKIES = resolve(
  join(process.cwd(), "/test/fixtures/results/mock-cookies.json")
);
export const HAR_PATH = resolve(
  join(process.cwd(), "/test/fixtures/results/fixture.har")
);
export const URL = "https://www.tracerbench.com/";
export const COMPARE_JSON = resolve(
  join(process.cwd(), "/test/fixtures/results/compare.json")
);
export const MARKER = "domComplete";
export interface FileStructure {
  [key: string]: string | FileStructure;
}

/**
 * Recursively build the file structure according to the tree passed
 *
 * @param structure - File structure to generate. Any values that are non strings are considered another folder
 * @param rootFolder - Generate the file structure in this folder
 */
export function generateFileStructure(
  structure: FileStructure,
  rootFolder: string
) {
  const names = Object.keys(structure);

  names.forEach((name: string) => {
    const pathForName = join(rootFolder, name);
    if (typeof structure[name] === "string") {
      writeFileSync(pathForName, structure[name]);
    } else if (
      typeof structure[name] === "object" &&
      Object.keys(structure[name]).length
    ) {
      mkdirpSync(pathForName);
      // @ts-ignore
      generateFileStructure(structure[name], pathForName);
    }
  });
}
