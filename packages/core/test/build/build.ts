import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import compileTemplates from './compile_templates';
import makePrecompile from './make_precompile';

export default function build(channels: string[]) {
  channels.forEach((channel) => {
    console.log(`building fixture app for "${channel}"...`);
    const emberjs = readFileSync(
      `test/vendor/ember-${channel}/dist/ember.prod.js`,
      'utf8'
    );
    const precompile = makePrecompile(
      `test/vendor/ember-${channel}/dist/ember-template-compiler.js`
    );
    const templates = compileTemplates(precompile);
    const appjs =
      templates + '\n' + readFileSync('test/fixtures/app.js', 'utf8');
    const index = readFileSync('test/fixtures/index.html', 'utf8');

    const dir = `dist/test/${channel}`;
    try {
      mkdirSync(dir);
    } catch (e) {
      // ignore
    }
    const pwd = process.cwd();
    try {
      process.chdir(dir);

      writeFileSync('ember.prod.js', emberjs);
      writeFileSync('app.js', appjs);
      writeFileSync('index.html', index);

      // todo: need to address uglify-js non gt es5 support
      // either transpile before down to es5 or leverage
      // a different library than uglify-js
      // kicking the can on minification ATM as non-critical

      // let result = minify("ember.prod.js", {
      //   output: {
      //     semicolons: false
      //   } as any,
      //   sourceMap: true
      // });
      // writeFileSync("ember.min.js", result.code);
      // writeFileSync("ember.min.map", result.map);

      // result = minify("app.js", {
      //   output: {
      //     semicolons: false
      //   } as any,
      //   sourceMap: true
      // });
      // writeFileSync("app.min.js", result.code);
      // writeFileSync("app.min.map", result.map);
    } finally {
      process.chdir(pwd);
    }
  });
}
