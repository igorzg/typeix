import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, Server, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {isArray, isFunction, isPresent, isString} from "../core";
import {BOOTSTRAP_MODULE, createModule, fireRequest, getModule} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import * as WebSocket from "ws";
import {fireWebSocket, IWebSocketResult} from "./socket";
import {HttpError} from "../error";

const TYPEX_SOCKET_ID_HEADER = "__typeix_id";

/**
 * @since 2.0.0
 * @interface
 *
 * @description
 * Configuration options for the HTTP server
 */
export interface HttpOptions {
  /**
   * Port for the HTTP server to listen on
   */
  port: number;
  /**
   * Hostname for the HTTP server to listen on
   */
  hostname?: string;
  /**
   * If enabled the server will also configure WebSockets
   */
  enableWebSockets?: boolean;
}

/**
 * @since 1.0.0
 * @function
 * @name httpServer
 * @param {Function} Class Root application module to bootstrap
 * @param {HttpOptions} options Additional HTTP Server options
 * @returns {Injector}
 *
 * @description
 * Run the HTTP server for a given root module.
 */
export function httpServer(Class: Function, options: HttpOptions): Array<IModule> {
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

  if (isString(options.hostname)) {
    server.listen(options.port, options.hostname);
  } else {
    server.listen(options.port);
  }

  logger.info("Module.info: Server started", options);
  server.on("error", (e) => logger.error(e.stack));

  if (options.enableWebSockets) {
    configureAndStartWebSockets(modules, logger, server);
  }

  return modules;
}

/**
 * @since 2.0.0
 * @function
 * @param {Array<IModule>} modules The list of bootstrapped modules
 * @param {Logger} logger The logger instance
 * @param {"http".Server} server Configured HTTP server
 *
 * @description
 * Configures and starts the WebSockets extensions
 */
function configureAndStartWebSockets(modules: Array<IModule>, logger: Logger, server: Server) {
  const socketResultMap: Map<string, IWebSocketResult> = new Map();
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
          socketResultMap.set(result.uuid, result);

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
    if (!isPresent(idFromHeader) || isArray(idFromHeader) || !socketResultMap.has(<string> idFromHeader)) {
      ws.close();
    } else {
      const socketResult = socketResultMap.get(<string> idFromHeader);

      const cleanup = () => {
        socketResult.finished();
        socketResultMap.delete(<string> idFromHeader);
      };
      ws.on("close", cleanup);
      ws.on("error", cleanup);

      return socketResult.open(ws);
    }
  });
  wss.on("error", (e) => logger.error(e.stack));
}
