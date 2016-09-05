import {IProvider} from "./iprovider";
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @interface
 * @name IBootstrapMetadata
 * @param {String} hostname
 * @param {Number} port
 *
 * @description
 * Bootstrap class config metadata
 */
export interface IBootstrapMetadata {
  hostname?: string;
  port: number;
  providers?: Array<IProvider|Function>;
}
