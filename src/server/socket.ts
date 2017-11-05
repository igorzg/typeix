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
  logger.debug("Resolved SocketRequestResolver - starting processing", {request});

  return socketResolver
    .process()
    .then((socket: SocketResolver) => {
      logger.debug("socketResolver.then result:", {socket});
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
