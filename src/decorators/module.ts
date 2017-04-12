import {IModuleMetadata} from "../interfaces/imodule";
import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
import {Router} from "../router/router";
import {Logger} from "../logger/logger";


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
 * import {Module, Router} from "typeix";
 *
 * \@Module({
 *  providers:[Logger, Router]
 * })
 * class Application{
 *    constructor(router: Router) {
 *
 *    }
 * }
 */
export let Module = (config: IModuleMetadata) => (Class) => {
  if (!isClass(Class)) {
    throw new TypeError(`@Module is allowed only on class`);
  }
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  if (!isArray(config.exports)) {
    config.exports = [];
  }
  if (Metadata.inProviders(config.providers, Logger) && !Metadata.inProviders(config.exports, Logger)) {
    config.exports.unshift(Logger);
  }
  if (Metadata.inProviders(config.providers, Router) && !Metadata.inProviders(config.exports, Router)) {
    config.exports.unshift(Router);
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
