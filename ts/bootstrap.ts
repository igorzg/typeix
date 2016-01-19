import { Injector } from './injector';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Request } from './request';
import { Router } from './router';
import { Logger } from './logger';
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
export function bootstrap(Class: any): Injector{
    let injector = Injector.createAndResolve(Class, Injector.getMetadata(Class));
    let server = createServer();
    server.on('request', (request: IncomingMessage, response: ServerResponse) => {
        let childInjector = Injector.createAndResolveChild(
            injector,
            Request,
            [request, response, injector, Logger, Router]
        );
        request.on('end', () => childInjector.destroy());
    });
    server.listen(5000);
    return injector;
}