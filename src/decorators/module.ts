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
  if (config.exports.indexOf(Logger) === -1) {
    config.exports.push(Logger);
  }
  if (config.exports.indexOf(Router) === -1) {
    config.exports.push(Router);
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
