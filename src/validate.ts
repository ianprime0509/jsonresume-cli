/**
 * @file the validate subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid } from '@ianprime0509/jsonresume-schema';
import { readFile } from 'fs';
import { exit } from 'process';
import { promisify } from 'util';
import { Arguments } from 'yargs';

const readFileAsync = promisify(readFile);

/**
 * Executes the validate subcommand.
 *
 * @param args command-line options for the subcommand
 */
export default async function exec(args: Arguments) {
  const inputFile = args.file || '-';
  // Read from stdin (file descriptor 0) if the file is '-'.
  const resume = JSON.parse(
    await readFileAsync(inputFile === '-' ? 0 : inputFile, {
      encoding: 'UTF-8',
    }),
  );

  if (isValid(resume)) {
    exit(0);
  } else {
    // TODO: output validation errors.
    exit(1);
  }
}
