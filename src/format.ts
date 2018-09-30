/**
 * @file the format subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid, JSONResume } from '@ianprime0509/jsonresume-schema';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { Arguments } from 'yargs';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

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
  // Read from stdin (file descriptor 0) if the file is '-'.
  const resume = JSON.parse(
    await readFileAsync(inputFile === '-' ? 0 : inputFile, {
      encoding: 'UTF-8',
    }),
  );

  if (isValid(resume)) {
    const rendered = await render(resume, args.theme || 'basic');
    const outputFile = args.output || '-';
    // Write to stdout (file descriptor 1) if the file is '-'.
    return writeFileAsync(outputFile === '-' ? 1 : outputFile, rendered);
  }
}

async function render(resume: JSONResume, themeName: string): Promise<string> {
  const theme = (await import(themeName)) as Theme;
  return theme.render(resume);
}
