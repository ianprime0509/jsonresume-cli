/**
 * @file tests for the export subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { validate } from '@ianprime0509/jsonresume-schema';
import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import execExport from './export';
import * as log from './log';
import * as util from './util';

import completeJson from '@ianprime0509/jsonresume-schema/examples/valid/complete.json';

import basicsWrongType from '@ianprime0509/jsonresume-schema/examples/invalid/basics-wrong-type.json';

chai.use(sinonChai);

describe('export subcommand', () => {
  let oldExitCode: number;

  before(() => {
    log.mute();
  });

  after(() => {
    log.unmute();
  });

  beforeEach(() => {
    oldExitCode = process.exitCode;
    process.exitCode = 0;
  });

  afterEach(() => {
    process.exitCode = oldExitCode;
    sinon.restore();
  });

  context('with a valid resume', () => {
    let fakeReadFile: sinon.SinonSpy;
    let fakeWriteFile: sinon.SinonSpy;
    let fakeLoadTheme: sinon.SinonSpy;
    const rendered = 'rendered';

    beforeEach(() => {
      fakeReadFile = sinon.fake.resolves(JSON.stringify(completeJson));
      sinon.replace(util, 'readFile', fakeReadFile);
      fakeWriteFile = sinon.fake();
      sinon.replace(util, 'writeFile', fakeWriteFile);
      fakeLoadTheme = sinon.fake.resolves({ render: () => rendered });
      sinon.replace(util, 'loadTheme', fakeLoadTheme);
    });

    it('sets the status code to 0', async () => {
      await execExport({ _: [], $0: 'testExport' });
      expect(process.exitCode).to.equal(0);
    });

    it('writes the rendered resume to the output file', async () => {
      await execExport({ _: [], $0: 'testExport' });
      expect(fakeWriteFile).to.have.been.calledOnceWith('-', rendered);
    });
  });

  context('with an invalid resume', () => {
    let fakeReadFile: sinon.SinonSpy;
    let fakeWriteFile: sinon.SinonSpy;
    let fakeLogError: sinon.SinonSpy;

    beforeEach(() => {
      fakeReadFile = sinon.fake.resolves(JSON.stringify(basicsWrongType));
      sinon.replace(util, 'readFile', fakeReadFile);
      fakeWriteFile = sinon.fake();
      sinon.replace(util, 'writeFile', fakeWriteFile);
      fakeLogError = sinon.fake();
      sinon.replace(log, 'logError', fakeLogError);
    });

    it('sets the status code to 1', async () => {
      await execExport({ _: [], $0: 'testExport' });
      expect(process.exitCode).to.equal(1);
    });

    it('does not write anything to the output file', async () => {
      await execExport({ _: [], $0: 'testExport' });
      expect(fakeWriteFile).not.to.have.been.called;
    });

    it('logs validation errors', async () => {
      // Collect expected validation errors.
      const errors = validate(basicsWrongType);

      await execExport({ _: [], $0: 'testExport' });
      expect(fakeLogError).to.have.been.called;
      errors.forEach(e => expect(fakeLogError).to.have.been.calledWith(e));
    });
  });
});
