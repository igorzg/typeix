import {IProvider} from "./iprovider";

/**
 * @since 1.1.0
 * @interface
 * @name IWebSocketMetadata
 * @param {String} name
 * @param {Array<IProvider|Function>} providers
 *
 * @description
 * WebSocket metadata
 */
export interface IWebSocketMetadata {
  name: string;
  providers?: Array<IProvider | Function>;
}

export interface IAfterClose {
  afterClose(): void;
}
