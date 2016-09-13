import {Injector} from "../injector/injector";
import {createServer, IncomingMessage, ServerResponse} from "http";
import {Request} from "./request";
import {Logger} from "../logger/logger";
import {isString} from "../core";
import {EventEmitter} from "events";
/**
 * @since 1.0.0
 * @function
 * @name bootstrap
 * @param {Function} Class bootstrap class
 * @param {Number} port bootstrap on port
 * @param {String} hostname bootstrap on hostname
 * @returns {Injector}
 *
 * @description
 * Use bootstrap function to bootstrap an Module.
 */
export function bootstrap(Class: Function, port: number, hostname?: string): Injector {
  let injector = Injector.createAndResolve(Class, []);
  let server = createServer();
  server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    let childInjector = Injector.createAndResolveChild(
      injector,
      Request,
      [
        {provide: "request", useValue: request},
        {provide: "response", useValue: response},
        EventEmitter
      ]
    );
    request.on("end", () => childInjector.destroy());
  });
  if (isString(hostname)) {
    server.listen(port, hostname);
  } else {
    server.listen(port);
  }
  let logger: Logger = injector.get(Logger);
  logger.info("Module.info: Server started", {port, hostname});
  server.on("error", (e) => logger.error(e.stack));
  return injector;
}

