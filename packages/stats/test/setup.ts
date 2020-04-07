import { setGracefulCleanup } from 'tmp';

after(() => {
  setGracefulCleanup();
});
