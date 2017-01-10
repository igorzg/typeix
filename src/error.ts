import {inspect} from "./logger/inspect";
import {StatusCode} from "./server/status-code";
/**
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
  constructor(private code: StatusCode | number, message, data) {
    super(message);
    this.stack += "\n\nDATA: " + inspect(data, 5);
    this.stack += "\n\nCODE: " + inspect(code, 5);
  }

  getCode(): StatusCode {
    return this.code;
  }

  toString() {
    return this.stack;
  }
}
