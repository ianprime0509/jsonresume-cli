/**
 * @file tests for the validate subcommand
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

import * as log from './log';
import * as util from './util';
import execValidate from './validate';

import completeJson from '@ianprime0509/jsonresume-schema/examples/valid/complete.json';

import basicsWrongType from '@ianprime0509/jsonresume-schema/examples/invalid/basics-wrong-type.json';

chai.use(sinonChai);

describe('validate', () => {
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

    beforeEach(() => {
      fakeReadFile = sinon.fake.resolves(JSON.stringify(completeJson));
      sinon.replace(util, 'readFile', fakeReadFile);
    });

    it('sets the status code to 0', async () => {
      await execValidate({ _: [], $0: 'validateTest' });
      expect(process.exitCode).to.equal(0);
    });
  });

  context('with an invalid resume', () => {
    let fakeReadFile: sinon.SinonSpy;
    let fakeLogError: sinon.SinonSpy;

    beforeEach(() => {
      fakeReadFile = sinon.fake.resolves(JSON.stringify(basicsWrongType));
      sinon.replace(util, 'readFile', fakeReadFile);
      fakeLogError = sinon.fake();
      sinon.replace(log, 'logError', fakeLogError);
    });

    it('sets the status code to 1', async () => {
      await execValidate({ _: [], $0: 'validateTest' });
      expect(process.exitCode).to.equal(1);
    });

    it('logs validation errors', async () => {
      // Collect expected validation errors.
      const errors = validate(basicsWrongType);

      await execValidate({ _: [], $0: 'validateTest' });
      expect(fakeLogError).to.have.been.called;
      errors.forEach(e => expect(fakeLogError).to.have.been.calledWith(e));
    });
  });
});
