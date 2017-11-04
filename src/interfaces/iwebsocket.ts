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

export interface IWebSocket {

  getReadyState(): number;

  close(status?: number, data?: string): void;

  send(data: any, cb?: (err: Error) => void): void;

  send(data: any, options: { mask?: boolean; binary?: boolean }, cb?: (err: Error) => void): void;

}
