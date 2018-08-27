import { tmpdir } from "os";
import { join } from "path";
import * as rimraf from "rimraf";
import { IDisposable } from "./types";

export interface ITmpDir extends IDisposable {
  path: string;
}

/* tslint:disable:no-var-requires */
const mktemp: {
  createDir(
    template: string,
    callback: (err: Error | undefined, path: string) => void,
  ): void;
} = require("mktemp");
/* tslint:enable:no-var-requires */

export default async function createTmpDir(customRoot?: string): Promise<ITmpDir> {
  const root = customRoot || tmpdir();
  const templatePath = join(root, "tmpXXXXXX");
  const path = await new Promise<string>((resolve, reject) => {
    mktemp.createDir(templatePath, (e, p) => (e ? reject(e) : resolve(p)));
  });
  function dispose() {
    return new Promise<void>((resolve, reject) => {
      rimraf(path, e => (e ? reject(e) : resolve()));
    }).catch(e => {
      /* tslint:disable:no-console */
      console.error(e);
      /* tslint:enable:no-console */
    });
  }
  return { path, dispose };
}
