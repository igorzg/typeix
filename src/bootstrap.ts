import {Injector} from "./injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Request} from "./request";
import {Router} from "./router/router";
import {Logger} from "./logger/logger";
import {isString, isArray} from "./core";
import {Metadata, COMPONENT_CONFIG_KEYS} from "./metadata";
import {IBootstrapMetadata} from "./interfaces/ibootstrap";
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name bootstrap
 * @param {Object} Class bootstrap class
 * @param {IBootstrapMetadata} config
 * @returns {Injector}
 *
 * @description
 * Use bootstrap function to bootstrap an application.
 *
 * @example
 * import {bootstrap, Router} from "typeix/core"
 *
 * \@Bootstrap({
 *    port: 9000
 * })
 * class App{
 *    constructor(router: Router) {
 *
 *    }
 * }
 */
function bootstrap(Class: Function, config: IBootstrapMetadata): void {
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
  if (isString(config.hostname)) {
    server.listen(config.port, config.hostname);
  } else {
    server.listen(config.port);
  }
  let logger: Logger = injector.get(Logger);
  logger.info("Bootstrap.info: Server started", config);
  server.on("error", (e) => logger.error(e.stack));
}
/**
 * Bootstrap decorator
 * @param config
 * @returns {function(any): any}
 * @constructor
 */
export var Bootstrap = (config: IBootstrapMetadata) => (Class) => {
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
  Metadata.defineMetadata(Class, COMPONENT_CONFIG_KEYS, config);
  return bootstrap(Class, config);
};
