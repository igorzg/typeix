import {Level} from "./logger/level";
import {Log} from "./logger/log";
import {Injectable} from "../decorators";
/**
 * @license Mit Licence 2015
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
  private enabled: boolean = true;
  private console: boolean = true;
  private debugLevel: number = 10;

  constructor() {

    this.levels.push(new Level("TRACE", 10, console.info));
    this.levels.push(new Level("INFO", 20, console.info));
    this.levels.push(new Level("DEBUG", 30, console.info));
    this.levels.push(new Level("WARN", 40, console.warn));
    this.levels.push(new Level("ERROR", 50, console.error));
    this.levels.push(new Level("FATAL", 60, console.error));


    if (this.console) {
      this.levels.forEach((item: Level) =>
        this.addHook((log: Log) => {
          if (log.getLevel() === item.getLevel()) {
            item.exec(log.prettify());
          }
        })
      );
    }
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
    return this.log(message, args, this.filter(10));
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
    return this.log(message, args, this.filter(20));
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
    return this.log(message, args, this.filter(30));
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
    return this.log(message, args, this.filter(40));
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
    return this.log(message, args, this.filter(50));
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
    return this.log(message, args, this.filter(60));
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
  filter(level: number): Level {
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
