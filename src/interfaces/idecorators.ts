import {IProvider} from "./iprovider";
/**
 * @since 1.0.0
 * @interface
 * @name IInjectKey
 * @param {Object} value
 * @param {Object} key
 * @param {Boolean} isMutable
 *
 * @description
 * Injection param is used internally by framework as metadata type
 */
export interface IInjectKey {
  value: any;
  isMutable: boolean;
  key: any;
}
/**
 * @since 1.0.0
 * @interface
 * @name IComponentMetaData
 * @param {IProvider[]} providers
 *
 * @description
 * Injection param is used internally by framework as metadata type
 */
export interface IComponentMetaData {
  providers: IProvider[];
}
