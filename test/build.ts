import * as fs from "fs";
import * as glob from "glob";
import * as UglifyJS from "uglify-js";
import * as vm from "vm";

build(["ember-2.13.4", "ember-2.14.0-beta.1", "ember-2.14"]);

/* tslint:disable:no-console */
function build(versions: string[]) {
  console.log("building fixtures");
  fs.writeFileSync(
    "dist/test/jquery.js",
    fs.readFileSync("bower_components/jquery/dist/jquery.js", "utf8")
  );
  fs.writeFileSync(
    "dist/test/jquery.min.js",
    fs.readFileSync("bower_components/jquery/dist/jquery.min.js", "utf8")
  );
  fs.writeFileSync(
    "dist/test/jquery.min.map",
    fs.readFileSync("bower_components/jquery/dist/jquery.min.map", "utf8")
  );

  versions.forEach(version => {
    console.log(`building fixture app for "${version}"...`);
    const emberjs = fs.readFileSync(
      `bower_components/${version}/ember.prod.js`,
      "utf8"
    );
    const precompile = getPrecompile(version);
    const templates = compileTemplates(precompile);
    const appjs =
      templates + "\n" + fs.readFileSync("test/fixtures/app.js", "utf8");
    const index = fs.readFileSync("test/fixtures/index.html", "utf8");

    const dir = `dist/test/${version}`;
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      // ignore
    }
    const pwd = process.cwd();
    try {
      process.chdir(dir);

      fs.writeFileSync("ember.prod.js", emberjs);
      fs.writeFileSync("app.js", appjs);
      fs.writeFileSync("index.html", index);

      let result = UglifyJS.minify("ember.prod.js", {
        compress: {
          negate_iife: false,
          sequences: 0
        },
        outSourceMap: "ember.min.map",
        output: {
          semicolons: false
        } as any
      });
      fs.writeFileSync("ember.min.js", result.code);
      fs.writeFileSync("ember.min.map", result.map);

      result = UglifyJS.minify("app.js", {
        compress: {
          negate_iife: false,
          sequences: 0
        },
        outSourceMap: "app.min.map",
        output: {
          semicolons: false
        } as any
      });
      fs.writeFileSync("app.min.js", result.code);
      fs.writeFileSync("app.min.map", result.map);

      console.log("done");
    } finally {
      process.chdir(pwd);
    }
  });
}

function getPrecompile(version: string): (src: string) => string {
  const code = fs.readFileSync(
    `bower_components/${version}/ember-template-compiler.js`,
    "utf8"
  );
  const script = new vm.Script(code, {
    filename: "ember-template-compiler.js"
  });

  const sandbox = {
    exports: {},
    module: {
      exports: undefined as any | undefined
    },
    require
  };
  sandbox.module.exports = sandbox.exports;
  const context = vm.createContext(sandbox);
  new vm.Script("global = this").runInContext(context);
  script.runInContext(context);
  return sandbox.module.exports.precompile;
}

function compileTemplates(precompile: (src: string) => string): string {
  const templates: string[] = [];
  const TEMPLATE_DIR = "test/fixtures/templates/";

  glob.sync(`${TEMPLATE_DIR}/**/*.hbs`).forEach(file => {
    const src = fs.readFileSync(file, "utf8");
    const compiled = precompile(src);
    const templateId = file.slice(TEMPLATE_DIR.length, -4);
    console.log("templateId", templateId);
    templates.push(
      `Ember.TEMPLATES[${JSON.stringify(
        templateId
      )}] = Ember.HTMLBars.template(${compiled});`
    );
  });
  return templates.join("\n");
}
