import {IProvider} from "./iprovider";
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
  providers?: Array<IProvider|Function>;
}
