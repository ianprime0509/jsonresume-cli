/**
 * @file utility commands
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import chalk from 'chalk';
import { readFile as readFileNode, writeFile as writeFileNode } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFileNode);
const writeFileAsync = promisify(writeFileNode);

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
 */
export async function writeFile(file: string, contents: string): Promise<void> {
  if (file === '-') {
    process.stdout.write(contents);
  } else {
    return writeFileAsync(file === '-' ? 1 : file, contents);
  }
}

/**
 * Renders an error message to be printed to the console.
 */
export const error = chalk.bold.red;
