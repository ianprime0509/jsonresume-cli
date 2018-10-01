/**
 * @file the new subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { JSONResume } from '@ianprime0509/jsonresume-schema';
import { Arguments } from 'yargs';

import { log, logError } from './log';
import { writeFile } from './util';

/**
 * The basic resume template to use.
 */
const TEMPLATE: JSONResume = {
  basics: {
    name: 'John Smith',
    label: 'Programmer',
  },
  awards: [],
  education: [],
  interests: [],
  languages: [],
  projects: [],
  publications: [],
  references: [],
  skills: [],
  volunteer: [],
  work: [],
};

/**
 * Executes the new subcommand.
 *
 * @param args command-line options for the subcommand
 */
export default async function exec(args: Arguments) {
  const file = args.file || '-';
  try {
    await writeFile(file, JSON.stringify(TEMPLATE, null, 2) + '\n', args.force);
  } catch (e) {
    if ('code' in e && e.code === 'EEXIST') {
      logError(`File ${file} already exists; use '-f' to force creation.`);
    } else {
      logError(`Could not write to file: ${e}`);
    }
    process.exitCode = 1;
    return;
  }
}
