import { inspect } from 'util';
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @class
 * @name HttpException
 * @param {Number} code status code
 * @param {String} message
 * @param {Object} data
 * @constructor
 * @description
 * HttpException use it in controller actions
 */
export class HttpError extends Error {
	constructor(code, message, data) {
		super(message);
		this.stack += '\n\nDATA: ' + inspect(data, {colors: true, depth: 5});
		this.stack += '\n\nCODE: ' + inspect(code, {colors: true, depth: 5});
	}

	toString() {
		return this.stack;
	}
}