import {IncomingMessage} from "http";
import {IModule} from "../interfaces/imodule";
import {Logger} from "../logger/logger";
import {SocketRequestResolver} from "./request-resolver";
import {isPresent, uuid} from "../core";
import {Injector} from "../injector/injector";
import {Status} from "./status-code";
import {getModule} from "./bootstrap";
import {parse} from "url";
import {EventEmitter} from "events";
import {HttpError} from "../error";
import {SocketResolver} from "./socket-resolver";
import * as WebSocket from "ws";

export interface IWebSocketResult {
  uuid: string;
  error?: any;
  open?: (ws: WebSocket) => Promise<any>;
  finished: () => void;
}

/**
 * @since 2.0.0
 * @class
 * @constructor
 * @name Socket
 *
 * @description
 * Basic API for accessing a WebSocket in order to get state information, send data, or close the socket.
 */
export class Socket {

  /**
   * @since 2.0.0
   * @param {WebSocket} ws Underlying WebSocket to wrap
   *
   * @description
   * Creates a new API wrapping the given raw WebSocket
   */
  constructor(private readonly ws: WebSocket) {
  }

  /**
   * @since 2.0.0
   * @function
   * @name Socket#getReadyState
   * @return {number} Socket readyState
   *
   * @description
   * Get the underlying WebSocket's readyState (see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants)
   */
  getReadyState(): number {
    return this.ws.readyState;
  }

  /**
   * @since 2.0.0
   * @function
   * @name Socket#close
   * @param {number} status Status code to send as close reason
   * @param {string} data Data to send as close reason
   *
   * @description
   * Closes the underlying WebSocket
   */
  close(status?: number, data?: string): void {
    this.ws.close(status, data);
  }

  /**
   * @since 2.0.0
   * @function
   * @name Socket#send
   * @param data Data to send to the client
   * @param {{mask?: boolean; binary?: boolean}|(err: Error) => void} options Either send options or the error callback
   * @param {(err: Error) => void} cb (only if second parameter are options) error callback
   */
  send(data: any, options?: { mask?: boolean; binary?: boolean } | ((err: Error) => void), cb?: (err: Error) => void): void {
    this.ws.send(data, options as any, cb);
  }

}

/**
 * @since 2.0.0
 * @function
 * @name fireWebSocket
 * @param {Array<IModule>} modules Bootstrapped modules
 * @param {"http".IncomingMessage} request Incoming HTTP request
 * @return {Promise<IWebSocketResult>} Promise which will resolve once the socket has been verified or reject on failure
 *
 * @description
 * This method will trigger a WebSocket resolution and will try to find a matching {@link WebSocket} registered in the system.
 * Typically you do not use this method directly but it is called automatically by the framework. For testing best
 * refer to {@link FakeServerApi#createSocket}.
 */
export function fireWebSocket(modules: Array<IModule>, request: IncomingMessage): Promise<IWebSocketResult> {
  let rootInjector: Injector = getModule(modules).injector;
  let logger: Logger = rootInjector.get(Logger);

  const requestUuid = uuid();

  /**
   * Create SocketRequestResolver injector
   */
  let socketResolverInjector = Injector.createAndResolveChild(
    rootInjector,
    SocketRequestResolver,
    [
      {provide: "url", useValue: parse(request.url, true)},
      {provide: "UUID", useValue: requestUuid},
      {provide: "data", useValue: []},
      {provide: "request", useValue: request},
      {provide: "modules", useValue: modules},
      EventEmitter
    ]
  );

  const socketResolver: SocketRequestResolver = socketResolverInjector.get(SocketRequestResolver);
  logger.debug("Resolved SocketRequestResolver - starting processing", {request});

  return socketResolver
    .process()
    .then((socket: SocketResolver) => {
      logger.debug("socketResolver.then result:", {socket});
      if (!isPresent(socket)) {
        throw new HttpError(Status.Internal_Server_Error, "Could not resolve socket");
      } else {
        const result: IWebSocketResult = {
          uuid: requestUuid,
          open: (ws: WebSocket) => {
            logger.info("Resuming request", {uuid: requestUuid});
            return socket.openSocket(ws);
          },
          finished: () => {
            socket.destroy();
            socketResolverInjector.destroy();
          }
        };
        return result;
      }
    })
    .catch((error) => {
      logger.error("fireWebSocket: Failed to create socket", {error});
      return {
        uuid: requestUuid,
        error: error,
        finished: () => {
          socketResolverInjector.destroy();
        }
      };
    });
}
