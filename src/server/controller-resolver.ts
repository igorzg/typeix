import {IncomingMessage, ServerResponse} from "http";
import {Methods} from "../router/router";
import {isString, isPresent, toString, isNumber, isDate, isTruthy, isFalsy, isArray} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IProvider} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {Url} from "url";
import {ResolvedRoute} from "../interfaces/iroute";
import {HttpError} from "../error";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {Metadata, FUNCTION_KEYS, FUNCTION_PARAMS} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
import {IConnection} from "../interfaces/iconnection";
import {IAction} from "../interfaces/iaction";
import {IParam} from "../interfaces/iparam";
import {StatusCode} from "./status-code";
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
 * ControllerResolver is responsible for handling router result and processing all requests in system
 * This component is used internally by framework
 *
 * @private
 */
@Injectable()
export class ControllerResolver {

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
  @Inject("UUID")
  private id: string;
  /**
   * @param {Url} url
   * @description
   * Parsed request url
   */
  @Inject("url")
  private url: Url;

  /**
   * @param {IProvider} controllerProvider
   * @description
   * Injector
   */
  @Inject("controllerProvider")
  private controllerProvider: IProvider;
  /**
   * @param {actionName} actionName:
   * @description
   * Action name
   */
  @Inject("actionName")
  private actionName: string;
  /**
   * @param {boolean} isChainStopped
   * @description
   * When chain is stopped framework will not propagate actions
   */
  @Inject("isChainStopped", true)
  private isChainStopped: boolean;

  /**
   * @param {ResolvedRoute} resolvedRoute
   * @description
   * Resolved route from injector
   */
  @Inject("resolvedRoute")
  private resolvedRoute: ResolvedRoute;

  /**
   * @since 1.0.0
   * @function
   * @name Request#isControllerPrototypeOf
   * @private
   * @description
   * Validate controller inheritance
   */
  static isControllerInherited(a: Function, b: Function) {
    return b.isPrototypeOf(a.prototype) || Object.is(a.prototype, b);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#stopChain
   * @private
   * @description
   * Stop action chain
   */
  stopChain() {
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
   * @name Request#getBody
   * @private
   *
   * @description
   * Get request body if present only on POST, PUT, PATCH
   */
  getBody(): Buffer {
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
   * @name Request#process
   * @private
   * @description
   * Process request logic
   */
  process(): Promise<string|Buffer> {

    // destroy on end
    if (!this.isForwarded) {
      this.response.once("finish", () => this.destroy());
      // destroy if connection was terminated before end
      this.response.once("close", () => this.destroy());
    }

    // set request reflection
    let reflectionInjector = Injector.createAndResolveChild(this.injector, Request, [
      {provide: ControllerResolver, useValue: this}
    ]);

    return this.processController(reflectionInjector, this.controllerProvider, this.actionName);
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
      .filter((item: IAction) => ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto));

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
  getMappedAction(controllerProvider: IProvider, actionName: String, name: String = "Action"): IAction {
    // get mappings from controller
    let mappings = Metadata
      .getMetadata(controllerProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) =>
        item.type === name && item.value === actionName &&
        ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto)
      );

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
      throw new HttpError(StatusCode.Bad_Request, `@${name}("${actionName}") is not defined on controller ${Metadata.getName(controllerProvider.provide)}`, {
        name,
        actionName,
        resolvedRoute: this.resolvedRoute
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
    return mappings.find((item: IAction) =>
      item.type === paramName && item.key === mappedAction.key &&
      ControllerResolver.isControllerInherited(controllerProvider.provide, item.proto)
    );
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
   * @name Request#processAction
   * @private
   * @description
   * Process mapped action
   */
  processAction(injector: Injector,
                controllerProvider: IProvider,
                mappedAction: IAction): string | Buffer {
    // get controller instance
    let controllerInstance = injector.get(controllerProvider.provide);
    // get action
    let action = controllerInstance[mappedAction.key].bind(controllerInstance);
    // content type
    let contentType: IParam = this.getDecoratorByMappedAction(controllerProvider, mappedAction, "Produces");

    if (isPresent(contentType)) {
      this.getEventEmitter().emit("contentType", contentType.value);
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
              (isPresent(this.resolvedRoute.params) && !this.resolvedRoute.params.hasOwnProperty(param.value)) || !isPresent(this.resolvedRoute.params)
            ) {
              throw new TypeError(`Property ${param.value} is not defined on route ${toString(this.resolvedRoute)}`);
            }
            actionParams.push(this.resolvedRoute.params[param.value]);
            break;
          case "Chain":
            actionParams.push(injector.get(CHAIN_KEY));
            break;
          case "Inject":
            actionParams.push(injector.get(param.value));
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
                       metadata: IControllerMetadata,
                       isAfter: boolean): Promise<any> {

    let filters = metadata.filters.filter(item => {
      let filterMetadata = Metadata.getComponentConfig(item);
      if (isPresent(filterMetadata)) {
        return (
          filterMetadata.route === "*" ||
          filterMetadata.route === this.resolvedRoute.route ||
          filterMetadata.route === (metadata.name + "/*")
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

      if (isFalsy(this.isChainStopped)) {
        if (!isAfter) {
          let result = await filter.before(injector.get(CHAIN_KEY));
          injector.set(CHAIN_KEY, result);
        } else {
          let result = await filter.after(injector.get(CHAIN_KEY));
          injector.set(CHAIN_KEY, result);
        }
      }

      filterInjector.destroy();
    }

    return await injector.get(CHAIN_KEY);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#processController
   * @private
   * @description
   * Handle controller instance
   */
  async processController(reflectionInjector: Injector,
                          controllerProvider: IProvider,
                          actionName: String): Promise<any> {
    // get controller metadata
    let metadata: IControllerMetadata = Metadata.getComponentConfig(controllerProvider.provide);
    let providers: Array<IProvider> = Metadata.verifyProviders(metadata.providers);
    // limit controller api
    let limitApi = ["request", "response", "controllerProvider", "modules"];
    limitApi.forEach(item => providers.push({provide: item, useValue: {}}));

    // create controller injector
    let injector = new Injector(reflectionInjector, [CHAIN_KEY]);

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
      injector.set(CHAIN_KEY, await this.processFilters(injector, metadata, false));
    }

    // process @BeforeEach action
    if (this.hasMappedAction(controllerProvider, null, "BeforeEach") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, "BeforeEach")
      );

      injector.set(CHAIN_KEY, result);
    }

    // process @Before action
    if (this.hasMappedAction(controllerProvider, actionName, "Before") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, "Before")
      );

      injector.set(CHAIN_KEY, result);
    }

    // Action
    if (isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName)
      );
      injector.set(CHAIN_KEY, result);
    }

    // process @After action
    if (this.hasMappedAction(controllerProvider, actionName, "After") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, actionName, "After")
      );
      injector.set(CHAIN_KEY, result);
    }

