import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {IncomingMessage, ServerResponse} from "http";
import {isArray, isFalsy, isPresent, isTruthy, uuid} from "../core";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {RequestResolver} from "./request-resolver";
import {parse} from "url";
import {IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {Status} from "./status-code";
import {Router} from "../router/router";

export const BOOTSTRAP_PROVIDERS = [Logger, Router];
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
 *
 * I know this logic looks very weird but logic should be like this:
 *
 * 1. Each module must have own unique injector
 * 2. Root module must initialize Logger and Router first if thy are defined as providers because we want to share same instance to all modules
 * 3. Create imported modules and expose exports to parents
 * 4. All imports must be initialized before module which imports them
 * 5. Root module must be initialized last because it's last on import chain
 */
export function createModule(Class: IProvider|Function, parent?: Injector, exp?: Array<IProvider|Function>): Array<IModule> {
  let modules = [];
  let provider = Metadata.verifyProvider(Class);
  let metadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);
  let providers = [];
  let injector = new Injector();

  /**
   * Initialize Logger and router only if thy are defined!
   */
  if (isArray(metadata.providers) && isFalsy(parent)) {
    Metadata.verifyProviders(metadata.providers)
      .forEach((cProvider: IProvider) => injector.createAndResolve(cProvider, providers));
  } else if (isArray(metadata.providers) && isTruthy(parent)) {
    Metadata.verifyProviders(metadata.providers).forEach((cProvider: IProvider) => {
      if (BOOTSTRAP_PROVIDERS.indexOf(cProvider.provide) === -1) {
        injector.createAndResolve(cProvider, providers);
      }
    });
  }

  /**
   * Handle parent exports
   */
  if (isArray(exp) && isPresent(parent)) {
    providers = exp.map(iClass => {
      return {
        provide: iClass,
        useValue: parent.get(iClass)
      };
    });
    /**
     * Expose exports to importers
     */
    providers.forEach(item => {
      if (!injector.has(item.provide)) {
        injector.set(item.provide, item.useValue);
      }
    });
  }

  /**
   * Imports must be initialized before first
   */
  if (isArray(metadata.imports)) {
    metadata.imports.forEach(importModule => {
      let importProvider = Metadata.verifyProvider(importModule);
      let importMetadata: IModuleMetadata = Metadata.getComponentConfig(importProvider.provide);

      /**
       * Create module only if is not already created
       */
      if (isFalsy(getModule(modules, importMetadata.name))) {
        /**
         * Create module first
         * @type {Array<IModule>}
         */
        let importModules = createModule(importModule, injector, metadata.exports);
        let module = getModule(importModules, importMetadata.name);
        /**
         * Export it's exports to child modules to not only to parents!
         * Handler for child exports
         */
        if (isArray(importMetadata.exports)) {
          providers = providers.concat(importMetadata.exports.map(iClass => {
            return {
              provide: iClass,
              useValue: module.injector.get(iClass)
            };
          }));
        }
        modules = modules.concat(importModules);
      } else {
        let module = getModule(modules, importMetadata.name);
        /**
         * Export it's exports to child modules to not only to parents!
         * Handler for child exports
         */
        if (isArray(importMetadata.exports)) {
          providers = providers.concat(importMetadata.exports.map(iClass => {
            return {
              provide: iClass,
              useValue: module.injector.get(iClass)
            };
          }));
        }
      }
    });
  }

  /**
   * Create module after imports are initialized
   */
  injector.createAndResolve(Metadata.verifyProvider(Class), providers);

  modules.push({
    injector,
    provider: Class,
    name: metadata.name
  });

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
      {provide: "statusCode", useValue: Status.OK},
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
