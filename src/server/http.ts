import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {isString, isTruthy} from "../core";
import {BOOTSTRAP_MODULE, createModule, fireRequest, getModule} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import * as WebSocket from "ws";
import {fireWebSocket} from "./socket";

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

  const wss = new WebSocket.Server({
    server,
    verifyClient: (info, cb) => {
      fireWebSocket(modules, info.req)
        .then(result => {
          const verified = isTruthy(result);
          cb(verified);
        })
        .catch(error => {
          logger.error("WSS.verifyClient: Verification failed", {error, info});
        });
    }
  });

  wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
    logger.info("WSS.info: Socket connected", {url: request.url});
  });
  wss.on("error", (e) => logger.error(e.stack));

  return modules;
}
