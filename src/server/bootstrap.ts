import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {IncomingMessage, ServerResponse} from "http";
import {Request} from "./request";
import {isPresent} from "../core";
import {EventEmitter} from "events";
import {IModuleMetadata} from "../interfaces/imodule";

/**
 * @since 1.0.0
 * @function
 * @name fireRequest
 * @param {IModuleMetadata} metadata created module metadata
 * @param {Injector} injector injector with created module
 * @param {IncomingMessage} request event emitter
 * @param {ServerResponse} response event emitter
 * @return {string|Buffer} data from controller
 *
 * @description
 * Use fireRequest to process request itself, this function is used by http/https server or
 * You can fire fake request
 */
export function fireRequest(metadata: IModuleMetadata,
                            injector: Injector,
                            request: IncomingMessage,
                            response: ServerResponse): Promise<string | Buffer> {
  let logger = injector.get(Logger);
  let childInjector = Injector.createAndResolveChild(
    injector,
    Request,
    [
      {provide: "contentType", useValue: "text/html"},
      {provide: "modules", useValue: isPresent(metadata.modules) ? metadata.modules : []},
      {provide: "controllers", useValue: metadata.controllers},
      {provide: "request", useValue: request},
      {provide: "response", useValue: response},
      {provide: "isRedirected", useValue: false},
      {provide: "isCustomError", useValue: false},
      {provide: "isForwarded", useValue: false},
      {provide: "isForwarder", useValue: false},
      {provide: "isChainStopped", useValue: false},
      {provide: "statusCode", useValue: 200},
      {provide: "data", useValue: []},
      EventEmitter
    ]
  );
  /**
   * On finish destroy injector
   */
  response.on("finish", () => childInjector.destroy());
  /**
   * Get request instance
   * @type {any}
   */
  let pRequest: Request = childInjector.get(Request);
  /**
   * Process request
   */
  return pRequest
    .process()
    .catch(error =>
      logger.error("Request.error", {
        stack: error.stack,
        url: request.url,
        error
      })
    );
}
