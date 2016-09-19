import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Request} from "./request";
import {Logger} from "../logger/logger";
import {isString} from "../core";
import {EventEmitter} from "events";
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
export function httpServer(Class: Function, port: number, hostname?: string): Injector {
  let injector = Injector.createAndResolve(Class, []);
  let logger: Logger = injector.get(Logger);
  let server = createServer();
  server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    let childInjector = Injector.createAndResolveChild(
      injector,
      Request,
      [
        {provide: "request", useValue: request},
        {provide: "response", useValue: response},
        {provide: "isCustomError", useValue: false},
        {provide: "isForwarded", useValue: false},
        {provide: "isForwarder", useValue: false},
        {provide: "statusCode", useValue: 200},
        {provide: "data", useValue: []},
        EventEmitter
      ]
    );
    /**
     * On end destroy injector
     */
    request.on("end", () => childInjector.destroy());
    /**
     * Get request instance
     * @type {any}
     */
    let pRequest: Request = childInjector.get(Request);
    /**
     * Process request
     */
    pRequest
      .process()
      .catch(error =>
        logger.error("Request.error", {
          stack: error.stack,
          url: request.url,
          error
        })
      );
  });
  if (isString(hostname)) {
    server.listen(port, hostname);
  } else {
    server.listen(port);
  }
  logger.info("Module.info: Server started", {port, hostname});
  server.on("error", (e) => logger.error(e.stack));
  return injector;
}

