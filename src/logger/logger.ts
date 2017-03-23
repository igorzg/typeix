import {Level} from "./level";
import {Log} from "./log";
import {Injectable} from "../decorators/injectable";
import {isEqual} from "../core";

/**
 * @since 1.0.0
 * @enum
 * @name LogLevels
 */
export enum LogLevels {
  DEBUG = 10,
  TRACE = 20,
  INFO = 30,
  BENCHMARK = 40,
  WARN = 60,
  ERROR = 80,
  FATAL = 100
}
/**
 * @since 1.0.0
 * @name Logger
 *
 * @constructor
 * @description
 * Logger is a component in easy node application.
 * Logger handler for easy node, there a various type of logs
 * [INFO, TRACE, DEBUG, WARN, ERROR, FATAL]
 * By default only ERROR and FATAL are enabled in production mode.
 * Logger in system is delivered as component
 * @example
 */
@Injectable()
export class Logger {
  private hooks: Set<any> = new Set();
  private levels: Array<Level> = [];
  private enabled: boolean = false;
  private debugLevel: LogLevels = LogLevels.ERROR;

  constructor() {
    this.levels.push(new Level("TRACE", LogLevels.TRACE, console.info));
    this.levels.push(new Level("INFO", LogLevels.INFO, console.info));
    this.levels.push(new Level("DEBUG", LogLevels.DEBUG, console.info));
    this.levels.push(new Level("WARN", LogLevels.WARN, console.warn));
    this.levels.push(new Level("BENCHMARK", LogLevels.BENCHMARK, console.info));
    this.levels.push(new Level("ERROR", LogLevels.ERROR, console.error));
    this.levels.push(new Level("FATAL", LogLevels.FATAL, console.error));
  }
  /**
   * @since 1.0.0
   * @function
   * @name Logger#isDebugLevel
   *
   * @description
   * Check if is certian log level
   */
  isDebugLevel(logLevel: LogLevels): boolean {
    return isEqual(this.debugLevel, logLevel);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#setDebugLevel
   *
   * @description
   * Set debug level
   */
  setDebugLevel(value: LogLevels) {
    this.debugLevel = value;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#enable
   *
   * @description
   * enable logger
   */
  enable() {
    this.enabled = true;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#printToConsole
   *
   * @description
   * Print to console logs
   */
  printToConsole() {
    this.levels.forEach((item: Level) =>
      this.addHook((log: Log) => {
        if (log.getLevel() === item.getLevel()) {
          item.exec(log.prettify());
        }
      })
    );
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#trace
   *
   * @description
   * Trace
   */
  trace(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.TRACE));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#info
   *
   * @description
   * Log info case
   */
  info(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.INFO));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#debug
   *
   * @description
   * Debug
   */
  debug(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.DEBUG));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#warn
   *
   * @description
   * Log warn case
   */
  warn(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.WARN));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#benchmark
   *
   * @description
   * Benchmarking pourposes
   */
  benchmark(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.BENCHMARK));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#error
   *
   * @description
   * Log error case
   */
  error(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.ERROR));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#fatal
   *
   * @description
   * Fatal error
   */
  fatal(message, ...args): boolean {
    return this.log(message, args, this.filter(LogLevels.FATAL));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#filter
   * @private
   * @description
   * Get level name
   * This is used internally by logger class
   */
  filter(level: LogLevels): Level {
    return <Level> this.levels.find((item: Level) => {
      return item.getLevel() === level;
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#addHook
   * @param {Function} callback
   *
   * @description
   * Add hook to log output so developer can extend where to store log
   */
  addHook(callback: Function): void {
    this.hooks.add(callback);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Logger#log
   * @private
   * @description
   * Write to file and exec hooks
   */
  private log(message, data, level: Level): boolean {
    if (!this.enabled || level.getLevel() < this.debugLevel) {
      return false;
    }
    this.hooks.forEach(hook => hook(new Log(message, data, level)));
    return true;
  }

}
