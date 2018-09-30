/**
 * @file the validate subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid } from '@ianprime0509/jsonresume-schema';
import { Arguments } from 'yargs';

import { readFile } from './util';

/**
 * Executes the validate subcommand.
 *
 * @param args command-line options for the subcommand
 */
export default async function exec(args: Arguments) {
  const inputFile = args.file || '-';
  const resume = JSON.parse(await readFile(inputFile));

  if (!isValid(resume)) {
    // TODO: output validation errors.
    process.exitCode = 1;
  }
}
