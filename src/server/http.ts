import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {isString} from "../core";
import {fireRequest, createModule, BOOTSTRAP_MODULE, getModule} from "./bootstrap";
import {IModuleMetadata, IModule} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
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

  return modules;
}
