import {IncomingMessage, ServerResponse} from "http";
import {Router, Methods} from "../router/router";
import {uuid, isString, isPresent, toString, isClass, isNumber, isDate, isTruthy, isFalsy, isArray} from "../core";
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
import {Metadata, FUNCTION_KEYS, FUNCTION_PARAMS} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
import {IConnection} from "../interfaces/iconnection";
import {IAction} from "../interfaces/iaction";
import {TFilter} from "../interfaces/ifilter";
import {IParam} from "../interfaces/iparam";
/**
 * Cookie parse regex
 * @type {RegExp}
 */
const COOKIE_PARSE_REGEX = /(\w+[^=]+)=([^;]+)/g;
const CHAIN_KEY = "__chain__";
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
  @Inject("isRedirected")
  private isRedirected: boolean;

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
   * @param {Injector} reflectionInjector
   * @description
   * Injector
   */
  private reflectionInjector: Injector;
  /**
   * @param {boolean} isChainStopped
   * @description
   * When chain is stopped framework will not propagate actions
   */
  @Inject("isChainStopped", true)
  private isChainStopped: boolean;

  /**
   * @since 1.0.0
   * @function
   * @name Request#setStatusCode
   * @private
   * @description
   * Set request status code
   */
  setStatusCode(code: number) {
    this.statusCode = code;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#stopChain
   * @private
   * @description
   * Stop action chain
   */
  stopActionChain() {
    this.isChainStopped = true;
  }

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
   * @name Request#getEventEmitter
   * @private
   *
   * @description
   * Get request event emitter
   */
  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getIncomingMessage
   * @private
   *
   * @description
   * Get IncomingMessage object
   */
  getIncomingMessage(): IncomingMessage {
    return this.request;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getServerResponse
   * @private
   *
   * @description
   * Get ServerResponse object
   */
  getServerResponse(): ServerResponse {
    return this.response;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getRequestBody
   * @private
   *
   * @description
   * Get request body if present only on POST, PUT, PATCH
   */
  getRequestBody(): Buffer {
    return Buffer.concat(this.data);
  }


  /**
   * @since 1.0.0
   * @function
   * @name Request#getUUID
   * @private
   *
   * @description
   * Return uuid created with this request
   */
  getUUID(): string {
    return this.id;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#setContentType
   * @private
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
          return new Promise((resolve, reject) => {
            this.request.on("error", reject.bind(this));
            this.request.on("end", resolve.bind(this, resolvedRoute));
          });
        }
        return resolvedRoute;
      })
      .then((resolvedRoute: ResolvedRoute) => {
        // set request reflection
        this.reflectionInjector = Injector.createAndResolveChild(this.injector, RequestReflection, [
          {provide: Request, useValue: this},
          {provide: "resolvedRoute", useValue: resolvedRoute}
        ]);

        // define module controller action
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

        if (isPresent(this.reflectionInjector)) {
          // define module controller action
          let resolvedRoute: ResolvedRoute = this.reflectionInjector.get("resolvedRoute");

          let [module, controller, action] = resolvedRoute.route.split("/");

          if (!isPresent(action)) {
            // find controller
            let controllerProvider = this.getControllerProvider(module, controller, resolvedRoute);
            // get mapped action metadata
            let mappedAction: any = this.getMappedAction(controllerProvider, controller, resolvedRoute);
            // get on error
            let onError = this.getDecoratorByMappedAction(controllerProvider, mappedAction, "OnError");
            // if on error is present define custom error
            if (isPresent(onError)) {
              // set code from it
              this.statusCode = onError.value.status;
              // get custom message
              return this.render(onError.value.message);
            }

          } else if (isPresent(action)) {
            return this.handleModule(module, controller, action, resolvedRoute);
          }
        }
        // status code is mutable
        this.statusCode = error.getCode();
        // render error
        return this.render(clean(error.toString()));
      })
      .catch((error: HttpError) => {

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
   * @name Request#isControllerPrototypeOf
   * @private
   * @description
   * Validate controller inheritance
   */
  isControllerInherited(a: Function, b: Function) {
    return b.isPrototypeOf(a.prototype) || Object.is(a.prototype, b);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#hasMappedAction
   * @private
   * @description
   * Check if controller has mapped action
   */
  hasMappedAction(controllerProvider: IProvider, actionName: String, name: String = "Action"): boolean {
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) => this.isControllerInherited(controllerProvider.provide, item.proto));

    return isPresent(mappings.find(item => item.type === name && item.value === actionName));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getMappedAction
   * @private
   * @description
   * Returns a mapped action metadata
   */
  getMappedAction(controllerProvider: IProvider, actionName: String, resolvedRoute: ResolvedRoute, name: String = "Action"): IAction {
    // get mappings from controller
    let mappings = Metadata
      .getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) => item.type === name && item.value === actionName && this.isControllerInherited(controllerProvider.provide, item.proto));

    let mappedAction;
    // search mapped on current controller
    if (mappings.length > 0) {
      mappedAction = mappings.find(item => item.className === Metadata.getName(controllerProvider.provide));
    }
    // get first parent one from inheritance
    if (!isPresent(mappedAction)) {
      mappedAction = mappings.pop();
    }
    // check if action is present
    if (!isPresent(mappedAction)) {
      throw new HttpError(500, `@${name}("${actionName}") is not defined on controller ${Metadata.getName(controllerProvider.provide)}`, {
        name,
        actionName,
        resolvedRoute
      });
    }

    return mappedAction;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getDecoratorByMappedAction
   * @private
   * @description
   * Get param decorator by mapped action
   */
  getDecoratorByMappedAction(controllerProvider: IProvider, mappedAction: any, paramName: string): any {
    // get mappings from controller
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS);
    return mappings.find((item: IAction) => item.type === paramName && item.key === mappedAction.key && this.isControllerInherited(controllerProvider.provide, item.proto));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getMappedActionArguments
   * @private
   * @description
   * Get list of action arguments
   */
  getMappedActionArguments(controllerProvider: IProvider, mappedAction: any): Array<any> {
    // get mappings from controller
    let mappings = Metadata.getMetadata(controllerProvider.provide.prototype, FUNCTION_PARAMS);
    return mappings.filter((item: IParam) => item.key === mappedAction.key);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getControllerProvider
   * @private
   * @description
   * Returns a controller provider
   */
  getControllerProvider(name: String, actionName: String, resolvedRoute: ResolvedRoute): IProvider {
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
    } else if (!isClass(controllerProvider.provide)) {
      throw new HttpError(500, `Controller must be a class type`, {
        name,
        actionName,
        resolvedRoute
      });
    }
    return controllerProvider;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#processAction
   * @private
   * @description
   * Process mapped action
   */
  processAction(injector: Injector,
                controllerProvider: IProvider,
                mappedAction: IAction,
                resolvedRoute: ResolvedRoute): string | Buffer {
    // get controller instance
    let controllerInstance = injector.get(controllerProvider.provide);
    // get action
    let action = controllerInstance[mappedAction.key].bind(controllerInstance);
    // content type
    let contentType = this.getDecoratorByMappedAction(controllerProvider, mappedAction, "Produces");
    if (isPresent(contentType)) {
      this.contentType = contentType;
    }
    // resolve action params
    let actionParams = [];
    let params: Array<any> = this.getMappedActionArguments(controllerProvider, mappedAction);

    if (isPresent(params)) {
      // make sure params are sorted correctly :)
      params.sort((a, b) => {
        if (a.paramIndex > b.paramIndex) {
          return 1;
        } else if (a.paramIndex < b.paramIndex) {
          return -1;
        }
        return 0;
      });
      // push action params
      params.forEach(param => {
        switch (param.type) {
          case "Param":
            if (
              (isPresent(resolvedRoute.params) && !resolvedRoute.params.hasOwnProperty(param.value)) || !isPresent(resolvedRoute.params)
            ) {
              throw new TypeError(`Property ${param.value} is not defined on route ${toString(resolvedRoute)}`);
            }
            actionParams.push(resolvedRoute.params[param.value]);
            break;
          case "Chain":
            actionParams.push(injector.get(CHAIN_KEY));
            break;
        }
      });
    }

    return action.apply(controllerInstance, actionParams);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#processControllerFilters
   * @private
   * @description
   * Process controller filters
   */
  async processFilters(injector: Injector,
                       name: string,
                       data: Array<TFilter>,
                       resolvedRoute: ResolvedRoute,
                       isAfter: boolean): Promise<any> {
    let filters = data.filter(item => {
      let metadata = Metadata.getComponentConfig(item);
      if (isPresent(metadata)) {
        return (
          metadata.route === "*" ||
          metadata.route === resolvedRoute.route ||
          metadata.route === (name + "/*")
        );
      }
      return false;
    })
      .sort((aItem, bItem) => {
        let a: any = Metadata.getComponentConfig(aItem);
        let b: any = Metadata.getComponentConfig(bItem);
        if (a.priority > b.priority) {
          return -1;
        } else if (a.priority < b.priority) {
          return 1;
        }
        return 0;
      });

    for (let Class of filters) {
      let filterInjector = Injector.createAndResolveChild(injector, Class, []);
      let filter = filterInjector.get(Class);
      if (!isAfter) {
        let result = await filter.before(injector.get(CHAIN_KEY));
        injector.set(CHAIN_KEY, result);
      } else {
        let result = await filter.after(injector.get(CHAIN_KEY));
        injector.set(CHAIN_KEY, result);
      }
      filterInjector.destroy();
    }

    return await injector.get(CHAIN_KEY);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#handleController
   * @private
   * @description
   * Handle controller instance
   */
  async handleController(name: string, actionName: String, resolvedRoute: ResolvedRoute): Promise<any> {

    // find controller
    let controllerProvider = this.getControllerProvider(name, actionName, resolvedRoute);
    // get controller metadata
    let metadata: IControllerMetadata = Metadata.getComponentConfig(controllerProvider.provide);
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
    let injector = new Injector(this.reflectionInjector, [CHAIN_KEY]);

    // initialize controller
    injector.createAndResolve(
      controllerProvider,
      Metadata.verifyProviders(providers)
    );

    // set default chain key
    injector.set(CHAIN_KEY, null);

    // process filters
    if (isArray(metadata.filters)) {
      // set filter result
      injector.set(CHAIN_KEY, await this.processFilters(injector, name, metadata.filters, resolvedRoute, false));
    }

    // process @BeforeEach action
    if (this.hasMappedAction(controllerProvider, null, "BeforeEach") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, resolvedRoute, "BeforeEach"),
        resolvedRoute
      );

      injector.set(CHAIN_KEY, result);
    }

    // process @Before action
    if (this.hasMappedAction(controllerProvider, actionName, "Before") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, resolvedRoute, "Before"),
        resolvedRoute
      );

      injector.set(CHAIN_KEY, result);
    }

    // Action
    if (isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, resolvedRoute),
        resolvedRoute
      );
      injector.set(CHAIN_KEY, result);
    }

    // process @After action
    if (this.hasMappedAction(controllerProvider, actionName, "After") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, resolvedRoute, "After"),
        resolvedRoute
      );
      injector.set(CHAIN_KEY, result);
    }

    // process @AfterEach action
    if (this.hasMappedAction(controllerProvider, null, "AfterEach") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, resolvedRoute, "AfterEach"),
        resolvedRoute
      );
      injector.set(CHAIN_KEY, result);
    }

    if (isFalsy(this.isChainStopped) && isFalsy(this.isForwarder) && isFalsy(this.isRedirected) && isArray(metadata.filters)) {
      // set filter result
      injector.set(CHAIN_KEY, await this.processFilters(injector, name, metadata.filters, resolvedRoute, true));
    }

    // render action call
    return this.render(await injector.get(CHAIN_KEY));
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
   * @param Request
   * @description
   * Current internal Request instance
   */
  @Inject(Request)
  private request: Request;

  /**
   * @param ResolvedRoute
   * @description
   * Current internal resolved route
   */
  @Inject("resolvedRoute")
  private resolvedRoute: ResolvedRoute;
  /**
   * @param cookies
   * @description
   * Cookies object are stored to this object first time thy are parsed
   */
  private cookies: {[key: string]: string};

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#onDestroy
   *
   * @description
   * Add destroy event to public api
   */
  onDestroy(callback: Function): void {
    this.request.getEventEmitter().once("destroy", callback);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getConnection
   *
   * @description
   * Get connection data
   */
  getConnection(): IConnection {
    let request = this.request.getIncomingMessage();
    return {
      uuid: this.request.getUUID(),
      method: request.method,
      url: request.url,
      httpVersion: request.httpVersion,
      httpVersionMajor: request.httpVersionMajor,
      httpVersionMinor: request.httpVersionMinor,
      remoteAddress: request.connection.remoteAddress,
      remoteFamily: request.connection.remoteFamily,
      remotePort: request.connection.remotePort,
      localAddress: request.connection.localAddress,
      localPort: request.connection.localPort,
    };
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getCookies
   *
   * @description
   * Return parsed cookies
   */
  getCookies(): {[key: string]: string} {

    if (isPresent(this.cookies)) {
      return this.cookies;
    }
    // get cookie string
    let cookie: string = this.getRequestHeader("Cookie");

    if (isPresent(cookie)) {

      this.cookies = {};

      // parse cookies
      cookie.match(COOKIE_PARSE_REGEX)
        .map(item => item.split(COOKIE_PARSE_REGEX).slice(1, -1))
        .map(item => {
          return {
            key: item.shift(),
            value: item.shift()
          };
        })
        .forEach(item => {
          this.cookies[item.key] = item.value;
        });

      return this.cookies;
    }

    return {};
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getCookie
   *
   * @description
   * Return request headers
   */
  getCookie(name: string): string {
    let cookies = this.getCookies();
    return cookies[name];
  }

  /**
   * @since 0.0.1
   * @function
   * @name RequestReflection#setResponseCookie
   * @param {String} key cookie name
   * @param {String} value cookie value
   * @param {String|Object|Number} expires expire date
   * @param {String} path cookie path
   * @param {String} domain cookie domain
   * @param {Boolean} isHttpOnly is http only
   * @description
   * Sets an cookie header
   */
  setCookie(key: string, value: string, expires?: number | Date | string, path?: string, domain?: string, isHttpOnly?: boolean) {

    let cookie = key + "=" + value;

    if (isPresent(expires) && isNumber(expires)) {
      let date: Date = new Date();
      date.setTime(date.getTime() + (<number> expires));
      cookie += "; Expires=";
      cookie += date.toUTCString();
    } else if (isPresent(expires) && isString(expires)) {
      cookie += "; Expires=" + expires;
    } else if (isPresent(expires) && isDate(expires)) {
      cookie += "; Expires=";
      cookie += (<Date> expires).toUTCString();
    }

    if (isPresent(path)) {
      cookie += "; Path=" + path;
    }
    if (isPresent(domain)) {
      cookie += "; Domain=" + domain;
    }
    if (isTruthy(isHttpOnly)) {
      cookie += "; HttpOnly";
    }
    this.setResponseHeader("Set-cookie", cookie);

  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getRequestHeaders
   *
   * @description
   * Return request headers
   */
  getRequestHeaders(): any {
    return this.request.getIncomingMessage().headers;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getRequestHeader
   *
   * @description
   * Return request header by name
   */
  getRequestHeader(name: string): any {
    let requestHeaders = this.getRequestHeaders();
    let headers = isPresent(requestHeaders) ? requestHeaders : {};
    return headers[name.toLocaleLowerCase()];
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#setResponseHeader
   * @param {String} name
   * @param {String} value
   *
   * @description
   * Set response header
   */
  setResponseHeader(name: string, value: string | string[]): void {
    this.request.getServerResponse().setHeader(name, value);
  }

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

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#getRequestBody
   *
   * @description
   * Get request body buffer
   */
  getRequestBody(): Buffer {
    return this.request.getRequestBody();
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#setStatusCode
   *
   * @description
   * Set status code
   */
  setStatusCode(code: number) {
    this.request.setStatusCode(code);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RequestReflection#stopActionChain
   *
   * @description
   * Stops action chain
   */
  stopActionChain() {
    this.request.stopActionChain();
  }
}
