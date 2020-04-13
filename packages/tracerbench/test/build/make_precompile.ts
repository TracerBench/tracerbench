import { readFileSync } from 'fs';
import { createContext, Script } from 'vm';

export default function makePrecompile(
  templateCompilerPath: string
): (src: string) => string {
  const code = readFileSync(templateCompilerPath, 'utf8');
  const script = new Script(code, {
    filename: 'ember-template-compiler.js'
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
  new Script('global = this').runInContext(context);
  script.runInContext(context);
  return sandbox.module.exports.precompile;
}
