/**
 * @since 1.0.0
 * @interface
 * @name IProvider
 * @param {any} provide
 * @param {Function} useClass
 * @param {any} useValue
 * @param {Function} useFactory
 *
 * @description
 * Provider config
 */
export interface IProvider {
  provide: any;
  useValue?: any;
  useClass?: Function;
  useFactory?: Function;
}

/**
 * @since 1.0.0
 * @interface
 * @name IAfterConstruct
 *
 * @description
 * After construct interface
 */
export interface IAfterConstruct {
  afterConstruct(): void;
}
