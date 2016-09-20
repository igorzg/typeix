import {IProvider} from "../interfaces/iprovider";
import {isFunction, isPresent, isArray} from "../core";
import {Metadata} from "../injector/metadata";
/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Provider
 *
 * @description
 * Provider decorator is used to define injectable and injections for class itself
 *
 * @example
 * import {Provider} from "node-ee";
 * import {MyService} form "./services/my-service";
 *
 * \@Provider([MyService])
 * class AssetLoader{
 *    constructor(myService: MyService) {
 *
 *    }
 * }
 */
export var Provider = (config: Array<IProvider|Function>) => {
  return (Class) => {
    if (!isFunction(Class)) {
      throw new TypeError(`Provider is only allowed on class definition! 
      Error found on ${Class.toString()}`);
    } else if (isPresent(config) && !isArray(config)) {
      throw new TypeError(`Provider value must be array of IProvider`);
    }
    Metadata.setComponentConfig(Class, {
      providers: isPresent(config) ? config.map(ProviderClass => Metadata.verifyProvider(ProviderClass)) : []
    });
    return Class;
  };
};
