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
  return socketResolver
    .process()
    .then((socket: SocketResolver) => {
      if (!isPresent(socket)) {
        throw new HttpError(Status.Internal_Server_Error, "Could not resolve socket");
      } else {
        return {
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
      }
    })
    .catch((error) => {
      return {
        uuid: requestUuid,
        error: error,
        finished: () => {
          socketResolverInjector.destroy();
        }
      };
    });
}

/**
 * @since 1.1.0
 * @function
 * @name verifyWssClient
 * @return {boolean}
 * @private
 */
export function verifyWssClient(modules: Array<IModule>, request: IncomingMessage, cb): boolean {
  let rootInjector: Injector = getModule(modules).injector;
  let logger: Logger = rootInjector.get(Logger);
  /**
   * Create HttpRequestResolver injector
   */
  let routeResolverInjector = Injector.createAndResolveChild(
    rootInjector,
    SocketRequestResolver,
    [
      {provide: "url", useValue: parse(request.url, true)},
      {provide: "UUID", useValue: uuid()},
      {provide: "data", useValue: []},
      {provide: "contentType", useValue: "text/html"},
      {provide: "statusCode", useValue: Status.OK},
      {provide: "request", useValue: request},
      {provide: "modules", useValue: modules},
      EventEmitter
    ]
  );

  return false;
}
