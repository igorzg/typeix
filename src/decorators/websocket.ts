import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
import {IWebSocketMetadata} from "../interfaces";

/**
 * @since 2.0.0
 * @decorator
 * @function
 * @name WebSocket
 *
 * @param {IWebSocketMetadata} config WebSocket configuration
 * @returns {function(any): any}
 *
 * @description
 * Defines a WebSocket endpoint of an application.
 *
 * The {@link Inject} decorator can be used for class members in the same way
 * as for controllers.
 *
 * If you want to access the underlying request that opened the socket you can
 * inject {@link BaseRequest} which provides a minimal interface for basic access.
 *
 * @example
 * import {WebSocket} from "typeix";
 *
 * \@WebSocket({
 *   name: "mySocket"
 * })
 * class MySocketEndpoint {
 *   \@Inject(BaseRequest)
 *   private readonly request: BaseRequest;
 *
 *   ...
 * }
 */
export let WebSocket = (config: IWebSocketMetadata) => (Class) => {
  if (!isArray(config.providers)) {
    config.providers = [];
  }
  config.providers = config.providers.map(ProviderClass => Metadata.verifyProvider(ProviderClass));
  if (!isClass(Class)) {
    throw new TypeError(`@WebSocket is allowed only on class`);
  }
  Metadata.setComponentConfig(Class, config);
  return Class;
};
