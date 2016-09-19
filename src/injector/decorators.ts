import {IProvider} from "../interfaces/iprovider";
import {isUndefined, isFunction, isPresent, isArray} from "../core";
import {Metadata, INJECT_KEYS} from "./metadata";
import {IInjectParam, IInjectKey} from "../interfaces/idecorators";
import {IControllerMetadata} from "../interfaces/icontroller";

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Inject
 *
 * @description
 * Inject is used to define metadata which will be injected at class construct time by Injector
 *
 * @example
 * import {Provider, Inject} from "node-ee";
 * import {MyService} form "./services/my-service";
 *
 * \@Provider([MyService])
 * class AssetLoader{
 *    \@Inject(MyService)
 *    private myService;
 * }
 */
export var Inject = (value: Function|string, isMutable?: boolean) => {
  return (Class: any, key?: any, paramIndex?: any): any => {
    let metadata: Array<IInjectParam|IInjectKey> = [];
    if (Metadata.hasMetadata(Class, INJECT_KEYS)) {
      metadata = Metadata.getMetadata(Class, INJECT_KEYS);
    }
    metadata.push(isUndefined(paramIndex) ? {
      value,
      isMutable: !!isMutable,
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
}

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Injectable
 *
 * @description
 * Injectable decorator is used to define injectable class in order that Injector can recognise it
 *
 * @example
 * import {Injectable} from "node-ee";
 *
 * \@Injectable()
 * class AssetLoader{
 *    constructor() {
 *
 *    }
 * }
 */
export var Injectable = () => Provider([]);

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

/**
 * Action decorator
 * @decorator
 * @function
 * @name Action
 *
 * @param {String} name
 *
 * @description
 * Define name of action to class
 */
export var Action = (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log(name);
  return target;
};


/**
 * Produces response type
 * @decorator
 * @function
 * @name Produces
 *
 * @param {String} name
 *
 * @description
 * Produces content type
 */
export var Produces = (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log(name);
  return target;
};

