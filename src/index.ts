/**
 * @file the main entry point of the CLI
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import * as process from 'process';

import program from 'commander';

import execFormat from './format';
import execNew from './new';

program.version('0.1.0');

program
  .command('new')
  .description('create a new resume')
  .option('-o, --output <file>', 'set the output file', '-')
  .action(execNew);

program
  .command('format [file]')
  .description('format a resume')
  .option('-t, --theme <theme>', 'set the theme to use')
  .action(execFormat);

program.parse(process.argv);
