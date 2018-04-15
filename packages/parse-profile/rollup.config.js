const typescript = require('rollup-plugin-typescript');
const resolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: './src/index.ts',
  external: [
    'd3-hierarchy',
    'chalk',
    'fs',
    'os',
    'path',
    'child_process',
    'ora',
    'chrome-debugging-client',
    'chrome-debugging-client/dist/protocol/tot',
  ],
  plugins: [
    resolve({
      moduleOnly: true,
    }),
    typescript({
      typescript: require('typescript'),
    }),
  ],
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.browser.js',
      format: 'iife',
      name: 'Profile',
      globals: {
        'd3-hierarchy': 'd3',
        chalk: 'self',
        fs: 'self',
        os: 'self',
        path: 'self',
        child_process: 'self',
        'chrome-debugging-client': 'self',
        'chrome-debugging-client/dist/protocol/tot': 'self',
      },
      sourcemap: true,
    },
  ],
};
