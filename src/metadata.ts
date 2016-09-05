import "reflect-metadata";
import {isPresent, isFunction, isObject, isString, toString, isArray} from "./core";
import {IProvider} from "./interfaces/iprovider";
export const INJECT_KEYS = "inject:paramtypes";
export const METADATA_KEYS = "design:paramtypes";
export const DESIGN_KEYS = "design:type";
export const COMPONENT_CONFIG_KEYS = "component:paramtypes";
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name Metadata
 *
 * @description
 * Metadata is used by injector
 *
 */
export class Metadata {
  /**
   * Define metadata
   * @param token
   * @param name
   * @param value
   * @returns {any}
   */
  static defineMetadata(token: Function, name: string, value: any): boolean {
    if (isPresent(value)) {
      Reflect.defineMetadata(name, value, token);
      return true;
    }
    return false;
  }

  /**
   * Check if has metadata
   * @param token
   * @param name
   * @returns {any}
   */
  static hasMetadata(token: Function, name: string): boolean {
    return Reflect.hasMetadata(name, token);
  }

  /**
   * Return metadata from class or token
   * @param token
   * @param name
   * @param defaultValue
   * @returns {Array}
   */
  static getMetadata(token: Function, name: string, defaultValue = []) {
    return Metadata.hasMetadata(token, name) ? Reflect.getMetadata(name, token) : defaultValue;
  }

  /**
   * Get component config
   * @param Class
   * @returns {Array}
   */
  static getComponentConfig(Class: Function): any {
    return Metadata.getMetadata(Class, COMPONENT_CONFIG_KEYS);
  }

  /**
   * Set component config
   * @param Class
   * @param config
   */
  static setComponentConfig(Class: Function, config: any): void {
    Metadata.defineMetadata(Class, COMPONENT_CONFIG_KEYS, config);
  }
  /**
   * Return constructor providers
   * @param Class
   * @returns {any}
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
   * Return prototype keys which has to be injected on each constructor
   * @param Class
   * @returns {Array}
   */
  static getConstructorPrototypeKeys(Class: Function) {
    return Metadata.getMetadata(Class.prototype, INJECT_KEYS);
  }

  /**
   * Return constructor metadata
   * @param Class
   * @returns {Array}
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
   * Check if provider exists
   * @param providers
   * @param Class
   * @returns {boolean}
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
   * Merge providers
   * @param a
   * @param b
   */
  static mergeProviders(a: Array<IProvider>, b: Array<IProvider>) {
    return a.concat(b.filter(i => a.indexOf(i) === -1));
  }

  /**
   * Verify projectors
   * @param providers
   * @returns {any}
   */
  static verifyProviders(providers: Array<any>): Array<IProvider> {
    if (isArray(providers)) {
      return providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
    }
    throw new TypeError(`Providers must be an Array type`);
  }

  /**
   * Verify provider metadata
   * @param value
   * @returns {any}
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
