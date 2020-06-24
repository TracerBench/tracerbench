import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import compileTemplates from './compile_templates';
import makePrecompile from './make_precompile';

export default function build(channels: string[], root: string) {
  channels.forEach((channel) => {
    console.log(`building fixture app for "${channel}"...`);
    const vendorDir = join(root, `test/vendor/ember-${channel}/dist`);
    const emberjs = readFileSync(join(vendorDir, 'ember.prod.js'), 'utf8');
    const precompile = makePrecompile(
      join(vendorDir, 'ember-template-compiler.js')
    );
    const templates = compileTemplates(precompile);
    const fixturesDir = join(root, 'test/fixtures');
    const appjs =
      templates + '\n' + readFileSync(join(fixturesDir, 'app.js'), 'utf8');
    const index = readFileSync(join(fixturesDir, 'index.html'), 'utf8');

    const testDir = join(root, `dist/test/${channel}`);
    try {
      mkdirSync(testDir);
    } catch (e) {
      // ignore
    }

    writeFileSync(join(testDir, 'ember.prod.js'), emberjs);
    writeFileSync(join(testDir, 'app.js'), appjs);
    writeFileSync(join(testDir, 'index.html'), index);
  });
}
