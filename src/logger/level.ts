/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Level
 * @private
 * @constructor
 * @description
 * Level is private class used by logger to define log levels
 */
export class Level {
	constructor(private name: string,
	            private level: number,
	            private callback: Function) {
	}
  /**
   * @since 1.0.0
   * @function
   * @name Level#getName
   *
   * @description
   * Get level name
   */
	getName(): string {
		return this.name;
	}
  /**
   * @since 1.0.0
   * @function
   * @name Level#getLevel
   *
   * @description
   * Get level value
   */
	getLevel(): number {
		return this.level;
	}
  /**
   * @since 1.0.0
   * @function
   * @name Level#exec
   *
   * @description
   * Execute hook
   */
	exec(...args) {
		return this.callback(...args);
	}
}
