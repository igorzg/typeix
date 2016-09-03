/**
 * @license Mit Licence 2016
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
