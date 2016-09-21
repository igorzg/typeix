import {Logger} from "../logger/logger";
import {Router} from "../router/router";
import {IModuleMetadata} from "../interfaces/imodule";
import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
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
  if (!isClass(Class)) {
    throw new TypeError(`@Controller is allowed only on class`);
  }
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  // add router to default config
  if (!Metadata.hasProvider(config.providers, Router)) {
    config.providers.unshift(Router);
  }
  // add logger to start of providers
  if (!Metadata.hasProvider(config.providers, Logger)) {
    config.providers.unshift(Logger);
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
