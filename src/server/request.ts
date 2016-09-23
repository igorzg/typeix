import {IncomingMessage, ServerResponse} from "http";
import {Router, Methods} from "../router/router";
import {uuid, isString, isPresent} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IAfterConstruct, IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {parse} from "url";
import {Url} from "url";
import {ResolvedRoute} from "../interfaces/iroute";
import {HttpError} from "../error";
import {clean} from "../logger/inspect";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
/**
 * Cookie parse regex
 * @type {RegExp}
 */
const COOKIE_PARSE_REGEX = /(\w+[^=]+)=([^;]+)/g;
/**
 * @since 1.0.0
 * @class
 * @name Request
 * @constructor
 * @description
 * Request is responsible for handling router result and processing all requests in system
 * This component is used internally by framework
 *
 * @private
 */
@Injectable()
export class Request implements IAfterConstruct {

  /**
   * @param IncomingMessage
   * @description
   * Value provided by injector which handles request input
   */
  @Inject("request")
  private request: IncomingMessage;

  /**
   * @param ServerResponse
   * @description
   * Value provided by injector which handles response output
   */
  @Inject("response")
  private response: ServerResponse;

  /**
   * @param {Boolean} isCustomError
   * @description
   * Value provided by injector which handles custom error responses
   */
  @Inject("isCustomError")
  private isCustomError: boolean;

  /**
   * @param {Boolean} isForwarded
   * @description
   * Information internally used by request itself on forwarded requests
   */
  @Inject("isForwarded")
  private isForwarded: boolean;

  /**
   * @param {Boolean} isForwarder
   * @description
   * Information internally used by request itself on forwarded requests
   */
  @Inject("isForwarder")
  private isForwarder: boolean;

  /**
   * @param {Array<Buffer>} data
   * @description
   * Data received by client on POST, PATCH, PUT requests
   */
  @Inject("data")
  private data: Array<Buffer>;

  /**
   * @param {Array<IModuleMetadata>} modules
   * @description
   * Lost of modules imported on current module
   */
  @Inject("modules")
  private modules: Array<IModuleMetadata>;

  /**
   * @param {Array<IProvider|Function>} controllers
   * @description
   * List of controllers assigned to current module
   */
  @Inject("controllers")
  private controllers: Array<IProvider|Function>;

  /**
   * @param {Number} statusCode
   * @description
   * Request status code default 200
   */
  @Inject("statusCode", true)
  private statusCode: number;

  /**
   * @param {Injector} Injector
   * @description
   * Injector which created request
   */
  @Inject(Injector)
  private injector: Injector;

  /**
   * @param {Logger} logger
   * @description
   * Provided by injector
   */
  @Inject(Logger)
  private logger: Logger;

  /**
   * @param {Router} router
   * @description
   * Provided by injector
   */
  @Inject(Router)
  private router: Router;

  /**
   * @param {EventEmitter} eventEmitter
   * @description
   * Responsible for handling events
   */
  @Inject(EventEmitter)
  private eventEmitter: EventEmitter;

  /**
   * @param {string} id
   * @description
   * UUID identifier of request
   */
  private id: string = uuid();
  /**
   * @param {Url} url
   * @description
   * Parsed request url
   */
  private url: Url;

  /**
   * @since 1.0.0
   * @function
   * @name Request#destroy
   * @private
   * @description
   * Destroy all references to free memory
   */
  destroy() {
    this.eventEmitter.emit("destroy");
    this.eventEmitter.removeAllListeners();
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#afterConstruct
   * @private
   * @description
   * This function is called by injector after constructor is initialized
   */
  afterConstruct(): void {
    this.url = parse(this.request.url, true);
    this.logger.trace("Request.args", {
      id: this.id,
      url: this.url
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#render
   * @param {Buffer|String} response
   * @private
   * @description
   * This method sends data to client
   */
  render(response: string | Buffer): string | Buffer {
    this.logger.info("Request.render", {
      id: this.id
    });
    if (isString(response) || (response instanceof Buffer)) {
      this.response.writeHead(this.statusCode, {"Content-Type": "text/html"});
      this.response.write(response);
      this.response.end();
      return response;
    }
    this.logger.error("Invalid response type", {
      id: this.id,
      response: response,
      type: typeof response
    });
    throw new HttpError(500, "ResponseType must be string or buffer", {
      response
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#handleController
   * @private
   * @description
   * Handle controller instance
   */
  handleController(name: String, action: String, resolvedRoute: ResolvedRoute) {
    let controllerProvider: IProvider = this.controllers
      .map(item => Metadata.verifyProvider(item))
      .find((Class: IProvider) => {
        let metadata: IControllerMetadata = Metadata.getComponentConfig(Class.provide);
        return metadata.name === name;
      });
    if (!isPresent(controllerProvider)) {
      throw new HttpError(500, `You must define controller within current route`, {
        name,
        action,
        resolvedRoute
      });
    }

    let injector = new Injector(this.injector);
    injector.createAndResolve(controllerProvider, []);
    let controller = injector.get(controllerProvider.provide);
    let value = 1;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#handleModule
   * @private
   * @description
   * Handle module instance
   */
  handleModule(module: String, name: String, action: String, resolvedRoute: ResolvedRoute) {
    throw new HttpError(500, `Modules are not implemented in current version :)`, {
      module,
      name,
      action,
      resolvedRoute
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#process
   * @private
   * @description
   * Process request logic
   */
  process(): Promise<any> {
    // destroy on end
    if (!this.isForwarded) {
      this.response.once("finish", () => this.destroy());
      // destroy if connection was terminated before end
      this.response.once("close", () => this.destroy());
    }
    // process request
    return this.router
      .parseRequest(this.url.pathname, this.request.method, this.request.headers)
      .then((resolvedRoute: ResolvedRoute) => {
        this.logger.info("Route.parseRequest", {
          id: this.id,
          isCustomError: this.isCustomError,
          isForwarded: this.isForwarded,
          method: this.request.method,
          path: this.url.pathname,
          route: resolvedRoute
        });

        if ([Methods.POST, Methods.PATCH, Methods.PUT].indexOf(resolvedRoute.method) > -1 && !this.isForwarded) {
          this.request.on("data", item => this.data.push(item));
          return new Promise(resolve => this.request.on("end", resolve.bind({}, resolvedRoute)));
        }
        return resolvedRoute;
      })
      .then((resolvedRoute: ResolvedRoute) => {
        let [module, controller, action] = resolvedRoute.route.split("/");
        if (!isPresent(action)) {
          return this.handleController(module, controller, resolvedRoute);
        } else if (isPresent(action)) {
          return this.handleModule(module, controller, action, resolvedRoute);
        }
        throw new HttpError(500, `Route definition is invalid, route must contain controller/action or module/controller/action pattern`, {
          resolvedRoute
        });
      })
      .catch((error: HttpError) => {
        // force HttpError to be thrown
        if (!(error instanceof HttpError)) {
          let _error: HttpError = error;
          error = new HttpError(500, _error.message, {});
          error.stack = _error.stack;
        }
        // log error message
        this.logger.error(error.message, {
          id: this.id,
          method: this.request.method,
          request: this.url,
          url: this.request.url,
          error
        });
        // status code is mutable
        this.statusCode = error.getCode();
        // render error
        return this.render(clean(error.toString()));
      })
      .catch((error: HttpError) => {
        // set status code
        this.statusCode = error.getCode();
        // clean log output
        return this.render(clean(error.toString()));
      })
      .catch((error: HttpError) => this.logger.error(error.message, {
        id: this.id,
        method: this.request.method,
        request: this.url,
        url: this.request.url,
        error
      }));
  }
}
