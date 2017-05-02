import * as fs from "fs";
import * as UglifyJS from "uglify-js";
import * as vm from "vm";

build([
  "ember-2.11",
  "ember-2.12",
  "ember-2.13",
]);

/* tslint:disable:no-console */
function build(versions: string[]) {
  console.log("building fixtures");
  fs.writeFileSync(
    "dist/test/jquery.js",
    fs.readFileSync("bower_components/jquery/dist/jquery.js", "utf8"),
  );
  fs.writeFileSync(
    "dist/test/jquery.min.js",
    fs.readFileSync("bower_components/jquery/dist/jquery.min.js", "utf8"),
  );
  fs.writeFileSync(
    "dist/test/jquery.min.map",
    fs.readFileSync("bower_components/jquery/dist/jquery.min.map", "utf8"),
  );

  versions.forEach((version) => {
    console.log(`building fixture app for "${version}"...`);
    const emberjs = fs.readFileSync(`bower_components/${version}/ember.prod.js`, "utf8");
    const precompile = getPrecompile(version);
    const templates = compileTemplates(precompile);
    const appjs = templates + "\n" + fs.readFileSync("test/fixtures/app.js", "utf8");
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
        outSourceMap: "ember.min.map",
      });
      fs.writeFileSync("ember.min.js", result.code);
      fs.writeFileSync("ember.min.map", result.map);

      result = UglifyJS.minify("app.js", {
        outSourceMap: "app.min.map",
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
  const code = fs.readFileSync(`bower_components/${version}/ember-template-compiler.js`, "utf8");
  const script = new vm.Script(code, {
    filename: "ember-template-compiler.js",
  });

  const sandbox = {
    exports: {},
    require,
    module: {
      exports: undefined as (any | undefined),
    },
  };
  sandbox.module.exports = sandbox.exports;
  const context = vm.createContext(sandbox);
  new vm.Script("global = this").runInContext(context);
  script.runInContext(context);
  return sandbox.module.exports.precompile;
}

function compileTemplates(precompile: (src: string) => string): string {
  const files = fs.readdirSync("test/fixtures/templates");
  const templates: string[] = [];
  files.forEach((file) => {
    if (file.endsWith(".hbs")) {
      const src = fs.readFileSync(`test/fixtures/templates/${file}`, "utf8");
      const compiled = precompile(src);
      const templateId = file.replace(/\.hbs$/, "");
      templates.push(`Ember.TEMPLATES[${JSON.stringify(templateId)}] = Ember.HTMLBars.template(${compiled});`);
    }
  });
  return templates.join("\n");
}
