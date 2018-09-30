/**
 * @file tests for the validate subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as util from './util';
import execValidate from './validate';

import completeJson from '@ianprime0509/jsonresume-schema/examples/valid/complete.json';

import basicsWrongType from '@ianprime0509/jsonresume-schema/examples/invalid/basics-wrong-type.json';

chai.use(sinonChai);

describe('validate', () => {
  let oldExitCode: number;

  beforeEach(() => {
    oldExitCode = process.exitCode;
    process.exitCode = 0;
  });

  afterEach(() => {
    process.exitCode = oldExitCode;
    sinon.restore();
  });

  it('validates a complete resume', async () => {
    const fakeReadFile = sinon.fake.resolves(JSON.stringify(completeJson));
    sinon.replace(util, 'readFile', fakeReadFile);

    await execValidate({ _: [], $0: 'validateTest' });
    expect(process.exitCode).to.equal(0);
    expect(fakeReadFile).to.have.been.calledOnceWith('-');
  });

  it('fails to validate an invalid resume', async () => {
    const fakeReadFile = sinon.fake.resolves(JSON.stringify(basicsWrongType));
    sinon.replace(util, 'readFile', fakeReadFile);

    await execValidate({ _: [], $0: 'validateTest' });
    expect(process.exitCode).to.equal(1);
    expect(fakeReadFile).to.have.been.calledOnceWith('-');
  });
});
