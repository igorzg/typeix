import {IProvider} from "../interfaces/iprovider";
import {isPresent, isArray, isClass} from "../core";
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
 * import {Provider} from "typeix";
 * import {MyService} form "./services/my-service";
 *
 * \@Provider([MyService])
 * class AssetLoader{
 *    constructor(myService: MyService) {
 *
 *    }
 * }
 */
export let Provider = (config: Array<IProvider|Function>) => {
  return (Class) => {
    if (!isClass(Class)) {
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
