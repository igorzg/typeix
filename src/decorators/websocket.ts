import {isArray, isClass} from "../core";
import {Metadata} from "../injector/metadata";
import {IWebSocketMetadata} from "../interfaces/iwebsocket";

/**
 * WebSocket
 * @decorator
 * @function
 * @name WebSocket
 *
 * @param {IWebSocketMetadata} config
 * @returns {function(any): any}
 *
 * @description
 * Define endpoint of application
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
