import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { minify } from "uglify-js";
import compileTemplates from "./compile_templates";
import makePrecompile from "./make_precompile";

/* tslint:disable:no-console */

export default function build(channels: string[]) {
  channels.forEach(channel => {
    console.debug(`building fixture app for "${channel}"...`);
    const emberjs = readFileSync(
      `embers/${channel}/dist/ember.prod.js`,
      "utf8"
    );
    const precompile = makePrecompile(
      `embers/${channel}/dist/ember-template-compiler.js`
    );
    const templates = compileTemplates(precompile);
    const appjs =
      templates + "\n" + readFileSync("test/fixtures/app.js", "utf8");
    const index = readFileSync("test/fixtures/index.html", "utf8");

    const dir = `dist/test/${channel}`;
    try {
      mkdirSync(dir);
    } catch (e) {
      // ignore
    }
    const pwd = process.cwd();
    try {
      process.chdir(dir);

      writeFileSync("ember.prod.js", emberjs);
      writeFileSync("app.js", appjs);
      writeFileSync("index.html", index);

      let result = minify("ember.prod.js", {
        compress: {
          negate_iife: false,
          sequences: 0
        },
        outSourceMap: "ember.min.map",
        output: {
          semicolons: false
        } as any
      });
      writeFileSync("ember.min.js", result.code);
      writeFileSync("ember.min.map", result.map);

      result = minify("app.js", {
        compress: {
          negate_iife: false,
          sequences: 0
        },
        outSourceMap: "app.min.map",
        output: {
          semicolons: false
        } as any
      });
      writeFileSync("app.min.js", result.code);
      writeFileSync("app.min.map", result.map);
    } finally {
      process.chdir(pwd);
    }
  });
}
