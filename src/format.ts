/**
 * @file the format subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid, JSONResume } from '@ianprime0509/jsonresume-schema';
import { Arguments } from 'yargs';

import { error, readFile, writeFile } from './util';

/**
 * A theme for a JSON Resume.
 */
interface Theme {
  render(resume: JSONResume): string;
}

/**
 * Executes the format subcommand.
 *
 * @param args command-line options for the subcommand
 */
export default async function exec(args: Arguments) {
  const inputFile = args.file || '-';
  let resume: any;
  try {
    resume = JSON.parse(await readFile(inputFile));
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(error(`Invalid JSON: ${e.message}`));
    }
    process.exitCode = 1;
    return;
  }

  if (isValid(resume)) {
    const rendered = await render(resume, args.theme || 'basic');
    const outputFile = args.output || '-';
    return writeFile(outputFile, rendered);
  } else {
    // TODO: show validation errors.
    console.error(error('Invalid resume input.'));
    process.exitCode = 1;
  }
}

async function render(resume: JSONResume, themeName: string): Promise<string> {
  const theme = (await import(themeName)) as Theme;
  return theme.render(resume);
}
