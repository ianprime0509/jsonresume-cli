/**
 * @file utility commands
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { JSONResume } from '@ianprime0509/jsonresume-schema';
import { exec } from 'child_process';
import { readFile as readFileNode, writeFile as writeFileNode } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const readFileAsync = promisify(readFileNode);
const writeFileAsync = promisify(writeFileNode);

/**
 * A theme for a JSON Resume.
 */
export interface Theme {
  render(resume: JSONResume): string;
}

/**
 * Loads a theme from the Node module with the given name.
 *
 * @param moduleName the complete name of the theme module to load (e.g.
 * 'jsonresume-theme-even')
 */
export async function loadTheme(moduleName: string): Promise<Theme> {
  let theme: any;

  // Try to load the module normally.
  try {
    theme = await import(moduleName);
  } catch (_) {
    // That failed; try to work around NODE_PATH not being set and try to find
    // global modules.
    try {
      const { stdout: npmRoot } = await execAsync('npm root -g');
      theme = await import(join(npmRoot, moduleName));
    } catch (e) {
      throw new Error(`Unable to load module ${moduleName}: ${e}`);
    }
  }

  // Ensure that the module that was loaded is actually a theme.
  if (!theme || !('render' in theme) || !(typeof theme.render === 'function')) {
    throw new Error(`${moduleName} is not a theme module.`);
  }
  return theme as Theme;
}

/**
 * Reads the contents of the given file asynchronously.
 *
 * @param file the path to the file to read, or '-' to read from stdin
 */
export async function readFile(file: string): Promise<string> {
  // stdin has file descriptor 0.
  return readFileAsync(file === '-' ? 0 : file, {
    encoding: 'UTF-8',
  });
}

/**
 * Writes the given string to the given file asynchronously.
 *
 * @param file the path of the file to write, or '-' to write to stdout
 * @param contents the contents to write to the file
 * @param overwrite whether to overwrite the file if it already exists
 */
export async function writeFile(
  file: string,
  contents: string,
  overwrite: boolean = false,
): Promise<void> {
  if (file === '-') {
    process.stdout.write(contents);
  } else {
    return writeFileAsync(file === '-' ? 1 : file, contents, {
      flag: overwrite ? 'w' : 'wx',
    });
  }
}
