import {IProvider} from "./interfaces/iprovider";
import {isUndefined, isFunction, isPresent, isArray} from "./core";
import {Metadata, INJECT_KEYS, COMPONENT_CONFIG_KEYS} from "./metadata";
import {IInjectParam, IInjectKey, IComponentMetaData} from "./interfaces/idecorators";

/**
 * Inject token from injector
 * @param value
 * @returns {(Class:any, key?:any, paramIndex?:any)=>any}
 * @constructor
 */
export var Inject = (value: Function|string) => {
  return (Class: any, key?: any, paramIndex?: any): any => {
    let metadata: Array<IInjectParam|IInjectKey> = [];
    if (Metadata.hasMetadata(Class, INJECT_KEYS)) {
      metadata = Metadata.getMetadata(Class, INJECT_KEYS);
    }
    metadata.push(isUndefined(paramIndex) ? {
      value,
      key
    } : {
      value,
      paramIndex
    });
    Metadata.defineMetadata(Class, INJECT_KEYS, metadata);
    return Class;
  };
}
/**
 * Provider decorator
 * @returns {function(any): any}
 * @constructor
 */
export var Provider = (config: Array<IProvider|Function>) => {
  return (Class) => {
    if (!isFunction(Class)) {
      throw new TypeError(`Provider is only allowed on class definition! 
      Error found on ${Class.toString()}`);
    } else if (isPresent(config) && !isArray(config)) {
      throw new TypeError(`Provider value must be array of IProvider`);
    }
    Metadata.defineMetadata(Class, COMPONENT_CONFIG_KEYS, {
      providers: isPresent(config) ? config.map(ProviderClass => Metadata.verifyProvider(ProviderClass)) : []
    });
    return Class;
  };
}
/**
 * Injectable is a empty provider
 * @constructor
 */
export var Injectable = () => Provider([]);
/**
 * Component decorator
 * @returns {function(any): any}
 * @constructor
 */
export var Component = (config?: IComponentMetaData) => {
  return (Class) => {
    if (isArray(config.providers)) {
      config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
    }
    Metadata.defineMetadata(Class, COMPONENT_CONFIG_KEYS, config);
    return Class;
  };
}
