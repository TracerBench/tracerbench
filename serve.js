const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');
const rollup = require('rollup');
const path = require('path');

const serve = serveStatic(__dirname, { index: ['index.html'] });

// Create server
var server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

server.listen(3000);
console.error('listening on http://127.0.0.1:3000');

const watcher = rollup.watch(require('./rollup.config'));

watcher.on('event', function(event) {
  switch (event.code) {
    case 'FATAL':
      console.error(event.error);
      process.exit(1);
      break;
    case 'ERROR':
      console.error(event.error);
      break;
    case 'START':
      break;
    case 'BUNDLE_START':
      console.error('bundle ' + event.input);
      break;
    case 'BUNDLE_END':
      console.error(
        'bundle ' +
          event.output.map(out => path.relative(process.cwd(), out)).join(', ') +
          ' in ' +
          event.duration
      );
      break;
    case 'END':
      console.error('waiting for changes...');
      break;
  }
});
