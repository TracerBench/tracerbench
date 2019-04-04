const http2 = require('http2');
const { createSession } = require('chrome-debugging-client');
const { cert, key, fingerprint } = require('./dist').getCertificateInfo();

const server = http2.createSecureServer({ cert, key });

console.log(cert);
console.log(key);
console.log(fingerprint);

server.on('error', err => console.error(err));

server.on('stream', (stream, headers) => {
  console.log(headers);
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443, () => {
  createSession(async session => {
    await session.spawnBrowser({
      additionalArguments: [
        `--ignore-certificate-errors-spki-list=${fingerprint}`,
        'https://localhost:8443/',
      ],
      windowSize: { width: 640, height: 320 },
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
    server.close();
  });
});