    // process @AfterEach action
    if (this.hasMappedAction(controllerProvider, null, "AfterEach") && isFalsy(this.isChainStopped)) {
      let result = await this.processAction(
        injector,
        controllerProvider,
        this.getMappedAction(controllerProvider, null, "AfterEach")
      );
      injector.set(CHAIN_KEY, result);
    }

    if (isFalsy(this.isChainStopped) && isFalsy(this.isForwarder) && isArray(metadata.filters)) {
      // set filter result
      injector.set(CHAIN_KEY, await this.processFilters(injector, metadata, true));
    }

    // render action call
    return await injector.get(CHAIN_KEY);
  }
}

/**
 * @since 1.0.0
 * @class
 * @name Request
 * @constructor
 * @description
 * Get request reflection to limit public api
 *
 * @private
 */
@Injectable()
export class Request {

  /**
   * @param ControllerResolver
   * @description
   * Current internal ControllerResolver instance
   */
  @Inject(ControllerResolver)
  private controllerResolver: ControllerResolver;

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
   * @name Request#onDestroy
   *
   * @description
   * Add destroy event to public api
   */
  onDestroy(callback: Function): void {
    this.controllerResolver.getEventEmitter().once("destroy", callback);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getConnection
   *
   * @description
   * Get connection data
   */
  getConnection(): IConnection {
    let request = this.controllerResolver.getIncomingMessage();
    return {
      uuid: this.controllerResolver.getUUID(),
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
   * @name Request#getCookies
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
   * @name Request#getCookie
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
   * @name Request#setResponseCookie
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
   * @name Request#getRequestHeaders
   *
   * @description
   * Return request headers
   */
  getRequestHeaders(): any {
    return this.controllerResolver.getIncomingMessage().headers;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getRequestHeader
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
   * @name Request#setResponseHeader
   * @param {String} name
   * @param {String} value
   *
   * @description
   * Set response header
   */
  setResponseHeader(name: string, value: string | string[]): void {
    this.controllerResolver.getServerResponse().setHeader(name, value);
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
    this.controllerResolver.getEventEmitter().emit("contentType", value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getParams
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
   * @name Request#getParam
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
   * @name Request#getMethod
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
   * @name Request#getRoute
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
   * @name Request#getBody
   *
   * @description
   * Get request body buffer
   */
  getBody(): Buffer {
    return this.controllerResolver.getBody();
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#setStatusCode
   *
   * @description
   * Set status code
   */
  setStatusCode(code: StatusCode | number) {
    this.controllerResolver.getEventEmitter().emit("statusCode", code);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#stopChain
   *
   * @description
   * Stops action chain
   */
  stopChain() {
    this.controllerResolver.stopChain();
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#redirectTo
   *
   * @description
   * Stops action chain
   */
  redirectTo(url: string, code: StatusCode | number) {
    this.stopChain();
    this.controllerResolver.getEventEmitter().emit("redirectTo", {
      url, code
    });
  }
}
