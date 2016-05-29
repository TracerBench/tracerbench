import { InitialRenderBenchmark } from "./index";
import * as fs from "fs";
import * as path from "path";

let precompile: (src: string) => string = require("../bower_components/ember/ember-template-compiler").precompile;

let files = fs.readdirSync("test/fixtures/templates");
let templates = [];
files.forEach((file) => {
  if (path.extname(file) === ".hbs") {
    let src = fs.readFileSync(`test/fixtures/templates/${file}`, "utf8");
    let compiled = precompile(src);
    let templateId = file.replace(/\.hbs$/, "");
    templates.push(`Ember.TEMPLATES[${JSON.stringify(templateId)}] = Ember.HTMLBars.template(${compiled});`);
  }
});

fs.writeFileSync("dist/templates.js", templates.join("\n"));

let browserOpts = process.env.CHROME_BIN ? {
  type: "exact",
  executablePath: process.env.CHROME_BIN
} : {
  type: "debug"
};

let benchmark = new InitialRenderBenchmark({
  name: "test initial render",
  url: `file://${__dirname}/../test/fixtures/index.html?tracing`,
  markers: [
    { start: "fetchStart",     label: "fetch" },
    { start: "domLoading",     label: "jquery" },
    { start: "jqueryLoaded",   label: "ember" },
    { start: "emberLoaded",    label: "application" },
    { start: "startRouting",   label: "routing" },
    { start: "willTransition", label: "transition" },
    { start: "didTransition",  label: "render" },
    { start: "renderEnd",      label: "afterRender" }
  ],
  browser: browserOpts
});

benchmark.run().then((result) => {
  console.log(JSON.stringify(result.meta, null, 2));
}).catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
