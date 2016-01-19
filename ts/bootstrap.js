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
    var injector = injector_1.Injector.createAndResolve(Class, injector_1.Injector.getMetadata(Class));
    var server = http_1.createServer();
    server.on('request', function (request, response) {
        var childInjector = injector_1.Injector.createAndResolveChild(injector, request_1.Request, [request, response, injector, logger_1.Logger, router_1.Router]);
        request.on('end', function () { return childInjector.destroy(); });
    });
    server.listen(5000);
    return injector;
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map