import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {IncomingMessage, ServerResponse} from "http";
import {ControllerResolver} from "./controller-resolver";
import {uuid, isArray} from "../core";
import {IModuleMetadata, IModule} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {RequestResolver} from "./request-resolver";
import {parse} from "url";
import {IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {StatusCode} from "./status-code";

export const BOOTSTRAP_MODULE = "root";

/**
 * @since 1.0.0
 * @function
 * @name getModule
 * @param {Array<IModule>} modules
 * @param {String} name
 *
 * @description
 * Find root module
 */
export function getModule(modules: Array<IModule>, name: string = BOOTSTRAP_MODULE) {
  return modules.find(item => item.name === name);
}
/**
 * @since 1.0.0
 * @function
 * @name createModule
 * @param {Provider|Function} Class
 * @param {Injector} parent
 * @param {Provider|Function} exp
 *
 * @description
 * Bootstrap modules recursive
 */
export function createModule(Class: IProvider|Function, parent?: Injector, exp?: Array<IProvider|Function>): Array<IModule> {
  let modules = [];
  let provider = Metadata.verifyProvider(Class);
  let metadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);
  // inject shared instance
  let injector = Injector.createAndResolve(Class, isArray(exp) ? exp.map(iClass => {
      return {
        provide: iClass,
        useValue: parent.get(iClass)
      };
    }) : []);

  modules.push({
    injector,
    provider: Class,
    name: metadata.name
  });

  if (isArray(metadata.imports)) {
    metadata.imports.forEach(importModule => modules = modules.concat(createModule(importModule, injector, metadata.exports)));
  }

  let duplicates = [];
  //@todo fix duplicates algorithm

  if (duplicates.indexOf(BOOTSTRAP_MODULE) > -1) {
    throw new Error(`Only one ${BOOTSTRAP_MODULE}" module is allowed. Please make sure that all child modules have defined name
     on @Module annotation and that any @Module name is not "${BOOTSTRAP_MODULE}"`);
  } else if (duplicates.length > 0) {
    throw new Error(`Modules must have unique names. Please make sure that all child modules have unique names duplicates: ${duplicates}`);
  }

  return modules;
}


/**
 * @since 1.0.0
 * @function
 * @name fireRequest
 * @param {Array<IModule>} modules list of all modules bootstraped
 * @param {IncomingMessage} request event emitter
 * @param {ServerResponse} response event emitter
 * @return {string|Buffer} data from controller
 *
 * @description
 * Use fireRequest to process request itself, this function is used by http/https server or
 * You can fire fake request
 */
export function fireRequest(modules: Array<IModule>,
                            request: IncomingMessage,
                            response: ServerResponse): Promise<string | Buffer> {

  let rootInjector = getModule(modules).injector;
  let logger = rootInjector.get(Logger);
  /**
   * Create RequestResolver injector
   */
  let routeResolverInjector = Injector.createAndResolveChild(
    rootInjector,
    RequestResolver,
    [
      {provide: "url", useValue: parse(request.url, true)},
      {provide: "UUID", useValue: uuid()},
      {provide: "data", useValue: []},
      {provide: "contentType", useValue: "text/html"},
      {provide: "statusCode", useValue: StatusCode.OK},
      {provide: "request", useValue: request},
      {provide: "response", useValue: response},
      {provide: "modules", useValue: modules},
      EventEmitter
    ]
  );
  /**
   * Get RequestResolver instance
   */
  let rRouteResolver: RequestResolver = routeResolverInjector.get(RequestResolver);

  /**
   * On finish destroy injector
   */
  response.on("finish", () => routeResolverInjector.destroy());

  return rRouteResolver
    .process()
    .catch(error =>
      logger.error("ControllerResolver.error", {
        stack: error.stack,
        url: request.url,
        error
      })
    );
}
