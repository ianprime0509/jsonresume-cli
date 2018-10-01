/**
 * @file logging functions and utilities
 * @author Ian Johnson <ianprime0509@gmail.com>
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
});

/**
 * Logs a message.
 *
 * @param level the log level for this entry
 * @param message the message for this entry
 */
export function log(level: string, message: string) {
  logger.log(level, message);
}

/**
 * A shortcut for `log('error', message)`.
 */
export function logError(message: string) {
  log('error', message);
}

/**
 * Mutes all logging output.
 */
export function mute() {
  logger.silent = true;
}

/**
 * Unmutes all logging output.
 */
export function unmute() {
  logger.silent = false;
}
