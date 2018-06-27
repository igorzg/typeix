import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";

/**
 * Controller
 * @decorator
 * @function
 * @name Controller
 *
 * @param {IControllerMetadata} config
 * @returns {function(any): any}
 *
 * @description
 * Define controller of application
 */
export let Controller = (config: IControllerMetadata) => (Class) => {
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  if (!isClass(Class)) {
    throw new TypeError(`@Controller is allowed only on class`);
  }
  Metadata.setComponentConfig(Class, config);
  return Class;
};
