import {IncomingMessage} from "http";
import {IModule} from "../interfaces/imodule";
import {Logger} from "../logger/logger";
import {SocketRequestResolver} from "./request-resolver";
import {isFalsy, isObject, uuid} from "../core";
import {Injector} from "../injector/injector";
import {Status} from "./status-code";
import {getModule} from "./bootstrap";
import {parse} from "url";
import {EventEmitter} from "events";
import {HttpError} from "../error";

export interface IWebSocketResult {
  uuid: string;
  error?: any;
  open?: () => void;
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
    .then((socket) => {
      if (isFalsy(socket) || !isObject(socket)) {
        throw new HttpError(Status.Internal_Server_Error, "Could not resolve socket");
      } else {
        return {
          uuid: requestUuid,
          open: () => {
            logger.info("Resuming request", {uuid: requestUuid});
          },
          finished: () => {
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
