'use strict';
var util_1 = require('util');
var core_1 = require('./core');
// cleanups on inspect
var replace = [];
// remove colors from inspect
for (var i = 0; i < 100; ++i) {
    replace.push(new RegExp('\\[' + i + 'm', 'ig'));
}
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Level
 * @private
 * @constructor
 * @description
 * Level is private class used by logger to define log levels
 */
var Level = (function () {
    function Level(name, level, callback) {
        this.name = name;
        this.level = level;
        this.callback = callback;
    }
    Level.prototype.getName = function () {
        return this.name;
    };
    Level.prototype.getLevel = function () {
        return this.level;
    };
    Level.prototype.call = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this.callback.apply(this, args);
    };
    return Level;
})();
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Log
 * @private
 * @constructor
 * @description
 * Log is private class used by logger to present logs to outputs
 */
var Log = (function () {
    function Log(message, data, level) {
        this.message = message;
        this.level = level;
        this.created = new Date().toISOString();
        this.data = data instanceof Error ? data.stack : data;
    }
    Log.prototype.getName = function () {
        return this.level.getName();
    };
    Log.prototype.getLevel = function () {
        return this.level.getLevel();
    };
    Log.prototype.prettify = function (prettify) {
        var log = Logger.inspect({
            level: this.getLevel(),
            type: this.getName(),
            message: this.message,
            data: this.data,
            created: this.created
        }, Logger.inspectLevel);
        if (!!prettify) {
            log = Logger.clean(log);
        }
        return log;
    };
    Log.prototype.toString = function () {
        return JSON.stringify(this.prettify(true));
    };
    return Log;
})();
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Logger
 *
 * @constructor
 * @description
 * Logger is a component in easy node application.
 * Logger handler for easy node, there a various type of logs
 * [INFO, TRACE, DEBUG, WARN, ERROR, FATAL]
 * By default only ERROR and FATAL are enabled in production mode.
 * Logger in system is delivered as component
 * @example
 */
var Logger = (function () {
    function Logger() {
        var _this = this;
        this.hooks = new Set();
        this.levels = [];
        this.enabled = true;
        this.console = true;
        this.debugLevel = 10;
        this.levels.push(new Level('TRACE', 10, console.info));
        this.levels.push(new Level('INFO', 20, console.info));
        this.levels.push(new Level('DEBUG', 30, console.info));
        this.levels.push(new Level('WARN', 40, console.warn));
        this.levels.push(new Level('ERROR', 50, console.error));
        this.levels.push(new Level('FATAL', 60, console.error));
        if (this.console) {
            this.levels.forEach(function (item) {
                return _this.addHook(function (log) {
                    if (log.getLevel() === item.getLevel()) {
                        item.call(log.prettify());
                    }
                });
            });
        }
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#trace
     *
     * @description
     * Trace
     */
    Logger.prototype.trace = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(10));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#info
     *
     * @description
     * Log info case
     */
    Logger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(20));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#debug
     *
     * @description
     * Debug
     */
    Logger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(30));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#warn
     *
     * @description
     * Log warn case
     */
    Logger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(40));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#error
     *
     * @description
     * Log error case
     */
    Logger.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(50));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#fatal
     *
     * @description
     * Fatal error
     */
    Logger.prototype.fatal = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.log(message, args, this.filter(60));
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#filter
     * @private
     * @description
     * Get level name
     * This is used internally by logger class
     */
    Logger.prototype.filter = function (level) {
        return this.levels.find(function (item) {
            return item.getLevel() === level;
        });
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#log
     * @private
     * @description
     * Write to file and exec hooks
     */
    Logger.prototype.log = function (message, data, level) {
        if (!this.enabled || level.getLevel() < this.debugLevel) {
            return false;
        }
        this.hooks.forEach(function (hook) { return hook(new Log(message, data, level)); });
        return true;
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#addHook
     * @param {Function} callback
     *
     * @description
     * Add hook to log output so developer can extend where to store log
     */
    Logger.prototype.addHook = function (callback) {
        this.hooks.add(callback);
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#clean
     * @param {String} message
     * @description
     * Clean inspect message
     * @return {String} message
     */
    Logger.clean = function (message) {
        if (core_1.isString(message)) {
            replace.forEach(function (value) {
                message = message.replace(value, '');
            });
            message = message.replace(/\\'/g, '\'');
            message = message.replace(/\\n/g, '\n');
            return message.replace(/\\u001b/g, '\u001b');
        }
        return message;
    };
    /**
     * @since 1.0.0
     * @function
     * @name Logger#inspect
     * @param {Object} data
     * @param {Number} level
     * @description
     * Inspect log data output
     */
    Logger.inspect = function (data, level) {
        return util_1.inspect(data, { colors: true, depth: level });
    };
    Logger.inspectLevel = 5;
    return Logger;
})();
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map