var util_1 = require('util');
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
class HttpError extends Error {
    constructor(code, message, data) {
        super(message);
        this.stack += '\n\nDATA: ' + util_1.inspect(data, { colors: true, depth: 5 });
        this.stack += '\n\nCODE: ' + util_1.inspect(code, { colors: true, depth: 5 });
    }
    toString() {
        return this.stack;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=error.js.map