import "reflect-metadata";
import {isPresent, isFunction, isObject, isString, toString, isArray} from "../core";
import {IProvider} from "../interfaces/iprovider";
export const INJECT_KEYS = "inject:paramtypes";
export const FUNCTION_KEYS = "function:paramtypes";
export const METADATA_KEYS = "design:paramtypes";
export const DESIGN_KEYS = "design:type";
export const DESIGN_RETURN = "design:returntype";
export const COMPONENT_CONFIG_KEYS = "component:paramtypes";

/**
 * @since 1.0.0
 * @constructor
 * @function
 * @name Metadata
 *
 * @description
 * Metadata is responsible for getting or setting metadata definitions for some Class
 * It's crucial for injector
 */
export class Metadata {
  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getName
   * @param {Object} Class
   * @param {string} prefix
   *
   * @description
   * Get class name
   */
  static getName(Class: any, prefix?: string): string {
    let message = "";
    if (prefix) {
      message += prefix;
    }
    if (isPresent(Class)) {
      if (isPresent(Class.name)) {
        message += Class.name;
      } else if (isPresent(Class.constructor) && isPresent(Class.constructor.name)) {
        message += Class.constructor.name;
      }
    }
    return message;
  };

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#isDescriptor
   * @param {Object} value
   *
   * @description
   * Check if current object is descriptor object
   */
  static isDescriptor(value: Object): boolean {
    return isPresent(value) && ["writable", "configurable", "value", "enumerable"].every(key => value.hasOwnProperty(key));
  };

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#defineMetadata
   * @param {Function} token
   * @param {string} name
   * @return {any} value
   *
   * @description
   * Define metadata to some class
   */
  static defineMetadata(token: Function, name: string, value: any): boolean {
    if (isPresent(value)) {
      Reflect.defineMetadata(name, value, token);
      return true;
    }
    return false;
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#hasMetadata
   * @param {Function} token
   * @param {string} name
   *
   * @description
   * Check if some class has metadata by key
   */
  static hasMetadata(token: Function, name: string): boolean {
    return Reflect.hasMetadata(name, token);
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getMetadata
   * @param {Function} token
   * @param {String} name
   * @param {any} defaultValue
   *
   * @description
   * Get class metadata if not present return defaultValue
   */
  static getMetadata(token: Function, name: string, defaultValue = []) {
    return Metadata.hasMetadata(token, name) ? Reflect.getMetadata(name, token) : defaultValue;
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getComponentConfig
   * @param {Function} Class
   *
   * @description
   * Get component config
   */
  static getComponentConfig(Class: Function): any {
    return Metadata.getMetadata(Class, COMPONENT_CONFIG_KEYS);
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#setComponentConfig
   * @param {Function} Class
   * @param {any} config
   *
   * @description
   * Sets component config
   */
  static setComponentConfig(Class: Function, config: any): void {
    Metadata.defineMetadata(Class, COMPONENT_CONFIG_KEYS, config);
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getConstructorProviders
   * @param {Function} Class
   *
   * @description
   * Return constructor providers in order to be delivered new instance to current injectable class
   */
  static getConstructorProviders(Class: Function): Array<IProvider> {
    if (isFunction(Class)) {
      let config = Metadata.getMetadata(Class, COMPONENT_CONFIG_KEYS);
      if (isArray(config.providers)) {
        return config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
      }
    }
    return [];
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getConstructorPrototypeKeys
   * @param {Function} Class
   *
   * @description
   * Get keys metadata in order to know what Injector should do with them
   */
  static getConstructorPrototypeKeys(Class: Function) {
    return Metadata.getMetadata(Class.prototype, INJECT_KEYS);
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#getConstructorInjectKeys
   * @param {Function} Class
   *
   * @description
   * Get all metadata on Class constructor so Injector can decide what to do with them
   */
  static getConstructorInjectKeys(Class: Function): Array<any> {
    let providers = Metadata.getMetadata(Class, METADATA_KEYS);
    let injectors = Metadata.getMetadata(Class, INJECT_KEYS);
    if (isArray(injectors)) {
      injectors.forEach(item => providers.splice(item.paramIndex, 1, item.value));
    }
    return providers;
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#hasProvider
   * @param {Array} providers
   * @param {Function} Class
   *
   * @description
   * Check if some list of providers are containing provider Class
   */
  static hasProvider(providers: Array<any>, Class: Function): boolean {
    return providers.some(item => {
      if (isObject(item)) {
        return item.provide === Class;
      }
      return item === Class;
    });
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#mergeProviders
   * @param {Array<IProvider>} a
   * @param {Array<IProvider>} b
   *
   * @description
   * Merge two provider definitions, this is used by Injector internally to know what to deliver at what time
   */
  static mergeProviders(a: Array<IProvider>, b: Array<IProvider>) {
    return a.concat(b.filter(i => a.indexOf(i) === -1));
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#verifyProviders
   * @param {Array<any>} providers
   *
   * @description
   * Verify all providers in list
   */
  static verifyProviders(providers: Array<any>): Array<IProvider> {
    if (isArray(providers)) {
      return providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
    }
    throw new TypeError(`Providers must be an Array type`);
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Metadata#verifyProvider
   * @param {Any} value
   *
   * @description
   * Verify provider to be sure that metadata configuration is provided correctly so it can be used by Injector
   */
  static verifyProvider(value: any): IProvider {
    if (isFunction(value)) {
      return {
        provide: value,
        useClass: value
      };
    } else if (isObject(value)) {
      if (!isPresent(value.provide) || (!isString(value.provide) && !isFunction(value.provide))) {
        throw new TypeError(`IProvider.provider must be string or Class type, ${toString(value)}`);
      } else if (isString(value.provide) && !isPresent(value.useValue)) {
        throw new TypeError(`When IProvider.provide is string type, then it only works with useValue`);
      }

      if (isPresent(value.useClass)) {
        if (isPresent(value.useValue) || isPresent(value.useFactory)) {
          throw new TypeError(`IProvider.useClass provider cannot have assigned useValue or useFactory`);
        } else if (!isFunction(value.useClass)) {
          throw new TypeError(`IProvider.useClass must be Class type`);
        }
      }

      if (isPresent(value.useValue)) {
        if (isPresent(value.useClass) || isPresent(value.useFactory)) {
          throw new TypeError(`IProvider.useValue provider cannot have assigned useClass or useFactory`);
        }
      }

      if (isPresent(value.useFactory)) {
        if (isPresent(value.useClass) || isPresent(value.useValue)) {
          throw new TypeError(`IProvider.useFactory provider cannot have assigned useClass or useValue`);
        } else if (!isFunction(value.useFactory)) {
          throw new TypeError(`IProvider.useFactory must be Function type`);
        }
      }

      if (!isPresent(value.useClass) && !isPresent(value.useValue) && !isPresent(value.useFactory)) {
        throw new TypeError(`IProvider members useClass or useValue or useFactory must be provided with IProvider`);
      }

      return value;
    }

    throw new TypeError(`Invalid provider config, provider must be an Class or IProvider type`);
  }
}
