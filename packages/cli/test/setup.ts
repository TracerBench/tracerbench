import { existsSync, mkdirSync, removeSync } from 'fs-extra';

export const tmpDir = 'test/tb-tmp';

before(() => {
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir);
  }
});

after(() => {
  if (existsSync(tmpDir)) {
    removeSync(tmpDir);
  }
});
