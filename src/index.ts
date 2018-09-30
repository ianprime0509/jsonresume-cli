/**
 * @file the main entry point of the CLI
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import yargs from 'yargs';

import execFormat from './format';
import execNew from './new';
import execValidate from './validate';

yargs
  .version('0.1.0')
  .command({
    command: 'new',
    describe: 'Create a new resume.',
    builder: args =>
      args.option('output', {
        alias: 'o',
        describe: 'Set the output file',
        requiresArg: true,
        type: 'string',
      }),
    handler: execNew,
  })
  .command({
    command: 'format [file]',
    describe: 'Format a resume.',
    builder: args =>
      args
        .option('theme', {
          alias: 't',
          describe: 'Set the theme',
          requiresArg: true,
          type: 'string',
        })
        .option('output', {
          alias: 'o',
          describe: 'Set the output file',
          requiresArg: true,
          type: 'string',
        }),
    handler: execFormat,
  })
  .command({
    command: 'validate [file]',
    describe: 'Validate a resume.',
    handler: execValidate,
  })
  .strict().argv;
