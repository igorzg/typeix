import {isArray} from "../core";
import {Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";

/**
 * Controller
 * @decorator
 * @function
 * @name Controller
 *
 * @param {IModuleMetadata} config
 * @returns {function(any): any}
 *
 * @description
 * Define controller of application
 */
export var Controller = (config: IControllerMetadata) => (Class) => {
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  Metadata.setComponentConfig(Class, config);
  return Class;
};
