import {isFunction, toString, isPresent, uuid, isArray, isClass} from "../core";
import {Metadata} from "./metadata";
import {IProvider} from "../interfaces/iprovider";
import {IInjectKey} from "../interfaces/idecorators";

/**
 * @since 1.0.0
 * @function
 * @name ProviderList
 *
 * @description
 * Provider list holder for easier debugging
 */
class ProviderList {
  private _list = {};

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#constructor
   * @param {string} _id
   * @param {Array<any>} keys
   *
   * @description
   * Create a new instance with new id
   */
  constructor(private _id: string, private keys: Array<any> = []) {
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#isMutable
   * @param {Object} key
   *
   * @description
   * Check if key is mutable
   */
  isMutable(key: any): boolean {
    return this.keys.indexOf(key) > -1;
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#set
   * @param {Object} key
   * @param {Object} value
   *
   * @description
   * Simulate set as on Map object
   */
  set(key: any, value: Object): void {
    if (!this.has(key) || this.isMutable(key)) {
      Object.defineProperty(this._list, key, {
        configurable: false,
        value: value,
        writable: this.isMutable(key)
      });
    } else {
      throw new TypeError(`${isClass(key) ? Metadata.getName(key) : key} is already defined in injector, value: ${value}`);
    }
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#get
   * @param {Object} key
   *
   * @description
   * Simulate get as on Map object
   */
  get(key: any): any {
    return this._list[key];
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#clear
   *
   * @description
   * Simulate clear as on Map object
   */
  clear() {
    this._list = {};
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name ProviderList#has
   * @param {Object} key
   *
   * @description
   * Simulate has as on Map object
   */
  has(key: any): boolean {
    return this._list.hasOwnProperty(key);
  }
}
/**
 * @since 1.0.0
 * @function
 * @name Injector
 *
 * @param {Injector} parent injector
 *
 * @description
 * Dependency injection for class injection
 *
 */
export class Injector {
  // injector indentifier
  private _uid: string = uuid();
  private _providers: ProviderList;
  private _children: Array<Injector> = [];

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Injector#createAndResolveChild
   * @param {Injector} parent
   * @param {Function} Class
   * @param {Array<IProvider|Function>} providers
   * @return {Injector} instance
   *
   * @description
   * Static method which creates child injector on current injector and creates instance of Injectable class
   *
   * @example
   * \@Injectable()
   * class MyInjectableClass{
   *    \@Inject("config")
   *    private config: Object;
   * }
   *
   * let parent = new Injector();
   * let injector = Injector.createAndResolveChild(
   *    parent,
   *    MyInjectableClass,
   *    [
   *      {provide: "config", useValue: {id: 1, message: "This is custom provider for injector"}}
   *    ]
   * );
   * let myInstance = injector.get(MyInjectableClass);
   */
  static createAndResolveChild(parent: Injector, Class: IProvider|Function, providers: Array<IProvider|Function>): Injector {
    let child = new Injector(parent);
    child.createAndResolve(Metadata.verifyProvider(Class), Metadata.verifyProviders(providers));
    parent.setChild(child);
    return child;
  }

  /**
   * @since 1.0.0
   * @static
   * @function
   * @name Injector#createAndResolve
   * @param {Function} Class
   * @param {Array<IProvider|Function>} providers
   * @return {Injector} instance
   *
   * @description
   * Static method which creates injector and instance of Injectable class
   *
   * @example
   * \@Injectable()
   * class MyInjectableClass{
   *    \@Inject("config")
   *    private config: Object;
   * }
   *
   * let injector = Injector.createAndResolve(
   *    MyInjectableClass,
   *    [
   *      {provide: "config", useValue: {id: 1, message: "This is custom provider for injector"}}
   *    ]
   * );
   * let myInstance = injector.get(MyInjectableClass);
   */
  static createAndResolve(Class: IProvider|Function, providers: Array<IProvider|Function>): Injector {
    let injector = new Injector();
    injector.createAndResolve(Metadata.verifyProvider(Class), Metadata.verifyProviders(providers));
    return injector;
  }

  /**
   * @since 1.0.0
   * @constructor
   * @function
   * @name Injector#constructor
   * @param {Injector} parent
   * @param {Array<any>} keys which are mutable
   *
   * @description
   * Injector constructor
   */
  constructor(private parent?: Injector, keys: Array<any> = []) {
    if (isArray(keys) && keys.indexOf(Injector) === -1) {
      keys.push(Injector);
    }
    this._providers = new ProviderList(this._uid, keys);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Injector#createAndResolve
   * @param {IProvider} provider
   * @param {Array<IProvider>} providers
   *
   * @description
   * Creates instance of verified provider and creates instances of current providers and assign it to current injector instance
   * This method is used internally in most cases you should use static method Injector.createAndResolve or Injector.createAndResolveChild
   */
  createAndResolve(provider: IProvider, providers: Array<IProvider>): any {
    // merge _providers
    // we need to keep merge algorithm in this order because we want to copy correct order do not change this :)
    providers = Metadata.mergeProviders(Metadata.getConstructorProviders(provider.provide), providers);
    // create _providers first
    providers.forEach(item => this.createAndResolve(item, Metadata.getConstructorProviders(item.provide)));

    // set correct injector
    if (!this.has(Injector)) {
      this.set(Injector, this); // set local injector
    }

    // if provider.useValue is present return value
    if (isPresent(provider.useValue)) {
      this.set(provider.provide, provider.useValue);
      return this.get(provider.provide);
    // if it's factory invoke it and set invoked factory as value
    } else if (isPresent(provider.useFactory)) {
      this.set(
        provider.provide,
        provider.useFactory.apply(
          null,
          provider.deps.map(item => this.get(Metadata.verifyProvider(item).provide))
        )
      );
      return this.get(provider.provide);
    }
    // get constructor args
    let keys = Metadata.getConstructorInjectKeys(provider.provide);
    // get providers for constructor
    let args = keys.map(arg => this.get(arg, provider));
    // create instance
    let instance = Reflect.construct(provider.useClass, args);
    // get @Inject data
    let protoKeys = Metadata.getConstructorPrototypeKeys(provider.useClass);
    // assign injected values
    if (isArray(protoKeys)) {
      protoKeys.forEach((item: IInjectKey) => {
        let value = this.get(item.value);
        Reflect.defineProperty(instance, item.key, {
          value: value,
          writable: item.isMutable
        });
      });
    }
    // set provider and value
    this.set(provider.provide, instance);
    // invoke after construct
    if (provider.useClass.prototype.hasOwnProperty("afterConstruct") && isFunction(instance.afterConstruct)) {
      instance.afterConstruct();
    }

    return instance;
  }


  /**
   * @since 1.0.0
   * @function
   * @name Injector#destroy
   *
   * @description
   * Do cleanup on current injector and all children so we are ready for gc this is used internally by framework
   */
  destroy() {
    if (this.parent instanceof Injector) {
      this.parent.removeChild(this);
    }
    this._children.forEach(injector => injector.destroy());
    this._children = [];
    this.parent = undefined;
    this._providers.clear();
  }


  /**
   * @since 1.0.0
   * @function
   * @name Injector#has
   * @param {any} key
   *
   * @description
   * Check if Injectable class has instance on current injector
   */
  has(key: any): boolean {
    return this._providers.has(key);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Injector#get
   * @param {any} provider
   * @param {IProvider} Class
   *
   * @description
   * Gets current Injectable instance throws exception if Injectable class is not created
   */
  get(provider: any, Class?: IProvider): any {
    if (this.has(provider)) {
      return this._providers.get(provider);
    } else if (this.parent instanceof Injector) {
      return this.parent.get(provider, Class);
    }
    if (isPresent(Class)) {
      throw new Error(`No provider for ${
        isFunction(provider) ? provider.name : toString(provider)
        } on class ${isFunction(Class.provide) ? Class.provide.name : Class.provide} , injector: ${this._uid}`);
    }
    throw new Error(`No provider for ${isFunction(provider) ? provider.name : toString(provider)}, injector: ${this._uid}`);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Injector#set
   * @param {any} key
   * @param {Object} value
   *
   * @description
   * Sets Injectable instance to current injector instance
   */
  set(key: any, value: Object): void {
    this._providers.set(key, value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Injector#setChild
   * @param {Injector} injector
   * @private
   *
   * @description
   * Append child Injector
   */
  private setChild(injector: Injector): void {
    this._children.push(injector);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Injector#setChild
   * @param {Injector} injector
   * @private
   *
   * @description
   * Remove child injector
   */
  private removeChild(injector: Injector): void {
    this._children.splice(this._children.indexOf(injector), 1);
  }
}

