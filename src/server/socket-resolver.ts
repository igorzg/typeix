import {IncomingMessage} from "http";
import {getMethodName} from "../router/router";
import {isFunction, isPresent} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IControllerMetadata, IProvider, IResolvedRoute} from "../interfaces";
import {EventEmitter} from "events";
import {Inject, Injectable} from "../decorators";
import {FUNCTION_KEYS, FUNCTION_PARAMS, Metadata} from "../injector/metadata";
import {IParam} from "../interfaces/iparam";
import {BaseRequest, Request} from "./request";
import * as WebSocket from "ws";
import {IAction} from "../interfaces/iaction";
import {ControllerResolver} from "./controller-resolver";
import {Socket} from "./socket";

/**
 * @since 1.0.0
 * @class
 * @name SocketResolver
 * @constructor
 * @description
 * SocketResolver is responsible for handling router result and processing all requests in system
 * This component is used internally by framework
 *
 * @private
 */
@Injectable()
export class SocketResolver {

  /**
   * @param IncomingMessage
   * @description
   * Value provided by injector which handles request input
   */
  @Inject("request")
  private request: IncomingMessage;

  /**
   * @param {Array<Buffer>} data
   * @description
   * Data received by client on initial POST, PATCH, PUT requests
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
   * @param {IProvider} controllerProvider
   * @description
   * Injector
   */
  @Inject("socketProvider")
  private socketProvider: IProvider;

  /**
   * @param {IResolvedRoute} resolvedRoute
   * @description
   * Resolved route from injector
   */
  @Inject("resolvedRoute")
  private resolvedRoute: IResolvedRoute;

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
   * @description
   * Created socket instance
   */
  private socket: any;

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

  getResolvedRoute(): IResolvedRoute {
    return this.resolvedRoute;
  }

  getId(): string {
    return this.id;
  }

  getBody(): Array<Buffer> {
    return this.data;
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
    if (isPresent(this.socket) && isFunction(this.socket.afterClose)) {
      this.socket.afterClose();
    }

    this.eventEmitter.emit("destroy");
    this.eventEmitter.removeAllListeners();
    this.socket = null;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#process
   * @private
   * @description
   * Process request logic
   */
  async process(): Promise<SocketResolver> {
    // set request reflection
    const reflectionInjector = Injector.createAndResolveChild(this.injector, BaseRequest, [
      {provide: "data", useValue: this.data},
      {provide: "request", useValue: this.request},
      {provide: "UUID", useValue: this.id},
      {provide: "resolvedRoute", useValue: this.resolvedRoute}
    ]);

    const metadata: IControllerMetadata = Metadata.getComponentConfig(this.socketProvider.provide);
    const providers: Array<IProvider> = Metadata.verifyProviders(metadata.providers);
    // limit socket api
    const limitApi = ["request", "response", "modules"];
    limitApi.forEach(item => providers.push({provide: item, useValue: {}}));

    const socketInjector = Injector.createAndResolveChild(
      reflectionInjector,
      this.socketProvider,
      Metadata.verifyProviders(providers)
    );

    this.socket = socketInjector.get(this.socketProvider.provide);

    await this.processSocketHook("verify");
    return this;
  }

  async openSocket(ws: WebSocket): Promise<any> {
    this.injector.set(Socket, new Socket(ws));

    ws.on("message", (data: WebSocket.Data) => {
      this.injector.set("message", data);
      this.processSocketHook("message");
    });

    this.processSocketHook("open");
  }

  private async processSocketHook(actionName: string) {
    const action = this.getMappedHook(this.socketProvider, actionName);

    if (!isPresent(action) || !isFunction(this.socket[action.key])) {
      this.logger.debug("Tried to call socket @Hook but not available", {
        hook: actionName
      });
      return;
    }

    const func: Function = this.socket[action.key].bind(this.socket);
    const args = this.getAnnotatedArguments(this.socketProvider, action.key);

    return await func.apply(this.socket, args);
  }

  private getMappedHook(socketProvider: IProvider, actionName: String): IAction {
    // get mappings from controller
    let mappings = Metadata
      .getMetadata(this.socketProvider.provide.prototype, FUNCTION_KEYS)
      .filter((item: IAction) =>
        item.type === "Hook" && item.value === actionName &&
        ControllerResolver.isControllerInherited(this.socketProvider.provide, item.proto)
      );

    let mappedAction;
    // search mapped on current controller
    if (mappings.length > 0) {
      mappedAction = mappings.find(item => item.className === Metadata.getName(socketProvider.provide));
    }
    // get first parent one from inheritance
    if (!isPresent(mappedAction)) {
      mappedAction = mappings.pop();
    }
    return mappedAction;
  }


  private getAnnotatedArguments(provider: IProvider, functionName: string): Array<any> {
    const params: Array<IParam> = Metadata
      .getMetadata(provider.provide.prototype, FUNCTION_PARAMS)
      .filter((param: IParam) => param.key === functionName);

    return params
      .sort((p1, p2) => p1.paramIndex - p2.paramIndex)
      .map((param: IParam) => {
        switch (param.type) {
          case "Param":
            if (isPresent(this.resolvedRoute.params) && this.resolvedRoute.params.hasOwnProperty(param.value)) {
              return this.resolvedRoute.params[param.value];
            } else {
              return null;
            }
          case "Inject":
            return this.injector.get(param.value);
        }
      });
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#benchmark
   * @private
   * @description
   * Print benchmark
   */
  private benchmark(message: string, start: number) {
    this.logger.benchmark(`${message}: ${(Date.now() - start)}ms`, {
      method: getMethodName(this.resolvedRoute.method),
      route: this.resolvedRoute.route,
      url: this.request.url
    });
  }
}
