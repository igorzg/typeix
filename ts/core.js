/**
 * @since 1.0.0
 * @function
 * @name uuid
 * @description
 * Generate universally unique identifier
 * @return {String}
 * @example
 * uuid();
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        if (c === 'x') {
            return r.toString(16);
        }
        return (r & 0x3 | 0x8).toString(16);
    });
}
exports.uuid = uuid;
/**
 * @since 1.0.0
 * @function
 * @name isString
 * @description
 * Check if value is string
 * @return {Boolean}
 * @example
 * isString();
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * @since 1.0.0
 * @function
 * @name isBoolean
 * @description
 * Check if value is boolean
 * @return {Boolean}
 * @example
 * isBoolean();
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * @since 1.0.0
 * @function
 * @name isUndefined
 * @description
 * Check if value is undefined
 * @return {Boolean}
 * @example
 * isString();
 */
function isUndefined(value) {
    return typeof value === "undefined";
}
exports.isUndefined = isUndefined;
/**
 * @since 1.0.0
 * @function
 * @name isNumber
 * @description
 * Check if value is number
 * @return {Boolean}
 * @example
 * isNumber();
 */
function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}
exports.isNumber = isNumber;
/**
 * @since 1.0.0
 * @function
 * @name isArray
 * @description
 * Check if value is array
 * @return {Boolean}
 * @example
 * isArray();
 */
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
/**
 * @since 1.0.0
 * @function
 * @name isNull
 * @description
 * Check if value is null
 * @return {Boolean}
 * @example
 * isNull();
 */
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
/**
 * @since 1.0.0
 * @function
 * @name isFunction
 * @description
 * Check if value is function
 * @return {Boolean}
 * @example
 * isFunction();
 */
function isFunction(value) {
    return typeof value === "function";
}
exports.isFunction = isFunction;
/**
 * @since 1.0.0
 * @function
 * @name isObject
 * @description
 * Check if value is object
 * @return {Boolean}
 * @example
 * isObject();
 */
function isObject(value) {
    return !isNull(value) && typeof value === "object";
}
exports.isObject = isObject;
/**
 * @since 1.0.0
 * @function
 * @name isDate
 * @description
 * Check if value is Date object
 * @return {Boolean}
 * @example
 * isDate();
 */
function isDate(value) {
    return Object.prototype.toString.call(value) === "[object Date]";
}
exports.isDate = isDate;
/**
 * @since 1.0.0
 * @function
 * @name isRegExp
 * @description
 * Check if value is RegExp object
 * @return {Boolean}
 * @example
 * isRegExp();
 */
function isRegExp(value) {
    return Object.prototype.toString.call(value) === "[object RegExp]";
}
exports.isRegExp = isRegExp;
//# sourceMappingURL=core.js.map