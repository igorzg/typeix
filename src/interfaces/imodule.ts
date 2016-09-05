import {IProvider} from "./iprovider";
import {RouteRuleConfig} from "../router/route";
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @interface
 * @name IModuleMetadata
 * @param {String} hostname
 * @param {Number} port
 *
 * @description
 * Bootstrap class config metadata
 */
export interface IModuleMetadata {
  hostname?: string;
  routes?: Array<RouteRuleConfig>;
  port: number;
  providers?: Array<IProvider|Function>;
}
