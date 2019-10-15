import { use, expect } from 'chai';
import * as path from 'path';
import * as url from 'url';

const chaiFiles = require('chai-files');
use(chaiFiles);

import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';
import printToPDF from '../../src/helpers/print-to-pdf';
const file = chaiFiles.file;

describe('printToPDF', () => {
  it(`it outputs pdf`, async () => {
    const outputPath = path.join(TB_RESULTS_FOLDER, '/pdf-test-file.pdf');
    await printToPDF(
      url.pathToFileURL(FIXTURE_APP.control).toString(),
      outputPath
    );
    // tslint:disable-next-line: no-unused-expression
    expect(file(outputPath)).to.exist;
  });
});
