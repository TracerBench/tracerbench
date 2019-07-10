import * as chai from 'chai';
import * as path from 'path';
import * as url from 'url';

import { FIXTURE_APP, TB_RESULTS_FOLDER } from '../test-helpers';
import printToPDF from '../../src/helpers/print-to-pdf';

describe('printToPDF', () => {
  it(`it outputs pdf`, async () => {
    const outputPath = path.join(TB_RESULTS_FOLDER, '/pdf-test-file.pdf');
    await printToPDF(url.pathToFileURL(FIXTURE_APP.control).toString(), outputPath);
    chai.expect(outputPath).to.be.a.file();
  });
});