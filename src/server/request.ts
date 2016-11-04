import {IncomingMessage, ServerResponse} from "http";
import {Router, Methods} from "../router/router";
import {uuid, isString, isPresent, toString} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IAfterConstruct, IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {parse, Url} from "url";
import {ResolvedRoute} from "../interfaces/iroute";
import {HttpError} from "../error";
import {clean} from "../logger/inspect";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {IModuleMetadata} from "../interfaces/imodule";
import {Metadata, FUNCTION_KEYS} from "../injector/metadata";
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
   * @param {String} contentType
   * @description
   * Content type
   */
  @Inject("contentType", true)
  private contentType: String;


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
   * @name Request#setContentType
   * @param {String} value
   *
   * @description
   * Set response content type
   */
  setContentType(value: string) {
    this.contentType = value;
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
          this.request.on("data", item => this.data.push(<Buffer> item));
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
      this.response.writeHead(this.statusCode, {"Content-Type": this.contentType});
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
  async handleController(name: String, actionName: String, resolvedRoute: ResolvedRoute): Promise<any> {
    // find controller
    let controllerProvider: IProvider = this.controllers
      .map(item => Metadata.verifyProvider(item))
      .find((Class: IProvider) => {
        let metadata: IControllerMetadata = Metadata.getComponentConfig(Class.provide);
        return metadata.name === name;
      });
    if (!isPresent(controllerProvider)) {
      throw new HttpError(500, `You must define controller within current route`, {
        name,
        actionName,
        resolvedRoute
      });
    }
    // set request reflection
    let requestReflectionInjector = Injector.createAndResolveChild(this.injector, RequestReflection, [
      {provide: Request, useValue: this},
      {provide: "resolvedRoute", useValue: resolvedRoute}
    ]);
    // get controller metadata
    let metadata: IModuleMetadata = Metadata.getComponentConfig(controllerProvider.provide);
    let providers: Array<IProvider> = Metadata.verifyProviders(metadata.providers);
    // limit controller api, no access to request api
    providers.push({
      provide: "request",
      useValue: {}
    });
    // limit controller api, no access to response api
    providers.push({
      provide: "response",
      useValue: {}
    });
    // create controller injector
    let injector = new Injector(requestReflectionInjector);
    // initialize controller
    injector.createAndResolve(
      controllerProvider,
      Metadata.verifyProviders(providers)
    );
    // get controller instance
    let instance = injector.get(controllerProvider.provide);
    let mappings = Metadata.getMetadata(instance, FUNCTION_KEYS);
    let mappedAction: any = mappings.find(item => item.type === "Action" && item.value === actionName);
    if (!isPresent(mappedAction)) {
      throw new HttpError(500, `Action is not defined on controller ${Metadata.getName(instance)}`, {
        instance,
        name,
        actionName,
        resolvedRoute
      });
    }
    // get action
    let action = instance[mappedAction.key].bind(instance);
    // content type
    let contentType = mappings.find(item => item.type === "Produces" && item.key === mappedAction.key);
    if (isPresent(contentType)) {
      this.contentType = contentType;
    }
    // resolve action params
    let actionParams = [];
    let params = mappings.filter(item => item.type === "Param" && item.key === mappedAction.key);
    if (isPresent(params)) {
      params.forEach(param => {
        if (
          (isPresent(resolvedRoute.params) && !resolvedRoute.params.hasOwnProperty(param.value)) || !isPresent(resolvedRoute.params)
        ) {
          throw new TypeError(`Property ${param.value} is not defined on route ${toString(resolvedRoute)}`);
        }
        actionParams.push(resolvedRoute.params[param.value]);
      });

    }
    // resolve action call
    return Promise.resolve(await action.apply(instance, actionParams)).then(resolved => this.render(resolved));
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
}

/**
 * @since 1.0.0
 * @class
 * @name RequestReflection
 * @constructor
 * @description
 * Get request reflection to limit public api
 *
 * @private
 */
@Injectable()
export class RequestReflection {
  /**
   * Inject request
   */
  @Inject(Request)
  private request: Request;

  /**
   * Get resolved route
   */
  @Inject("resolvedRoute")
  private resolvedRoute: ResolvedRoute;

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#setContentType
   * @param {String} value
   *
   * @description
   * Set response content type
   */
  setContentType(value: string) {
    this.request.setContentType(value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getParams
   *
   * @description
   * Get all request parameters
   */
  getParams(): Object {
    return isPresent(this.resolvedRoute.params) ? this.resolvedRoute.params : {};
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getParam
   * @param {string} name
   *
   * @description
   * Get resolve route param
   */
  getParam(name: string): string {
    let params = this.getParams();
    return params[name];
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getMethod
   *
   * @description
   * Return resolved route method
   */
  getMethod(): Methods {
    return this.resolvedRoute.method;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getRoute
   *
   * @description
   * Return resolved route name
   */
  getRoute(): string {
    return this.resolvedRoute.route;
  }
}
