import {IncomingMessage} from "http";
import {isFunction, isPresent} from "../core";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IControllerMetadata, IProvider, IResolvedRoute} from "../interfaces";
import {EventEmitter} from "events";
import {Inject, Injectable} from "../decorators";
import {FUNCTION_KEYS, FUNCTION_PARAMS, Metadata} from "../injector/metadata";
import {IParam} from "../interfaces/iparam";
import {BaseRequest} from "./request";
import * as WebSocket from "ws";
import {IAction} from "../interfaces/iaction";
import {ControllerResolver} from "./controller-resolver";
import {Socket} from "./socket";

/**
 * @since 2.0.0
 * @private
 * @class
 * @name SocketResolver
 * @constructor
 *
 * @description
 * This component is responsible for finding and instantiating the correctly annotated {@link WebSocket} class
 * in the application. It is used internally by the framework.
 */
@Injectable()
export class SocketResolver {

  /**
   * The original incoming upgrade request
   */
  @Inject("request")
  private request: IncomingMessage;

  /**
   * Data received by client on initial POST, PATCH, PUT requests
   */
  @Inject("data")
  private data: Array<Buffer>;

  /**
   * UUID identifier of request
   */
  @Inject("UUID")
  private id: string;

  /**
   * The designated {@link WebSocket} provider
   */
  @Inject("socketProvider")
  private socketProvider: IProvider;

  /**
   * Resolved route from injector
   */
  @Inject("resolvedRoute")
  private resolvedRoute: IResolvedRoute;

  /**
   * Injector which created request
   */
  @Inject(Injector)
  private injector: Injector;

  /**
   * Provided by injector
   */
  @Inject(Logger)
  private logger: Logger;

  /**
   * Responsible for handling events
   */
  @Inject(EventEmitter)
  private eventEmitter: EventEmitter;

  /**
   * Created socket instance
   */
  private socket: any;

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getEventEmitter
   *
   * @description
   * Get request event emitter
   */
  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getIncomingMessage
   *
   * @description
   * Get underlying upgrade request
   */
  getIncomingMessage(): IncomingMessage {
    return this.request;
  }

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getResolvedRoute
   *
   * @description
   * Get originally resolved route
   */
  getResolvedRoute(): IResolvedRoute {
    return this.resolvedRoute;
  }

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getId
   *
   * @description
   * Get unique request ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getBody
   *
   * @description
   * Get the data sent with the upgrade request
   */
  getBody(): Array<Buffer> {
    return this.data;
  }

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#destroy
   *
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
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#process
   * @return {Promise<SocketResolver>} Promise to resolve when the socket was created and verified successfully
   *
   * @description
   * Process request logic by creating and verifying the socket
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

  /**
   * @sicne 2.0.0
   * @function
   * @name SocketResolver#openSocket
   * @param {WebSocket} ws The "ws".WebSocket representing the real socket
   * @return {Promise<any>} Promise to resolve when the socket has been opened successfully
   *
   * @description
   * Tries to call the open method on the created {@link WebSocket} and sets up message listeners.
   */
  async openSocket(ws: WebSocket): Promise<any> {
    this.injector.set(Socket, new Socket(ws));

    ws.on("message", (data: WebSocket.Data) => {
      this.injector.set("message", data);
      this.processSocketHook("message");
    });

    this.processSocketHook("open");
  }

  /**
   * @since 2.0.0
   * @function
   * @name SocketResolver#processSocketHook
   * @param {string} actionName Name of the {@link Hook} to invoke
   * @return {Promise<any>} Promise resolved when the hook had been invoked successfully
   *
   * @description
   * Tries to invoke the {@link Hook} for the given name on the created socket.
   */
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

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getMappedHook
   * @param {IProvider} socketProvider The provider of the socket
   * @param {String} actionName The hook name to call
   * @return {IAction} The action representing the hook
   *
   * @description
   * Investigates the metadata of the given provider to find the action representing the hook with the given name.
   */
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

  /**
   * @since 2.0.0
   * @private
   * @function
   * @name SocketResolver#getAnnotatedArguments
   * @param {IProvider} provider The socket provider
   * @param {string} functionName The name of the function to get argument information for
   * @return {Array<any>} The values to use as arguments
   *
   * @description
   * Inspects the given function of the provider and returns the correct argument values
   */
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
}
