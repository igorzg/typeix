import {Injector} from "../injector/injector";
import {fireRequest, createModule, BOOTSTRAP_MODULE} from "./bootstrap";
import {IModuleMetadata, IModule} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {Inject} from "../decorators/inject";
import {Readable, Writable} from "stream";
import {Socket} from "net";
import {ServerResponse, IncomingMessage} from "http";
import {isObject} from "../core";

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
 * Use httpServer function to httpServer an Module.
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
  POST(url: string, data?: string|Buffer, headers?: Object): Promise<FakeResponseApi> {
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
  PUT(url: string, data?: string|Buffer, headers?: Object): Promise<FakeResponseApi> {
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
  PATCH(url: string, data?: string|Buffer, headers?: Object): Promise<FakeResponseApi> {
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
        getStatusCode: () => response.statusCode,
        getHeaders: () => response.getHeaders(),
        getBody: () => response.getBody()
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

  protected _read(size: number): void {
  };

  setTimeout(msecs: number, callback: Function): NodeJS.Timer {
    return null;
  };

  destroy(error?: Error) {
  };
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

  // Extended base methods

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
  };

  /**
   * @since 1.0.0
   * @function
   * @name FakeServerResponse#getHeader
   * @private
   * @description
   * Get response header
   */
  getHeader(name: string): string {
    if (this.headers.hasOwnProperty(name)) {
      return this.headers[name];
    }
    return null;
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
  getHeaders(): {[key: string]: string | string[]} {
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

  setTimeout(msecs: number, callback: Function): ServerResponse {
    return null;
  };

}
