import {Injector} from "../injector/injector";
import {BOOTSTRAP_MODULE, createModule, fireRequest} from "./bootstrap";
import {IModule, IModuleMetadata} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {Inject} from "../decorators/inject";
import {Readable, Writable} from "stream";
import {Socket} from "net";
import {IncomingMessage, ServerResponse} from "http";
import {isFunction, isObject, uuid} from "../core";
import {ControllerResolver} from "./controller-resolver";
import {ERROR_KEY} from "./request-resolver";
import {EventEmitter} from "events";
import {HttpError} from "../error";
import {IResolvedRoute} from "../interfaces/iroute";
import {IProvider} from "../interfaces/iprovider";
import {IControllerMetadata} from "../interfaces/icontroller";
import {Methods} from "../router/router";
import {Logger} from "../logger/logger";
import {fireWebSocket, IWebSocketResult} from "./socket";
import * as WebSocket from "ws";

export interface IFakeServerConfig {
}

/**
 * @since 1.0.0
 * @function
 * @name fakeHttpServer
 * @param {Function} Class httpServer class
 * @param {IFakeServerConfig} config fakeHttpServer config
 * @returns {Injector}
 *
 * @description
 * Use fakeHttpServer for testing only
 */
export function fakeHttpServer(Class: Function, config?: IFakeServerConfig): FakeServerApi {

  let metadata: IModuleMetadata = Metadata.getComponentConfig(Class);
  // override bootstrap module
  metadata.name = BOOTSTRAP_MODULE;
  // set module config
  Metadata.setComponentConfig(Class, metadata);
  let modules: Array<IModule> = createModule(Class);
  let fakeServerInjector = Injector.createAndResolve(FakeServerApi, [
    {provide: "modules", useValue: modules}
  ]);
  return fakeServerInjector.get(FakeServerApi);
}

/**
 * @since 1.0.0
 * @function
 * @name fakeControllerActionCall
 * @param {Injector} injector
 * @param {Function | IProvider} controller
 * @param {String} action name to fire action
 * @param {Object} params
 * @param {Object} headers
 *
 * @returns {Promise<string|Buffer>}
 *
 * @description
 * Use fakeControllerCall for testing only
 */
