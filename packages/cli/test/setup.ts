import * as fs from 'fs-extra';

export const tmpDir = 'test/tb-tmp';

before(() => {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }
});

after(() => {
  if (fs.existsSync(tmpDir)) {
    fs.removeSync(tmpDir);
  }
});
