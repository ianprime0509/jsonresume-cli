/**
 * @file the format subcommand
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */

interface Options {
  theme?: string;
}

export default function(file: string | undefined, options: Options) {
  console.log(`File ${file}`);
  console.log(`Theme: ${options.theme}`);
}
