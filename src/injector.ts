import {isFunction, toString, isPresent, uuid, isArray} from "./core";
import {Metadata} from "./metadata";
import {IProvider} from "./interfaces/iprovider";
import {IInjectKey} from "./interfaces/idecorators";

/**
 * @license Mit Licence 2016
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
  private _providers: Map<any, any> = new Map();
  private _children: Array<Injector> = [];

  /**
   * Create and resolve child
   * @param parent
   * @param Class
   * @param providers
   * @returns {Injector}
   */
  static createAndResolveChild(parent: Injector, Class: Function, providers: Array<IProvider|Function>): Injector {
    let child = new Injector(parent);
    child.createAndResolve(Metadata.verifyProvider(Class), Metadata.verifyProviders(providers));
    parent.setChild(child);
    return child;
  }

  /**
   * Create and resolve
   * @param Class
   * @param providers
   * @returns {Injector}
   */
  static createAndResolve(Class: Function, providers: Array<IProvider|Function>): Injector {
    let injector = new Injector();
    injector.createAndResolve(Metadata.verifyProvider(Class), Metadata.verifyProviders(providers));
    return injector;
  }

  /**
   * Injector constructor
   * @param parent
   */
  constructor(private parent?: Injector) {
  }

  /**
   * Craete and resolve provider
   * @param provider
   * @param providers
   * @returns {any}
   */
  createAndResolve(provider: IProvider, providers: Array<IProvider>): any {
    // merge _providers
    providers = Metadata.mergeProviders(Metadata.getConstructorProviders(provider.provide), providers);
    // create _providers first
    providers.forEach(item => this.createAndResolve(item, Metadata.getConstructorProviders(item.provide)));
    // if provider.useValue is present return value
    if (isPresent(provider.useValue)) {
      this.set(provider.provide, provider.useValue);
      return this.get(provider.provide);
    }

    let keys = Metadata.getConstructorInjectKeys(provider.provide);
    let args = keys.map(arg => this.get(arg, provider));
    let instance = Reflect.construct(provider.useClass, args);
    let protoKeys = Metadata.getConstructorPrototypeKeys(provider.useClass);
    if (isArray(protoKeys) && providers.length > 0) {
      protoKeys.forEach((item: IInjectKey) => {
        Reflect.defineProperty(instance, item.key, {
          value: this.get(item.value),
          writable: false
        });
      });
    }
    this.set(provider.provide, instance);
    if (provider.useClass.prototype.hasOwnProperty("afterConstruct") && isFunction(instance.afterConstruct)) {
      instance.afterConstruct();
    }
    this.set(Injector, this); // set local injector
    return instance;
  }


  /**
   * Destroy Injector
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
   * Check if has initialized provider
   * @param key
   * @returns {boolean}
   */
  has(key: any): boolean {
    return this._providers.has(key);
  }

  /**
   * Query initialized provider
   * @param provider
   * @param Class
   * @returns {any}
   */
  get(provider: any, Class?: IProvider): any {
    if (!this.has(provider) && this.parent instanceof Injector) {
      return this.parent.get(provider, Class);
    } else if (this.has(provider)) {
      return this._providers.get(provider);
    }
    if (isPresent(Class)) {
      throw new Error(`No provider for ${
        isFunction(provider) ? provider.name : toString(provider)
        } on class ${isFunction(Class.provide) ? Class.provide.name : Class.provide} , injector: ${this._uid}`);
    }
    throw new Error(`No provider for ${isFunction(provider) ? provider.name : toString(provider)}, injector: ${this._uid}`);
  }

  /**
   * Set initialized provider
   * @param key
   * @param value
   */
  set(key: any, value: Object): void {
    this._providers.set(key, value);
  }

  /**
   * Add injector to parent
   * @param injector
   */
  private setChild(injector: Injector): void {
    this._children.push(injector);
  }

  /**
   * Remove injector from parent
   * @param injector
   */
  private removeChild(injector: Injector): void {
    this._children.splice(this._children.indexOf(injector), 1);
  }
}

