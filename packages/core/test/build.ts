import build from './build/index';

console.debug('building fixtures');
build(['alpha', 'beta', 'release'])
  .then(() => {
    console.debug('done');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
