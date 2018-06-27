import {createSecureServer, Http2ServerRequest, Http2ServerResponse} from "http2";
import {Logger} from "../logger/logger";
import {isString} from "../core";
import {BOOTSTRAP_MODULE, createModule, fireRequest, getModule} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";

/**
 * @since 2.0.0
 * @interface
 *
 * @description
 * Configuration options for the HTTP2 server
 */
export interface Http2Options {
  /**
   * Port for the HTTP2 server to listen on
   */
  port: number;
  /**
   * Configuration options passed to the HTTP2 server
   */
  serverOptions: object;
  /**
   * Hostname for the HTTP2 server to listen on
   */
  hostname?: string;
}

/**
 * @since 2.0.0
 * @function
 * @name http2Server
 * @param {Function} Class Root application module to bootstrap
 * @param {HttpOptions} options Additional HTTP Server options
 * @returns {Injector}
 *
 * @description
 * Run the HTTP2 server for a given root module.
 */
export function http2Server(Class: Function, options: Http2Options): Array<IModule> {
  let metadata: IModuleMetadata = Metadata.getComponentConfig(Class);
  // override bootstrap module
  metadata.name = BOOTSTRAP_MODULE;
  // set module config
  Metadata.setComponentConfig(Class, metadata);

  let modules: Array<IModule> = createModule(Class);
  let injector = getModule(modules).injector;
  let logger: Logger = injector.get(Logger);

  const server = createSecureServer(options.serverOptions);

  server.on("request",
    (request: Http2ServerRequest, response: Http2ServerResponse) =>
      fireRequest(modules, request, response)
  );

  if (isString(options.hostname)) {
    server.listen(options.port, options.hostname);
  } else {
    server.listen(options.port);
  }

  logger.info("Module.info: Server started", options);
  server.on("error", (e) => logger.error(e.stack));

  return modules;
}
