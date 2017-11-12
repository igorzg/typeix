import {IAfterConstruct, IProvider} from "../interfaces/iprovider";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {Methods, Router} from "../router/router";
import {Url} from "url";
import {IModule, IModuleMetadata, IResolvedModule} from "../interfaces/imodule";
import {IResolvedRoute} from "../interfaces/iroute";
import {isFalsy, isPresent, isString, isTruthy} from "../core";
import {HttpError} from "../error";
import {Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
import {getModule} from "./bootstrap";
import {ControllerResolver} from "./controller-resolver";
import {EventEmitter} from "events";
import {Injector} from "../injector/injector";
import {IRedirect, Status} from "./status-code";
import {clean} from "../logger/inspect";
import {IWebSocketMetadata} from "../interfaces/iwebsocket";
import {BaseRequest} from "./request";
import {SocketResolver} from "./socket-resolver";

export const MODULE_KEY = "__module__";
export const ERROR_KEY = "__error__";

/**
 * @since 1.1.0
 * @private
 */
export abstract class BaseRequestResolver {
  /**
   * @param IncomingMessage
   * @description
   * The current request being processed
   */
  @Inject("request")
  protected readonly request: IncomingMessage;

  /**
   * @param {Injector} injector
   * @description
   * Current injector
   */
  @Inject(Injector)
  protected readonly injector: Injector;

  /**
   * @param {Logger} logger
   * @description
   * Provided by injector
   */
  @Inject(Logger)
  protected readonly logger: Logger;

  /**
   * @param {Router} router
   * @description
   * Provided by injector
   */
  @Inject(Router)
  protected readonly router: Router;

  /**
   * @param {Array<Buffer>} data
   * @description
   * Data received by client on POST, PATCH, PUT requests
   */
  @Inject("data")
  protected readonly data: Array<Buffer>;

  /**
   * @param {string} id
   * @description
   * UUID identifier of request
   */
  @Inject("UUID")
  protected readonly id: string;

  /**
   * @param {Url} url
   * @description
   * Parsed request url
   */
  @Inject("url")
  protected readonly url: Url;

  /**
   * @param {Url} url
   * @description
   * Parsed request url
   */
  @Inject("modules")
  protected readonly modules: Array<IModule>;

  /**
   * @since 1.0.0
   * @function
   * @name BaseRequestResolver#process
   * @private
   * @description
   * Resolves route and resolves module before processing the module
   */
  process(): Promise<any> {

    // process request
    return this.router
      .parseRequest(this.url.pathname, this.request.method, this.request.headers)
      .then((resolvedRoute: IResolvedRoute) => {
        this.logger.info("Route.parseRequest", {
          method: this.request.method,
          path: this.url.pathname,
          route: resolvedRoute
        });

        /**
         * Copy query params to params if thy are not defined in path
         */
        if (isPresent(this.url.query)) {
          Object.keys(this.url.query).forEach(key => {
            if (!resolvedRoute.params.hasOwnProperty(key)) {
              resolvedRoute.params[key] = this.url.query[key];
            }
          });
        }
        /**
         * ON POST, PATCH, PUT process body
         */
        if ([Methods.POST, Methods.PATCH, Methods.PUT].indexOf(resolvedRoute.method) > -1) {
          this.request.on("data", item => this.data.push(<Buffer> item));
          return new Promise((resolve, reject) => {
            this.request.on("error", reject.bind(this));
            this.request.on("end", resolve.bind(this, resolvedRoute));
          });
        }

        return resolvedRoute;
      })
      .then((resolvedRoute: IResolvedRoute) => {
        let resolvedModule = this.getResolvedModule(resolvedRoute);
        this.injector.set(MODULE_KEY, resolvedModule);
        return resolvedModule;
      })
      .then(resolvedModule => this.processModule(resolvedModule))
      .catch(data => this.handleError(data));
  }

  /**
   * @since 1.0.0
   * @param {IResolvedModule} resolvedModule
   * @return {Promise<any>}
   * @private
   */
  abstract processModule(resolvedModule: IResolvedModule): Promise<any>;

  protected abstract handleError(data: any): any;

  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#getResolvedModule
   * @private
   * @description
   * Resolve route and return the corresponding resolved module as well as controller and action (if available)
   */
  protected getResolvedModule(resolvedRoute: IResolvedRoute): IResolvedModule {
    let [module, controller, action] = resolvedRoute.route.split("/");
    let resolvedModule: IModule = !isPresent(action) ? getModule(this.modules) : getModule(this.modules, module);
    if (isFalsy(resolvedModule)) {
      throw new HttpError(
        500,
        "Module with route " + resolvedRoute.route + " is not registered in system," +
        " please check your route configuration!",
        resolvedRoute
      );
    }
    return {
      action: !isPresent(action) ? controller : action,
      endpoint: !isPresent(action) ? module : controller,
      data: this.data,
      module: resolvedModule,
      resolvedRoute
    };
  }

}

/**
 * @since 1.0.0
 * @enum
 * @name Renderer
 * @description
 * RenderType types
 *
 * @private
 */
export enum RenderType {
  REDIRECT,
  DATA_HANDLER,
  CUSTOM_ERROR_HANDLER,
  DEFAULT_ERROR_HANDLER
}

/**
 * @since 1.0.0
 * @class
 * @name HttpRequestResolver
 * @constructor
 * @description
 * Get current request and resolve module and route
 *
 * @private
 */
@Injectable()
export class HttpRequestResolver extends BaseRequestResolver implements IAfterConstruct {

  /**
   * @param ServerResponse
   * @description
   * Value provided by injector which handles response output
   */
  @Inject("response")
  private readonly response: ServerResponse;

  /**
   * @param {Number} statusCode
   * @description
   * ControllerResolver status code default 200
   */
  @Inject("statusCode", true)
  private statusCode: Status;

  /**
   * @param {String} contentType
   * @description
   * Content type
   */
  @Inject("contentType", true)
  private contentType: String;
  /**
   * @param {EventEmitter} eventEmitter
   * @description
   * Responsible for handling events
   */
  @Inject(EventEmitter)
  private readonly eventEmitter: EventEmitter;

  /**
   * @param {String} redirectTo
   * @description
   * Set redirect to
   */
  private redirectTo: IRedirect;

  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#getControllerProvider
   * @private
   * @description
   * Returns a controller provider
   */
  static getControllerProvider(resolvedModule: IResolvedModule): IProvider {

    let provider: IProvider = Metadata.verifyProvider(resolvedModule.module.provider);
    let moduleMetadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);

    let controllerProvider: IProvider = moduleMetadata.controllers
      .map(item => Metadata.verifyProvider(item))
      .find((Class: IProvider) => {
        let metadata: IControllerMetadata = Metadata.getComponentConfig(Class.provide);
        return metadata.name === resolvedModule.endpoint;
      });
    if (!isPresent(controllerProvider)) {
      throw new HttpError(Status.Bad_Request, `You must define controller within current route: ${resolvedModule.resolvedRoute.route}`, {
        actionName: resolvedModule.action,
        controllerName: resolvedModule.endpoint,
        resolvedRoute: resolvedModule.resolvedRoute
      });
    }
    return controllerProvider;
  }

  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#afterConstruct
   *
   * @private
   * @description
   * Create events for status code and content type change
   */
  afterConstruct() {
    this.eventEmitter.on("statusCode", value => this.statusCode = value);
    this.eventEmitter.on("contentType", value => this.contentType = value);
    this.eventEmitter.on("redirectTo", value => this.redirectTo = value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#processError
   * @param {Object} data
   * @param {Boolean} isCustom
   *
   * @private
   * @description
   * Process error handling
   * @todo fix custom error handling
   */
  async processError(data: any, isCustom: boolean): Promise<Buffer | string> {
    // force HttpError to be thrown
    if (!(data instanceof HttpError)) {
      let _error: Error = data;
      data = new HttpError(Status.Internal_Server_Error, _error.message, {});
      data.stack = _error.stack;
    }
    // log error message
    this.logger.error(data.message, {
      id: this.id,
      method: this.request.method,
      request: this.url,
      url: this.request.url,
      data
    });

    // status code is mutable
    this.statusCode = data.getCode();

    if (isTruthy(isCustom) && this.router.hasError()) {

      let route: string;

      if (this.injector.has(MODULE_KEY)) {
        let iResolvedModule: IResolvedModule = this.injector.get(MODULE_KEY);
        route = this.router.getError(iResolvedModule.module.name);
      } else {
        route = this.router.getError();
      }

      let iResolvedErrorModule = this.getResolvedModule({
        method: Methods.GET,
        params: {},
        route
      });

      if (isTruthy(iResolvedErrorModule)) {
        return await this.processModule(iResolvedErrorModule, data);
      }

    }

    return await clean(data.toString());
  }

  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#render
   * @param {Buffer|String} response
   * @param {RenderType} type
   *
   * @private
   * @description
   * This method sends data to client
   */
  async render(response: string | Buffer, type: RenderType): Promise<string | Buffer> {

    let headers: OutgoingHttpHeaders = {"Content-Type": <string> this.contentType};

    switch (type) {
      case RenderType.DATA_HANDLER:
        if (isString(response) || (response instanceof Buffer)) {
          this.response.writeHead(this.statusCode, headers);
          this.response.write(response);
          this.response.end();

        } else {
          this.logger.error("Invalid response type", {
            id: this.id,
            response: response,
            type: typeof response
          });
          throw new HttpError(Status.Bad_Request, "ResponseType must be string or buffer", {
            response
          });
        }
        break;
      case RenderType.CUSTOM_ERROR_HANDLER:
        response = await this.processError(response, true);
        this.response.writeHead(this.statusCode, headers);
        this.response.write(response);
        this.response.end();
        break;
      case RenderType.DEFAULT_ERROR_HANDLER:
        response = await this.processError(response, false);
        this.response.writeHead(this.statusCode, headers);
        this.response.write(response);
        this.response.end();
        break;
      case RenderType.REDIRECT:
        this.response.setHeader("Location", this.redirectTo.url);
        this.response.writeHead(this.redirectTo.code);
        this.response.end();
        break;
      default:
        this.response.writeHead(500);
        this.response.write(`Invalid RenderType provided ${isPresent(response) ? response.toString() : ""}`);
        this.response.end();
        break;
    }

    return response;
  }


  /**
   * @since 1.0.0
   * @function
   * @name HttpRequestResolver#processModule
   * @private
   * @description
   * Resolve route and deliver resolved module
   */
  processModule(resolvedModule: IResolvedModule, error?: HttpError): Promise<string | Buffer> {
    let providers = [
      {provide: "data", useValue: this.data},
      {provide: "request", useValue: this.request},
      {provide: "response", useValue: this.response},
      {provide: "url", useValue: this.url},
      {provide: "UUID", useValue: this.id},
      {provide: "controllerProvider", useValue: HttpRequestResolver.getControllerProvider(resolvedModule)},
      {provide: "actionName", useValue: resolvedModule.action},
      {provide: "resolvedRoute", useValue: resolvedModule.resolvedRoute},
      {provide: "isChainStopped", useValue: false},
      {provide: ERROR_KEY, useValue: isTruthy(error) ? error : new HttpError(500)},
      {provide: EventEmitter, useValue: this.eventEmitter}
    ];
    /**
     * Create and resolve
     */
    let childInjector = Injector.createAndResolveChild(
      resolvedModule.module.injector,
      ControllerResolver,
      providers
    );
    /**
     * On finish destroy injector
     */
    this.response.on("finish", () => childInjector.destroy());
    /**
     * Get request instance
     * @type {any}
     */
    let pRequest: ControllerResolver = childInjector.get(ControllerResolver);
    /**
     * Process request and render
     */
    return pRequest
      .process()
      .then(data => this.render(data, isFalsy(this.redirectTo) ? RenderType.DATA_HANDLER : RenderType.REDIRECT));
  }

  protected handleError(data: any): void {
    this
      .render(data, RenderType.CUSTOM_ERROR_HANDLER)
      .catch(() => this.render(data, RenderType.DEFAULT_ERROR_HANDLER));
  }
}

/**
 * @since 1.1.0
 * @class
 * @name SocketRequestResolver
 * @constructor
 * @description
 * Handles the current request and resolves to a socket
 *
 * @private
 */
@Injectable()
export class SocketRequestResolver extends BaseRequestResolver {

  static getSocketProvider(resolvedModule: IResolvedModule): IProvider {
    let provider: IProvider = Metadata.verifyProvider(resolvedModule.module.provider);
    let moduleMetadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);

    let socketProvider: IProvider = moduleMetadata.sockets
      .map(item => Metadata.verifyProvider(item))
      .find((Class: IProvider) => {
        let metadata: IWebSocketMetadata = Metadata.getComponentConfig(Class.provide);
        return metadata.name === resolvedModule.endpoint;
      });
    if (!isPresent(socketProvider)) {
      throw new HttpError(Status.Bad_Request, `You must define socket within current route: ${resolvedModule.resolvedRoute.route}`, {
        socketName: resolvedModule.endpoint,
        resolvedRoute: resolvedModule.resolvedRoute
      });
    }
    return socketProvider;
  }

  processModule(resolvedModule: IResolvedModule): Promise<SocketResolver> {
    const providers = [
      {provide: "data", useValue: this.data},
      {provide: "request", useValue: this.request},
      {provide: "UUID", useValue: this.id},
      {provide: "resolvedRoute", useValue: resolvedModule.resolvedRoute},
      {provide: "socketProvider", useValue: SocketRequestResolver.getSocketProvider(resolvedModule)},
      EventEmitter
    ];

    const childInjector = Injector.createAndResolveChild(
      resolvedModule.module.injector,
      SocketResolver,
      providers
    );

    const socketResolver: SocketResolver = childInjector.get(SocketResolver);
    this.logger.debug("SocketRequestResolver.processModule: resolved SocketResolver");

    socketResolver.getEventEmitter().on("destroy", () => {
      childInjector.destroy();
    });

    return socketResolver.process();
  }

  protected handleError(data: any): any {
    this.logger.error("SocketRequestResolver.handleError: an error occurred", {data});
    if (data instanceof HttpError) {
      throw data;
    }
    throw new HttpError(Status.Internal_Server_Error, "Could not resolve socket");
  }
}
