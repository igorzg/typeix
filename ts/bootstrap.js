var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var injector_1 = require('./injector');
var http_1 = require('http');
var request_1 = require('./request');
var router_1 = require('./router');
var logger_1 = require('./logger');
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name bootstrap
 * @param {String} name of instance
 * @param {Function} Class
 * @returns {Injector}
 *
 * @description
 * Use bootstrap function to bootstrap an application.
 *
 * @example
 * import {bootstrap, Router} from 'typeix/core'
 *
 * class App{
 *    constructor(router: Router) {
 *
 *    }
 * }
 * bootstrap(App);
 */
function bootstrap(Class) {
    let injector = injector_1.Injector.createAndResolve(Class, injector_1.Injector.getMetadata(Class));
    let server = http_1.createServer();
    server.on('request', (request, response) => {
        let childInjector = injector_1.Injector.createAndResolveChild(injector, request_1.Request, [request, response, injector, logger_1.Logger, router_1.Router]);
        request.on('end', () => childInjector.destroy());
    });
    server.listen(5000);
    return injector;
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map