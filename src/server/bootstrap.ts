import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {IncomingMessage, ServerResponse} from "http";
import {isArray, isEqual, isFalsy, isTruthy, uuid} from "../core";
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
 * @name doModulesDuplicationCheck
 * @param {Array<IModule>} modules
 * @param {IModuleMetadata} metadata
 * @param {IProvider} provider
 */
export function doModulesDuplicationCheck(modules: Array<IModule>, metadata: IModuleMetadata, provider: IProvider) {
  let duplicationCheck = modules.slice();
  /**
   * Duplication check
   */
  while (duplicationCheck.length) {
    let importedModule: IModule = duplicationCheck.pop();
    /**
     * Provider duplication check
     */
    if (!isEqual(provider, importedModule) && isEqual(metadata.name, importedModule.name)) {
      let message = "Multiple modules with same name detected! Module name: ";
      message += importedModule.name + " is defined in modules: [" + Metadata.getName(provider) + ", ";
      message += Metadata.getName(importedModule) + "]";
      message += " Please provide unique names to modules!";
      throw new Error(message);
    }
  }
}
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
export function getModule(modules: Array<IModule>, name: string = BOOTSTRAP_MODULE): IModule {
  return modules.find(item => item.name === name);
}
/**
 * @since 1.0.0
 * @function
 * @name createModule
 * @param {Provider|Function} Class
 * @param {Injector} sibling
 * @param {Array<IModule>} modules list
 *
 * @description
 * Bootstrap modules recursive handler imported modules and export services which is needed
 *
 */
export function createModule(Class: IProvider | Function, sibling?: Injector, modules = []): Array<IModule> {

  let provider: IProvider = Metadata.verifyProvider(Class);
  let metadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);

  // Check if module is present then return module reference list
  if (isTruthy(getModule(modules, metadata.name))) {
    return modules;
  }

  // Create new injector instance
  let injector = new Injector();
  let providers: Array<IProvider> = [];
  // Set name for provider
  injector.setName(provider);

  // Create instance of Router && Logger if thy are provided

  BOOTSTRAP_PROVIDERS.forEach(iClass => {
    if (Metadata.inProviders(metadata.providers, iClass)) {
      injector.createAndResolve(Metadata.verifyProvider(iClass), []);
    } else if (isTruthy(sibling) && sibling.has(iClass)) {
      injector.set(iClass, sibling.get(iClass));
    }
  });
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
        let importModules = createModule(importModule, injector, modules);
        let module = getModule(importModules, importMetadata.name);
        /**
         * Export providers to importers
         */
        if (isArray(importMetadata.exports)) {
          providers = providers.concat(importMetadata.exports.map((iClass: IProvider) => {
            return {
              provide: iClass,
              useValue: module.injector.get(iClass)
            };
          }));
        }
        modules = importModules.filter((bI: IModule) => isFalsy(modules.find((aI: IModule) => aI.name === bI.name))).concat(modules);
      } else {
        let module: IModule = getModule(modules, importMetadata.name);
        /**
         * Export providers to importers
         */
        if (isArray(importMetadata.exports)) {
          providers = providers.concat(importMetadata.exports.map((iClass: IProvider) => {
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
  injector.createAndResolve(provider, providers);
  /**
   * Check duplicates
   */
  doModulesDuplicationCheck(modules, metadata, provider);
  /**
   * Add module to list
   */
  modules.push({
    injector,
    provider,
    name: metadata.name
  });

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
