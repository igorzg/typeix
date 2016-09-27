import {IProvider} from "./iprovider";
import {RouteRuleConfig} from "./iroute";
/**
 * @since 1.0.0
 * @interface
 * @name IModuleMetadata
 * @param {String} name
 * @param {Array<RouteRuleConfig>} routes
 * @param {Array<IModuleMetadata>} modules
 * @param {Array<IProvider|Function>} controllers
 * @param {Array<IProvider|Function>} providers
 *
 * @description
 * Bootstrap class config metadata
 */
export interface IModuleMetadata {
  name?: string;
  routes?: Array<RouteRuleConfig>;
  modules?: Array<IModuleMetadata>;
  controllers: Array<IProvider|Function>;
  providers?: Array<IProvider|Function>;
}
