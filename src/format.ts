/**
 * @file the format subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid, JSONResume } from '@ianprime0509/jsonresume-schema';
import { Arguments } from 'yargs';

import { readFile, writeFile } from './util';

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
  const resume = JSON.parse(await readFile(inputFile));

  if (isValid(resume)) {
    const rendered = await render(resume, args.theme || 'basic');
    const outputFile = args.output || '-';
    return writeFile(outputFile, rendered);
  }
}

async function render(resume: JSONResume, themeName: string): Promise<string> {
  const theme = (await import(themeName)) as Theme;
  return theme.render(resume);
}
