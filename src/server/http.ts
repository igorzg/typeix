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
import { Context, Callback, APIGatewayEventRequestContext } from "aws-lambda";
import {httpVerb} from "./http-verbs"
import * as requestResponse  from "aws-lambda-create-request-response";



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
 * @since 2.0.5
 * @interface
 *
 * @description
 * Configuration options for a serverless event
 */
export interface lambdaEvent {
  eventPayload:any;
  eventSource:string;
  httpMethod:httpVerb;
  path:string;
  body:string
  headers: Array<string> ;
  rawHeaders: string[];
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  identity?:any;
  requestContext: APIGatewayEventRequestContext;
}

/**
 * @since 2.0.5
 * @function
 * @name bootstrapApp
 * @param {Function} Class Root application module to bootstrap
 * @returns {Injector}
 *
 * @description
 * "prewarm" the application resolve the applications components, should be only called directly by
 * serverless applications directly to ensure the app bootstrap process has a chance to survive multiple invocations
 * will be called internally by the httpServer on startup
 */
export function bootstrapApp(Class: Function): Array<IModule> {
  let metadata: IModuleMetadata = Metadata.getComponentConfig(Class);
  // override bootstrap module
  metadata.name = BOOTSTRAP_MODULE;
  // set module config
  Metadata.setComponentConfig(Class, metadata);
  let modules: Array<IModule> = createModule(Class);
  //get logger and write debug info
  let injector = getModule(modules).injector;
  let logger: Logger = injector.get(Logger);
  logger.info("Module.info: serverless Application Bootsrapped");

  return modules;
}


/**
 * @since 2.0.5
 * @function
 * @name run
 * @param {Array<IModule>} modules The list of bootstrapped modules
 * @param {any} the event object of a lambda execution
 * @param {Context} the context of the lambda execution
 * @param {Callback} the callback passed in by lambda
 * @returns {Injector}
 *
 * @description
 * run a lambda execution
 */
export function invokeRequest(app:Array<IModule>, event:any, context:Context, callback:Callback):Array<IModule>{
    event = prepareEvent(event, context);
    // build request and response objects
    const {req, res} = requestResponse(event, callback);
    let injector = getModule(app).injector;
    let logger: Logger = injector.get(Logger);
    logger.info("Module.info: start serving invokation");
    req.ctx=context;
    // fires the request from here a serveless request is handled like any other request
    fireRequest(app, req, res, event, context);
    return app;
}



/**
 * @since 2.0.5
 * @function
 * @name prepareEvent
 * @param {Array<IModule>} modules The list of bootstrapped modules
 * @param {any} the event object of a lambda execution
 * @param {Context} the context of the lambda execution
 * @returns {lambdaEvent}
 *
 * @description
 * unifies Lambda event and set's defaults for event types which don't contain certain fields needed by the router
 */
function prepareEvent(event:any, ctx: Context): lambdaEvent{
  const cleanedEvent:lambdaEvent = {
    eventPayload:event,
    requestContext:  event.requestContext || {},
    eventSource:"tbd", // TODO app should be able to identify event sources and inject routable information
    httpMethod:event.httpMethod || 'GET',
    path: event.path || '/',
    body: event.body || '',
    headers: [],
    rawHeaders: event.headers || [],
    identity:ctx.identity || {}
  }
  return cleanedEvent;

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

  let modules: Array<IModule> = bootstrapApp(Class);
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
