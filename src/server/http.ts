import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {isArray, isFunction, isPresent, isString} from "../core";
import {BOOTSTRAP_MODULE, createModule, fireRequest, getModule} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import * as WebSocket from "ws";
import {fireWebSocket} from "./socket";
import {HttpError} from "../error";
import {SocketResolver} from "./socket-resolver";

const TYPEX_SOCKET_ID_HEADER = "__typeix_id";

/**
 * @since 1.0.0
 * @function
 * @name httpServer
 * @param {Function} Class httpServer class
 * @param {Number} port httpServer on port
 * @param {String} hostname httpServer on hostname
 * @returns {Injector}
 *
 * @description
 * Use httpServer function to httpServer an Module.
 */
export function httpServer(Class: Function, port: number, hostname?: string): Array<IModule> {

  let metadata: IModuleMetadata = Metadata.getComponentConfig(Class);
  // override bootstrap module
  metadata.name = BOOTSTRAP_MODULE;
  // set module config
  Metadata.setComponentConfig(Class, metadata);

  let modules: Array<IModule> = createModule(Class);
  let injector = getModule(modules).injector;
  let logger: Logger = injector.get(Logger);
  let server = createServer();

  server.on("request",
    (request: IncomingMessage, response: ServerResponse) =>
      fireRequest(modules, request, response)
  );

  if (isString(hostname)) {
    server.listen(port, hostname);
  } else {
    server.listen(port);
  }

  logger.info("Module.info: Server started", {port, hostname});
  server.on("error", (e) => logger.error(e.stack));

  const socketResolverMap: Map<string, SocketResolver> = new Map();
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, cb) => {
      fireWebSocket(modules, info.req)
        .then(result => {
          if (result.error || !isFunction(result.open)) {
            if (result.error instanceof HttpError) {
              cb(false, result.error.getCode(), result.error.getMessage());
            } else {
              cb(false);
            }
          }

          info.req.headers[TYPEX_SOCKET_ID_HEADER] = result.uuid;

          cb(true);
        })
        .catch(error => {
          logger.error("WSS.verifyClient: Verification failed", {error, info});
          cb(false);
        });
    }
  });

  wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
    logger.info("WSS.info: Socket connected", {url: request.url});

    const idFromHeader = request.headers[TYPEX_SOCKET_ID_HEADER];
    if (!isPresent(idFromHeader) || isArray(idFromHeader) || !socketResolverMap.has(<string> idFromHeader)) {
      ws.close();
    } else {
      const cleanup = () => {
        socketResolver.destroy();
        socketResolverMap.delete(<string> idFromHeader);
      };
      ws.on("close", cleanup);
      ws.on("error", cleanup);

      const socketResolver = socketResolverMap.get(<string> idFromHeader);
      return socketResolver.openSocket(ws);
    }
  });
  wss.on("error", (e) => logger.error(e.stack));

  return modules;
}
