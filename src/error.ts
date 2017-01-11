import {inspect} from "./logger/inspect";
import {Status} from "./server/status-code";
import {isTruthy} from "./core";
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
  constructor(private code: Status | number, message?: string, data?: Object) {
    super(message);
    if (isTruthy(data)) {
      this.stack += "\n\nDATA: " + inspect(data, 5);
    }
    this.stack += "\n\nCODE: " + inspect(code, 5);
  }

  getMessage() {
    return this.message;
  }

  getCode(): Status {
    return this.code;
  }

  toString() {
    return this.stack;
  }
}
