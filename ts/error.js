var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError(code, message, data) {
        _super.call(this, message);
        this.stack += '\n\nDATA: ' + util_1.inspect(data, { colors: true, depth: 5 });
        this.stack += '\n\nCODE: ' + util_1.inspect(code, { colors: true, depth: 5 });
    }
    HttpError.prototype.toString = function () {
        return this.stack;
    };
    return HttpError;
})(Error);
exports.HttpError = HttpError;
//# sourceMappingURL=error.js.map