export function fakeControllerActionCall(injector: Injector,
                                         controller: Function | IProvider,
                                         action: string,
                                         params?: Object,
                                         headers?: Object): Promise<string | Buffer> {
  let request = new FakeIncomingMessage();
  request.method = "GET";
  request.headers = isObject(headers) ? headers : {};
  request.url = "/";
  let lambdaEvent = {};
  let lambdaContext = {};
  let response = new FakeServerResponse();
  let controllerProvider: IProvider = Metadata.verifyProvider(controller);
  let metadata: IControllerMetadata = Metadata.getComponentConfig(controllerProvider.provide);
  let route: IResolvedRoute = {
    method: Methods.GET,
    params: isObject(params) ? params : {},
    route: metadata.name + "/" + action
  };
  let providers: Array<IProvider> = [
    {provide: "data", useValue: []},
    {provide: "event", useValue: lambdaEvent},
    {provide: "context", useValue: lambdaContext},
    {provide: "request", useValue: request},
    {provide: "response", useValue: response},
    {provide: "url", useValue: request.url},
    {provide: "UUID", useValue: uuid()},
    {provide: "controllerProvider", useValue: controllerProvider},
    {provide: "actionName", useValue: action},
    {provide: "resolvedRoute", useValue: route},
    {provide: "isForwarded", useValue: false},
    {provide: "isForwarder", useValue: false},
    {provide: "isChainStopped", useValue: false},
    {provide: ERROR_KEY, useValue: new HttpError(500)},
    {provide: EventEmitter, useValue: new EventEmitter()}
  ];
  // if there is no logger provide it
  if (!injector.has(Logger)) {
    providers.push(Metadata.verifyProvider(Logger));
  }
  /**
   * Create and resolve
   */
  let childInjector = Injector.createAndResolveChild(
    injector,
    ControllerResolver,
    providers
  );
  /**
   * On finish destroy injector
   */
  response.on("finish", () => childInjector.destroy());
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
 * @class
 * @name FakeResponseApi
 * @constructor
 * @description
 * FakeResponseApi api
 *
 * @private
 */
export interface FakeResponseApi {
  getStatusCode(): number;

  getBody(): string | Buffer;

  getHeaders(): any;
}

/**
 * @since 2.0.0
 * @interface
 * @name FakeWebSocketApi
 *
 * @description
 * API used to communicate with a fake WebSocket during testing.
 */
export interface FakeWebSocketApi {

  /**
   * @since 2.0.0
   * @function
   * @name FakeWebSocketApi#open
   * @return {Promise<void>} Resolved when the socket is ready, rejected on error
   *
   * @description
   * Opens and prepares the fake socket for usage.
   * You need to call open before receiving or sending data.
   */
  open(): Promise<void>;

  /**
   * @since 2.0.0
   * @function
   * @name FakeWebSocketApi#close
   *
   * @description
   * Closes the fake socket.
   */
  close(): void;

  /**
   * @since 2.0.0
   * @function
   * @name FakeWebSocketApi#send
   * @param {"ws".Data} data Data to send
   *
   * @description
   * Send data over the fake websocket
   */
  send(data: WebSocket.Data): void;

  /**
   * @since 2.0.0
   * @function
   * @name FakeWebSocketApi#getLastReceivedMessage
   * @return {any} The data that was last received over the socket
   *
   * @description
   * Get the last message that had been received via the socket from the server.
   */
  getLastReceivedMessage(): any;

  /**
   * @since 2.0.0
   * @function
   * @name FakeWebSocketApi#onMessage
   * @param {(message: any) => void} cb
   *
   * @description
   * Register a listener to be called whenever a message is sent from the server.
   */
  onMessage(cb: (message: any) => void);
}

/**
 * @since 1.0.0
 * @class
 * @name FakeServerApi
 * @constructor
 * @description
 * Get a FakeServerApi to do serverside requests
 *
 * @private
 */
export class FakeServerApi {

  @Inject("modules")
  private modules: Array<IModule>;

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#getModules
   * @description
   * Get initialized modules
   */
  getModules(): Array<IModule> {
    return this.modules;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#GET
   * @description
   * Fire GET Method
   */
  GET(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "GET";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#OPTIONS
   * @description
   * Fire OPTIONS Method
   */
  OPTIONS(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "OPTIONS";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#HEAD
   * @description
   * Fire HEAD Method
   */
  HEAD(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "HEAD";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#DELETE
   * @description
   * Fire DELETE Method
   */
  DELETE(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "DELETE";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#TRACE
   * @description
   * Fire TRACE Method
   */
  TRACE(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "TRACE";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#CONNECT
   * @description
   * Fire CONNECT Method
   */
  CONNECT(url: string, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "CONNECT";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#POST
   * @description
   * Fire POST Method
   */
  POST(url: string, data?: string | Buffer, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "POST";
    request.url = url;
    request.headers = headers;
    // simulate async event
    setTimeout(() => {
      request.emit("data", data);
      request.emit("end");
    });
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#PUT
   * @description
   * Fire PUT Method
   */
  PUT(url: string, data?: string | Buffer, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "PUT";
    request.url = url;
    request.headers = headers;
    // simulate async event
    setTimeout(() => {
      request.emit("data", data);
      request.emit("end");
    });
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#PATCH
   * @description
   * Fire PATCH Method
   */
  PATCH(url: string, data?: string | Buffer, headers?: Object): Promise<FakeResponseApi> {
    let request = new FakeIncomingMessage();
    request.method = "PATCH";
    request.url = url;
    request.headers = headers;
    // simulate async event
    setTimeout(() => {
      request.emit("data", data);
      request.emit("end");
    });
    return this.request(request, new FakeServerResponse());
  }

  /**
   * @since 2.0.0
   * @function
   * @name FakeServerApi#createSocket
   * @return {Promise<FakeWebSocketApi>} Promise that will resolve if the socket has been verified or rejected otherwise
   *
   * @description
   * Create a fake WebSocket connection. This will trigger the regular resolution process and will try to verify the socket.
   * If verification fails the returned promise will be rejected otherwise it will be resolved and you can use the
   * {@link FakeWebSocketApi} to simulate data exchange.
   */
  createSocket(url: string, headers?: Object): Promise<FakeWebSocketApi> {
    const request = new FakeIncomingMessage();
    request.method = "GET";
    request.url = url;
    request.headers = headers;

    return fireWebSocket(this.getModules(), request)
      .then(result => {
        if (result.error || !isFunction(result.open)) {
          if (result.error instanceof HttpError) {
            throw result.error;
          } else {
            throw new Error("socket resolution failed");
          }
        }

        return new FakeWebSocket(result);
      });
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerApi#request
   * @private
   * @description
   * Fire request
   */
  private request(request: FakeIncomingMessage, response: FakeServerResponse): Promise<FakeResponseApi> {
    return fireRequest(this.getModules(), request, response).then(data => {
      return {
        getBody: () => response.getBody(),
        getHeaders: () => response.getHeaders(),
        getStatusCode: () => response.statusCode
      };
    });
  }
}


/**
 * @since 1.0.0
 * @class
 * @name FakeIncomingMessage
 * @constructor
 * @description
 * FakeIncomingMessage is used by FakeServerApi
 * Simulates socket api
 *
 * @private
 */
class FakeIncomingMessage extends Readable implements IncomingMessage {
  httpVersion: string = "1.1";
  httpVersionMajor: number = 1;
  httpVersionMinor: number = 1;
  connection: Socket;
  headers: any;
  rawHeaders: string[];
  trailers: any;
  rawTrailers: any;
  method?: string;
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  socket: Socket;

  _read(size: number): void {
    console.log(size);
  }

  setTimeout(msecs: number, callback: () => void): this {
    return undefined;
  }

  destroy(error?: Error) {
    return null;
  }
}


/**
 * @since 1.0.0
 * @class
 * @name FakeServerResponse
 * @constructor
 * @description
 * FakeServerResponse is used by FakeServerApi
 * Simulates socket api
 *
 * @private
 */
class FakeServerResponse extends Writable implements ServerResponse {
  upgrading: boolean;
  chunkedEncoding: boolean;
  shouldKeepAlive: boolean;
  useChunkedEncodingByDefault: boolean;
  connection: Socket;
  statusCode: number = 200;
  headers: any = {};
  statusMessage: string;
  headersSent: boolean = false;
  sendDate: boolean;
  message: string | Buffer;
  finished: boolean = false;

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#writeContinue
   * @private
   * @description
   * Write continue chunk
   */
  writeContinue() {
    console.log("writeContinue");
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#addTrailers
   * @private
   * @description
   * Add Header Trailers
   */
  addTrailers(headers: any) {
    console.log(headers);
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#end
   * @private
   * @description
   * End request
   */
  end() {
    this.emit("finish");
    this.finished = true;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#writeHead
   * @private
   * @description
   * Write head
   */
  writeHead(statusCode: number, headers?: any) {
    this.statusCode = statusCode;
    if (isObject(headers)) {
      Object.assign(this.headers, headers);
    }
    this.headersSent = true;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#setHeader
   * @private
   * @description
   * Set response header
   */
  setHeader(name: string, value: string | string[]) {
    this.headers[name] = value;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getHeader
   * @private
   * @description
   * Get response header
   */
  getHeader(name: string): string {
    if (this.hasHeader(name)) {
      return this.headers[name];
    }
    return null;
  }


  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#hasHeader
   * @private
   * @description
   * Has header
   */
  hasHeader(name: string): boolean {
    return this.headers.hasOwnProperty(name);
  }


  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getHeaderNames
   * @private
   * @description
   * Get header names
   */
  getHeaderNames(): string[] {
    return Object.keys(this.headers);
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#removeHeader
   * @private
   * @description
   * Remove response header
   */
  removeHeader(name: string) {
    if (this.headers.hasOwnProperty(name)) {
      delete this.headers[name];
    }
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getHeaders
   * @private
   * @description
   * Get headers
   */
  getHeaders(): { [key: string]: string | string[] } {
    return this.headers;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getBody
   * @private
   * @description
   * Get writed body
   */
  getBody(): string | Buffer {
    return this.message;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getBody
   * @private
   * @description
   * Get writed body
   */
  getStatusCode(): number {
    return this.statusCode;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#write
   * @private
   * @description
   * Write data
   */
  write(value: Buffer | string,
        encoding?: string | Function,
        cb?: Function | string): boolean {
    this.message = value;
    return false;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#assignSocket
   * @private
   * @description
   * assign socket
   */
  assignSocket(socket: Socket): void {
    console.log("assignSocket");
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#detachSocket
   * @private
   * @description
   * detach socket
   */
  detachSocket(socket: Socket): void {
    console.log("assignSocket");
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#setTimeout
   * @private
   * @description
   * set timeout
   */
  setTimeout(msecs: number, callback?: () => void): this {
    return null;
  }

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#flushHeaders
   * @private
   * @description
   * flush headers
   */
  flushHeaders(): void {
    console.log("flushHeaders");
  }
}

/**
 * @since 2.0.0
 * @private
 * @class
 * @name FakeWebSocket
 * @constructor
 *
 * @description
 * Implements a dummy socket API providing logic for usage by in tests
 */
class FakeWebSocket implements FakeWebSocketApi {

  private eventEmitter = new EventEmitter();
  private readyState: number = 0;
  private lastReceivedMessage: WebSocket.Data;

  /**
   * @since 2.0.0
   * @private
   * @constructor
   * @param {IWebSocketResult} socket The socket result to wrap
   */
  constructor(private readonly socket: IWebSocketResult) {
    this.onMessage((data: WebSocket.Data) => this.lastReceivedMessage = data);
  }

  /**
   * @inheritDoc
   */
  open(): Promise<void> {
    return this.socket
      .open(<any> {
        on: this.eventEmitter.on.bind(this.eventEmitter),
        send: (data) => {
          this.eventEmitter.emit("_receive", data);
        },
        close: this.close.bind(this)
      })
      .then(() => {
        this.readyState = 1;
        this.eventEmitter.on("close", () => this.readyState = 3);
      }, (error) => {
        this.readyState = 3;
        throw error;
      });
  }

  /**
   * @inheritDoc
   */
  close(): void {
    this.readyState = 2;
    this.eventEmitter.emit("close");
    this.socket.finished();
    this.eventEmitter.removeAllListeners();
  }

  /**
   * @inheritDoc
   */
  send(data: WebSocket.Data): void {
    if (this.readyState !== 1) {
      throw new Error("Socket must be opened first");
    }
    this.eventEmitter.emit("message", data);
  }

  /**
   * @inheritDoc
   */
  getLastReceivedMessage(): any {
    return this.lastReceivedMessage;
  }

  /**
   * @inheritDoc
   */
  onMessage(cb: (message: WebSocket.Data) => void) {
    this.eventEmitter.on("_receive", data => cb(data));
  }

}
