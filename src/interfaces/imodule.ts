import {IProvider} from "./iprovider";
import {IResolvedRoute, RouteRuleConfig} from "./iroute";
import {Injector} from "../injector/injector";
/**
 * @since 1.0.0
 * @interface
 * @name IModuleMetadata
 * @param {Array<Function|IProvider>} imports
 * @param {Array<Function|IProvider>} exports
 * @param {String} name
 * @param {Array<IModuleMetadata>} modules
 * @param {Array<IProvider|Function>} controllers
 * @param {Array<IProvider|Function>} providers
 *
 * @description
 * Bootstrap class config metadata
 */
export interface IModuleMetadata {
  imports?: Array<Function | IProvider>;
  exports?: Array<Function | IProvider>;
  name?: string;
  controllers?: Array<IProvider | Function>;
  sockets?: Array<IProvider | Function>;
  providers?: Array<IProvider | Function>;
}

/**
 * @since 1.0.0
 * @interface
 * @name IModule
 * @param {Injector} injector
 * @param {string} name
 *
 * @description
 * Bootstraped module injector instance
 */
export interface IModule {
  injector: Injector;
  provider: IProvider;
  name: string;
}
/**
 * @since 1.0.0
 * @interface
 * @name IResolvedModule
 * @param {Object} module
 * @param {Array<Buffer>} data
 * @param {String} controller
 * @param {String} action
 *
 * @description
 * Resolved module data from resolved route
 */
export interface IResolvedModule {
  module: IModule;
  data?: Array<Buffer>;
  resolvedRoute: IResolvedRoute;
  controller: string;
  action: string;
}
