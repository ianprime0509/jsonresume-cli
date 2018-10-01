/**
 * @file tests for the new subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid } from '@ianprime0509/jsonresume-schema';
import * as chai from 'chai';
import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';

import * as log from './log';
import execNew from './new';
import * as util from './util';

chai.use(sinonChai);

describe('new subcommand', () => {
  let oldExitCode: number;
  let fakeWriteFile: sinon.SinonSpy;

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

  context('when the file does not already exist', () => {
    beforeEach(() => {
      fakeWriteFile = sinon.fake();
      sinon.replace(util, 'writeFile', fakeWriteFile);
    });

    it('creates a valid JSON Resume', async () => {
      await execNew({ _: [], $0: 'testNew', file: 'test.json' });

      expect(fakeWriteFile).to.have.been.calledOnce;
      const written = fakeWriteFile.getCall(0).args[1];
      expect(isValid(JSON.parse(written))).to.be.true;
    });
  });

  context('when the file already exists', () => {
    beforeEach(() => {
      const failureError = { code: 'EEXIST' };
      Object.setPrototypeOf(failureError, new Error());
      // Set up a fake that rejects when not forcibly overwriting an existing
      // file.
      fakeWriteFile = sinon.fake(
        async (file: string, contents: string, overwrite: boolean) => {
          if (!overwrite) {
            throw failureError;
          }
        },
      );
      sinon.replace(util, 'writeFile', fakeWriteFile);
    });

    it("fails with a status code of 1 if not called with '-f'", async () => {
      await execNew({ _: [], $0: 'testNew', file: 'test.json' });
      expect(process.exitCode).to.equal(1);
    });

    it("succeeds with a status code of 0 if called with '-f'", async () => {
      await execNew({ _: [], $0: 'testNew', file: 'test.json', force: true });
      expect(process.exitCode).to.equal(0);
    });
  });
});
