'use strict';
var util_1 = require('util');
var core_1 = require('./core');
// cleanups on inspect
let replace = [];
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
class Level {
    constructor(name, level, callback) {
        this.name = name;
        this.level = level;
        this.callback = callback;
    }
    getName() {
        return this.name;
    }
    getLevel() {
        return this.level;
    }
    call(...args) {
        return this.callback(...args);
    }
}
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @name Log
 * @private
 * @constructor
 * @description
 * Log is private class used by logger to present logs to outputs
 */
class Log {
    constructor(message, data, level) {
        this.message = message;
        this.level = level;
        this.created = new Date().toISOString();
        this.data = data instanceof Error ? data.stack : data;
    }
    getName() {
        return this.level.getName();
    }
    getLevel() {
        return this.level.getLevel();
    }
    prettify(prettify) {
        let log = Logger.inspect({
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
    }
    toString() {
        return JSON.stringify(this.prettify(true));
    }
}
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
class Logger {
    constructor() {
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
            this.levels.forEach((item) => this.addHook((log) => {
                if (log.getLevel() === item.getLevel()) {
                    item.call(log.prettify());
                }
            }));
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
    trace(message, ...args) {
        return this.log(message, args, this.filter(10));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#info
     *
     * @description
     * Log info case
     */
    info(message, ...args) {
        return this.log(message, args, this.filter(20));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#debug
     *
     * @description
     * Debug
     */
    debug(message, ...args) {
        return this.log(message, args, this.filter(30));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#warn
     *
     * @description
     * Log warn case
     */
    warn(message, ...args) {
        return this.log(message, args, this.filter(40));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#error
     *
     * @description
     * Log error case
     */
    error(message, ...args) {
        return this.log(message, args, this.filter(50));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#fatal
     *
     * @description
     * Fatal error
     */
    fatal(message, ...args) {
        return this.log(message, args, this.filter(60));
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#filter
     * @private
     * @description
     * Get level name
     * This is used internally by logger class
     */
    filter(level) {
        return this.levels.find(item => {
            return item.getLevel() === level;
        });
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#log
     * @private
     * @description
     * Write to file and exec hooks
     */
    log(message, data, level) {
        if (!this.enabled || level.getLevel() < this.debugLevel) {
            return false;
        }
        this.hooks.forEach(hook => hook(new Log(message, data, level)));
        return true;
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#addHook
     * @param {Function} callback
     *
     * @description
     * Add hook to log output so developer can extend where to store log
     */
    addHook(callback) {
        this.hooks.add(callback);
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#clean
     * @param {String} message
     * @description
     * Clean inspect message
     * @return {String} message
     */
    static clean(message) {
        if (core_1.isString(message)) {
            replace.forEach(value => {
                message = message.replace(value, '');
            });
            message = message.replace(/\\'/g, '\'');
            message = message.replace(/\\n/g, '\n');
            return message.replace(/\\u001b/g, '\u001b');
        }
        return message;
    }
    /**
     * @since 1.0.0
     * @function
     * @name Logger#inspect
     * @param {Object} data
     * @param {Number} level
     * @description
     * Inspect log data output
     */
    static inspect(data, level) {
        return util_1.inspect(data, { colors: true, depth: level });
    }
}
Logger.inspectLevel = 5;
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map