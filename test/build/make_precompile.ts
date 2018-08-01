import { readFileSync } from "fs";
import { sync as globSync } from "glob";
import { createContext, Script } from "vm";

/* tslint:disable:no-console */

export default function makePrecompile(
  templateCompilerPath: string
): (src: string) => string {
  const code = readFileSync(templateCompilerPath, "utf8");
  const script = new Script(code, {
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
  const context = createContext(sandbox);
  new Script("global = this").runInContext(context);
  script.runInContext(context);
  return sandbox.module.exports.precompile;
}

function compileTemplates(precompile: (src: string) => string): string {
  const templates: string[] = [];
  const TEMPLATE_DIR = "test/fixtures/templates/";

  globSync(`${TEMPLATE_DIR}/**/*.hbs`).forEach(file => {
    const src = readFileSync(file, "utf8");
    const compiled = precompile(src);
    const templateId = file.slice(TEMPLATE_DIR.length, -4);
    console.debug("templateId", templateId);
    templates.push(
      `Ember.TEMPLATES[${JSON.stringify(
        templateId
      )}] = Ember.HTMLBars.template(${compiled});`
    );
  });
  return templates.join("\n");
}
