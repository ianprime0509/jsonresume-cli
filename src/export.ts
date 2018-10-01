/**
 * @file the export subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { isValid, JSONResume, validate } from '@ianprime0509/jsonresume-schema';
import { Arguments } from 'yargs';

import { logError } from './log';
import { loadTheme, readFile, Theme, writeFile } from './util';

/**
 * The default theme to use.
 */
const DEFAULT_THEME = 'even';

/**
 * The prefix that should be at the start of every theme package.
 */
const THEME_PREFIX = 'jsonresume-theme-';

/**
 * Executes the export subcommand.
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
      logError(`Invalid JSON: ${e.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const errors = validate(resume);
  if (errors.length === 0) {
    let rendered: string;
    try {
      rendered = await render(resume, args.theme || DEFAULT_THEME);
    } catch (e) {
      logError(e instanceof Error ? e.message : e);
      process.exitCode = 1;
      return;
    }
    const outputFile = args.output || '-';
    return writeFile(outputFile, rendered);
  } else {
    logError('Invalid resume input:');
    errors.forEach(logError);
    process.exitCode = 1;
  }
}

/**
 * Renders the given resume.
 *
 * @param resume the resume to render
 * @param themeName the name of the theme module to use
 * @returns the rendered resume
 * @throws an error containing a message if any errors occur during rendering
 */
async function render(resume: JSONResume, themeName: string): Promise<string> {
  // Make sure the theme name starts with 'jsonresume-theme-'.
  if (!themeName.startsWith(THEME_PREFIX)) {
    themeName = THEME_PREFIX + themeName;
  }
  let theme: Theme;
  try {
    theme = await loadTheme(themeName);
  } catch (e) {
    throw new Error(`Could not load theme ${themeName}: ${e}`);
  }
  return theme.render(resume);
}
