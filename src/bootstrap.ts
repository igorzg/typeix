import {Injector} from "./injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Request} from "./request";
import {Router} from "./router/router";
import {Logger} from "./logger/logger";
import {isString, isArray} from "./core";
import {Metadata} from "./metadata";
import {IModuleMetadata} from "./interfaces/imodule";
/**
 * @since 1.0.0
 * @function
 * @name bootstrap
 * @param {Function} Class bootstrap class
 * @param {Number} port bootstrap on port
 * @param {String} hostname bootstrap on hostname
 * @returns {Injector}
 *
 * @description
 * Use bootstrap function to bootstrap an Module.
 */
export function bootstrap(Class: Function, port: number, hostname?: string): Injector {
  let injector = Injector.createAndResolve(Class, []);
  let server = createServer();
  server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    let childInjector = Injector.createAndResolveChild(
      injector,
      Request,
      [
        {provide: "request", useValue: request},
        {provide: "response", useValue: response}
      ]
    );
    request.on("end", () => childInjector.destroy());
  });
  if (isString(hostname)) {
    server.listen(port, hostname);
  } else {
    server.listen(port);
  }
  let logger: Logger = injector.get(Logger);
  logger.info("Module.info: Server started", {port, hostname});
  server.on("error", (e) => logger.error(e.stack));
  return injector;
}
/**
 * Module decorator
 * @decorator
 * @function
 * @name Module
 *
 * @param {IModuleMetadata} config
 * @returns {function(any): any}
 *
 * @description
 * Define module in your application
 *
 * @example
 * import {Module, Router} from "node-ee";
 *
 * \@Module({
 *  providers:[Router]
 * })
 * class Application{
 *    constructor(router: Router) {
 *
 *    }
 * }
 */
export var Module = (config: IModuleMetadata) => (Class) => {
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  // add logger to start of providers
  if (!Metadata.hasProvider(config.providers, Logger)) {
    config.providers.unshift(Logger);
  }
  // add router to default config
  if (!Metadata.hasProvider(config.providers, Router)) {
    config.providers.push(Router);
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
