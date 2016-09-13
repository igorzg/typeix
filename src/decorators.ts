import {IProvider} from "./interfaces/iprovider";
import {isUndefined, isFunction, isPresent, isArray} from "./core";
import {Metadata, INJECT_KEYS} from "./metadata";
import {IInjectParam, IInjectKey, IComponentMetaData} from "./interfaces/idecorators";

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
