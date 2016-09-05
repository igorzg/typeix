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

	getName(): string {
		return this.name;
	}

	getLevel(): number {
		return this.level;
	}

	exec(...args) {
		return this.callback(...args);
	}
}
