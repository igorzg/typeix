import {IProvider} from "./iprovider";
/**
 * Inject param
 */
export interface IInjectParam {
  value: any;
  paramIndex: number;
}
/**
 * Inject key
 */
export interface IInjectKey {
  value: any;
  key: any;
}
/**
 * Component meta data
 */
export interface IComponentMetaData {
  providers: IProvider[];
}
