/**
 * @file the new subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { Arguments } from 'yargs';

/**
 * Executes the new subcommand.
 *
 * @param args command-line options for the subcommand
 */
export default async function exec(args: Arguments) {
  const file = args.file || '-';
  console.log(`Output to ${file}`);
}
