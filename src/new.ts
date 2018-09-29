/**
 * @file the new subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */

interface Options {
  output: string;
}

export default function(options: Options) {
  console.log(`Output to ${options.output}`);
}
