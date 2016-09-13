import {inspect, clean} from "./inspect";
import {Level} from "./level";
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Log
 * @private
 * @constructor
 * @description
 * Log is private class used by logger to present logs to outputs
 */
export class Log {
  private data: any;
  private created: string = new Date().toISOString();

  constructor(private message: string, data: any, private level: Level) {
    this.data = data instanceof Error ? data.stack : data;
  }
  /**
   * @since 1.0.0
   * @function
   * @name Log#getName
   *
   * @description
   * Get log level name
   */
  getName(): string {
    return this.level.getName();
  }
  /**
   * @since 1.0.0
   * @function
   * @name Log#getLevel
   *
   * @description
   * Get log level name
   */
  getLevel(): number {
    return this.level.getLevel();
  }
  /**
   * @since 1.0.0
   * @function
   * @name Level#prettify
   *
   * @description
   * Prettify output and print it
   */
  prettify(prettify?: boolean): string {

    let log = inspect({
      created: this.created,
      data: this.data,
      level: this.getLevel(),
      message: this.message,
      type: this.getName()
    }, 5);

    if (!!prettify) {
      log = clean(log);
    }

    return log;
  }
  /**
   * @since 1.0.0
   * @function
   * @name Level#toString
   *
   * @description
   * Convert log to string so we can write it on file for example
   */
  toString(): string {
    return JSON.stringify(this.prettify(true));
  }
}
