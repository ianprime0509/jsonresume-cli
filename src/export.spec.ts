/**
 * @file tests for the export subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import execExport from './export';
import * as util from './util';

import completeJson from '@ianprime0509/jsonresume-schema/examples/valid/complete.json';

import basicsWrongType from '@ianprime0509/jsonresume-schema/examples/invalid/basics-wrong-type.json';

chai.use(sinonChai);

describe('export', () => {
  let oldExitCode: number;

  beforeEach(() => {
    oldExitCode = process.exitCode;
    process.exitCode = 0;
  });

  afterEach(() => {
    process.exitCode = oldExitCode;
    sinon.restore();
  });

  it('should export a valid resume successfully', async () => {
    const fakeReadFile = sinon.fake.resolves(JSON.stringify(completeJson));
    sinon.replace(util, 'readFile', fakeReadFile);
    const fakeWriteFile = sinon.fake();
    sinon.replace(util, 'writeFile', fakeWriteFile);

    // Make sure the theme is being used correctly.
    const rendered = 'rendered';
    const fakeLoadTheme = sinon.fake.resolves({ render: () => rendered });
    sinon.replace(util, 'loadTheme', fakeLoadTheme);

    await execExport({ _: [], $0: 'testExport' });
    expect(process.exitCode).to.equal(0);
    expect(fakeReadFile).to.have.been.calledOnceWith('-');
    expect(fakeWriteFile).to.have.been.calledOnceWith('-', rendered);
  });

  it('should fail to export an invalid resume', async () => {
    const fakeReadFile = sinon.fake.resolves(JSON.stringify(basicsWrongType));
    sinon.replace(util, 'readFile', fakeReadFile);
    const fakeWriteFile = sinon.fake();
    sinon.replace(util, 'writeFile', fakeWriteFile);

    await execExport({ _: [], $0: 'testExport' });
    expect(process.exitCode).to.equal(1);
    expect(fakeReadFile).to.have.been.calledOnceWith('-');
    expect(fakeWriteFile).not.to.have.been.called;
  });
});
