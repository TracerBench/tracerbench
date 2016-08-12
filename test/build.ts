import * as fs from "fs";
import * as vm from "vm";
import * as UglifyJS from "uglify-js";

export default function build(versions: string[]) {
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

    let emberjs = fs.readFileSync(`bower_components/${version}/ember.prod.js`, "utf8");
    let precompile = getPrecompile(version);
    let templates = compileTemplates(precompile);
    let appjs = templates + "\n" + fs.readFileSync("test/fixtures/app.js", "utf8");
    let index = fs.readFileSync("test/fixtures/index.html", "utf8");

    let dir = `dist/test/${version}`;
    try {
      fs.mkdirSync(dir);
    } catch (e) {
    }
    let pwd = process.cwd();
    try {
      process.chdir(dir);

      fs.writeFileSync("ember.prod.js", emberjs);
      fs.writeFileSync("app.js", appjs);
      fs.writeFileSync("index.html", index);

      let result = UglifyJS.minify("ember.prod.js", {
        outSourceMap: "ember.min.map"
      });
      fs.writeFileSync("ember.min.js", result.code);
      fs.writeFileSync("ember.min.map", result.map);

      result = UglifyJS.minify("app.js", {
        outSourceMap: "app.min.map"
      });
      fs.writeFileSync("app.min.js", result.code);
      fs.writeFileSync("app.min.map", result.map);

    } finally {
      process.chdir(pwd);
    }
  });
}

function getPrecompile(version: string): (src: string) => string {
  let code = fs.readFileSync(`bower_components/${version}/ember-template-compiler.js`, "utf8");
  let script = new vm.Script(code, {
    filename: "ember-template-compiler.js"
  });

  let sandbox = {
    require: require,
    module: {
      exports: undefined
    },
    exports: {}
  };
  sandbox.module.exports = sandbox.exports;
  let context = vm.createContext(sandbox);
  new vm.Script("global = this").runInContext(context);
  script.runInContext(context);
  return sandbox.module.exports["precompile"];
}

function compileTemplates(precompile: (src: string) => string): string {
  let files = fs.readdirSync("test/fixtures/templates");
  let templates = [];
  files.forEach((file) => {
    if (file.endsWith(".hbs")) {
      let src = fs.readFileSync(`test/fixtures/templates/${file}`, "utf8");
      let compiled = precompile(src);
      let templateId = file.replace(/\.hbs$/, "");
      templates.push(`Ember.TEMPLATES[${JSON.stringify(templateId)}] = Ember.HTMLBars.template(${compiled});`);
    }
  });
  return templates.join("\n");
}