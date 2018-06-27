import {IProvider} from "./iprovider";

/**
 * @since 2.0.0
 * @interface
 * @name IWebSocketMetadata
 *
 * @description
 * WebSocket metadata
 */
export interface IWebSocketMetadata {
  /**
   * Name of the socket - used in route definition
   */
  name: string;

  /**
   * Additional providers for injector
   */
  providers?: Array<IProvider | Function>;
}

/**
 * @since 2.0.0
 * @interface
 * @name IAfterClose
 *
 * @description
 * Provides a method to implement for a {@link WebSocket} in order to be
 * called when the socket has been closed, e.g. to free up resources.
 */
export interface IAfterClose {
  /**
   * Called after the socket has already been closed.
   */
  afterClose(): void;
}
