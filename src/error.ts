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
 * HttpException use it in endpoint actions
 */
export class HttpError extends Error {

  static merge(error: Error) {
    if (!(error instanceof HttpError)) {
      let _error: Error = error;
      error = new HttpError(Status.Internal_Server_Error, _error.message, {});
      error.stack = _error.stack;
    }
    return error;
  }

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
