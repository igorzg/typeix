import {IProvider, IAfterConstruct} from "../interfaces/iprovider";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {IncomingMessage, ServerResponse} from "http";
import {Logger} from "../logger/logger";
import {Router, Methods} from "../router/router";
import {Url} from "url";
import {IResolvedModule, IModule, IModuleMetadata} from "../interfaces/imodule";
import {ResolvedRoute} from "../interfaces/iroute";
import {isPresent, isString, isClass} from "../core";
import {HttpError} from "../error";
import {Metadata} from "../injector/metadata";
import {IControllerMetadata} from "../interfaces/icontroller";
import {getModule} from "./bootstrap";
import {ControllerResolver} from "./request";
import {EventEmitter} from "events";
import {Injector} from "../injector/injector";
import {clean} from "../logger/inspect";

/**
 * @since 1.0.0
 * @class
 * @name RouteResolver
 * @constructor
 * @description
 * Get current request and resolve module and route
 *
 * @private
 */
@Injectable()
export class RouteResolver implements IAfterConstruct {

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
   * @param {Array<Buffer>} data
   * @description
   * Data received by client on POST, PATCH, PUT requests
   */
  @Inject("data")
  private data: Array<Buffer>;

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
   * @param {Url} url
   * @description
   * Parsed request url
   */
  @Inject("modules")
  private modules: Array<IModule>;

  /**
   * @param {Number} statusCode
   * @description
   * ControllerResolver status code default 200
   */
  @Inject("statusCode", true)
  private statusCode: number;

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
  private eventEmitter: EventEmitter;

  /**
   * @since 1.0.0
   * @function
   * @name RouteResolver#afterConstruct
   *
   * @private
   * @description
   * Create events for status code and content type change
   */
  afterConstruct() {
    this.eventEmitter.on("statusCode", value => this.statusCode = value);
    this.eventEmitter.on("contentType", value => this.contentType = value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteResolver#render
   * @param {Buffer|String} response
   *
   * @private
   * @description
   * This method sends data to client
   */
  render(response: string | Buffer): string | Buffer {
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
   * @name RouteResolver#getControllerProvider
   * @private
   * @description
   * Returns a controller provider
   */
  getControllerProvider(resolvedModule: IResolvedModule): IProvider {

    let provider: IProvider = Metadata.verifyProvider(resolvedModule.module.provider);
    let moduleMetadata: IModuleMetadata = Metadata.getComponentConfig(provider.provide);

    let controllerProvider: IProvider = moduleMetadata.controllers
      .map(item => Metadata.verifyProvider(item))
      .find((Class: IProvider) => {
        let metadata: IControllerMetadata = Metadata.getComponentConfig(Class.provide);
        return metadata.name === resolvedModule.controller;
      });
    if (!isPresent(controllerProvider)) {
      throw new HttpError(500, `You must define controller within current route: ${resolvedModule.resolvedRoute.route}`, {
        controllerName: resolvedModule.controller,
        actionName: resolvedModule.action,
        resolvedRoute: resolvedModule.resolvedRoute
      });
    }
    return controllerProvider;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteResolver#processModule
   * @private
   * @description
   * Resolve route and deliver resolved module
   */
  processModule(resolvedModule: IResolvedModule): Promise<string|Buffer> {

    let childInjector = Injector.createAndResolveChild(
      resolvedModule.module.injector,
      ControllerResolver,
      [
        {provide: "data", useValue: this.data},
        {provide: "request", useValue: this.request},
        {provide: "response", useValue: this.response},
        {provide: "url", useValue: this.url},
        {provide: "UUID", useValue: this.id},
        {provide: "controllerProvider", useValue: this.getControllerProvider(resolvedModule)},
        {provide: "actionName", useValue: resolvedModule.action},
        {provide: "resolvedRoute", useValue: resolvedModule.resolvedRoute},

        {provide: "isRedirected", useValue: false},
        {provide: "isCustomError", useValue: false},
        {provide: "isForwarded", useValue: false},
        {provide: "isForwarder", useValue: false},
        {provide: "isChainStopped", useValue: false},
        {provide: EventEmitter, useValue: this.eventEmitter}
      ]
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
     * Process request
     */
    return pRequest.process();
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteResolver#process
   * @private
   * @description
   * Resolve route and deliver resolved module
   */
  process(): Promise<any> {

    // process request
    return this.router
      .parseRequest(this.url.pathname, this.request.method, this.request.headers)
      .then((resolvedRoute: ResolvedRoute) => {
        this.logger.info("Route.parseRequest", {
          method: this.request.method,
          path: this.url.pathname,
          route: resolvedRoute
        });

        if ([Methods.POST, Methods.PATCH, Methods.PUT].indexOf(resolvedRoute.method) > -1) {
          this.request.on("data", item => this.data.push(<Buffer> item));
          return new Promise((resolve, reject) => {
            this.request.on("error", reject.bind(this));
            this.request.on("end", resolve.bind(this, resolvedRoute));
          });
        }
        return resolvedRoute;
      })
      .then((resolvedRoute: ResolvedRoute) => {

        // define module controller action
        let [module, controller, action] = resolvedRoute.route.split("/");
        return {
          module: !isPresent(action) ? getModule(this.modules) : getModule(this.modules, module),
          controller: !isPresent(action) ? module : controller,
          action: !isPresent(action) ? controller : action,
          resolvedRoute,
          data: this.data
        };
      })
      .then((resolvedModule: IResolvedModule) => this.processModule(resolvedModule))
      .then(data => this.render(data))
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
        //
        // if (isPresent(this.reflectionInjector)) {
        //   // define module controller action
        //   let resolvedRoute: ResolvedRoute = this.reflectionInjector.get("resolvedRoute");
        //
        //   let [module, controller, action] = resolvedRoute.route.split("/");
        //
        //   if (!isPresent(action)) {
        //     // find controller
        //     let controllerProvider = this.getControllerProvider(module, controller, resolvedRoute);
        //     // get mapped action metadata
        //     let mappedAction: any = this.getMappedAction(controllerProvider, controller, resolvedRoute);
        //     // get on error
        //     let onError = this.getDecoratorByMappedAction(controllerProvider, mappedAction, "OnError");
        //     // if on error is present define custom error
        //     if (isPresent(onError)) {
        //       // set code from it
        //       this.statusCode = onError.value.status;
        //       // get custom message
        //       return onError.value.message;
        //     }
        //
        //   }
        // }
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
}
