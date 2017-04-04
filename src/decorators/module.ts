import {IModuleMetadata} from "../interfaces/imodule";
import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
import {Router} from "../router/router";
import {Logger} from "../logger/logger";

/**
 * Check if data is in array
 * @param data
 * @param token
 * @return {boolean}
 */
function inArray(data: Array<any>, token: any): boolean {
  return data.indexOf(token) === -1;
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
  if (inArray(config.providers, Logger) && !inArray(config.exports, Logger)) {
    config.exports.unshift(Logger);
  }
  if (inArray(config.providers, Router) && !inArray(config.exports, Router)) {
    config.exports.unshift(Router);
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
