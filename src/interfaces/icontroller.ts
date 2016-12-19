import {IProvider} from "./iprovider";
import {TFilter} from "./ifilter";
/**
 * @since 1.0.0
 * @interface
 * @name IControllerMetadata
 * @param {String} name
 * @param {Array<IProvider|Function>} providers
 *
 * @description
 * Controller metadata
 */
export interface IControllerMetadata {
  name: string;
  filters?: Array<TFilter>;
  providers?: Array<IProvider|Function>;
}
