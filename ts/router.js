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
var error_1 = require('./error');
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @class
 * @name Router
 * @constructor
 * @description
 * Router is a component for handling routing in system.
 * All routes should be added during bootstrap process
 * @example
 * import { bootstrap, Bootstrap, Router } from '../core';
 * import { Assets } from './components/assets';
 *
 * \@Bootstrap()
 * export class Application {
 *   constructor(assets: Assets, router: Router) {
 *       router.add()
 *   }
 * }
 * bootstrap(Application);
 */
class Router {
    constructor(logger) {
        this.logger = logger;
        this.routes = [];
        this.methods = [
            'GET', 'HEAD', 'POST', 'PUT', 'DELETE',
            'TRACE', 'OPTIONS', 'CONNECT', 'PATCH'
        ];
    }
    /**
     * @since 1.0.0
     * @function
     * @name Router#add
     * @param {Array<Route>} rule
     *
     * @description
     * Add route to routes list.
     * All routes must be inherited from Route interface.
     */
    add(rule) {
        this.logger.info('Router.add', rule);
        rule.forEach(rule => this.routes.push(rule));
    }
    /**
     * @since 1.0.0

     * @function
     * @name Router#parseRequest
     * @param {String} pathName
     * @param {String} method
     * @param {Headers} headers
     *
     * @description
     * Parse request based on pathName and method
     */
    parseRequest(pathName, method, headers) {
        return __awaiter(this, void 0, Promise, function* () {
            for (let route of this.routes) {
                let result = yield route.parseRequest(pathName, method, headers);
                if (!!result) {
                    return result;
                }
            }
            throw new error_1.HttpError(404, `Router.parseRequest: ${pathName} no route found, method: ${method}`, {
                pathName,
                method
            });
        });
    }
    /**
     * @since 1.0.0

     * @function
     * @name Router#createUrl
     * @param {String} routeName
     * @param {RouteParams} params
     *
     * @description
     * Create url based on route and params
     */
    createUrl(routeName, params) {
        return __awaiter(this, void 0, Promise, function* () {
            for (let route of this.routes) {
                let result = yield route.createUrl(routeName, params);
                if (!!result) {
                    return result;
                }
            }
            if (params.size > 0) {
                routeName += '?';
                params.forEach((v, k) => {
                    routeName += k + '=' + encodeURIComponent(v);
                });
            }
            //return Promise.resolve('/' + routeName);
        });
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map